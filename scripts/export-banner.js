#!/usr/bin/env node
"use strict";

/**
 * Render TrailCityBanner to upload-ready PNGs at the native dimensions of each
 * social surface. (Pass --svg to also write the source SVG.)
 *
 * Usage:
 *   node scripts/export-banner.js                       # all variants, iceTangerine
 *   node scripts/export-banner.js --variant twitterHeader
 *   node scripts/export-banner.js --theme landingPage --seed 12 --leader 2
 *   node scripts/export-banner.js --no-chip --scales 1,2   # opt in to extra scales
 *
 * Flags:
 *   --variant   twitterHeader | linkedinCompany | all   (default all)
 *   --theme     <name> from @principal-ade/industry-theme, sans "Theme"
 *               (default iceTangerine)
 *   --seed      layout seed                              (default 7)
 *   --leader    1-based marker the card connects to      (default 2)
 *   --no-chip   hide the code chip
 *   --no-trail  hide the trail + markers
 *   --no-reserve-left   don't fade the left logo zone
 *   --scales    comma list of scale factors              (default 1)
 *   --out       output directory                         (default exports/banners)
 *   --svg       also write the source SVG (default: PNG only)
 *   --svg-only  write only the SVG, skip PNG rasterization
 */

const fs = require("node:fs");
const fsp = fs.promises;
const path = require("node:path");
const process = require("node:process");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>';

// Friendly file names + native sizes (must match TrailCityBanner's VARIANTS).
const PRESETS = {
  twitterHeader: { w: 1500, h: 500, slug: "x-company-header" },
  linkedinCompany: { w: 1128, h: 191, slug: "linkedin-company-cover" },
  linkedinProfile: { w: 1584, h: 396, slug: "linkedin-profile-background" },
};

function parseArgs(argv) {
  const opts = {
    variant: "all",
    theme: "iceTangerine",
    seed: 7,
    leader: 2,
    chip: undefined, // undefined => component's per-variant default
    trail: true,
    reserveLeft: true,
    scales: [1],
    out: "exports/banners",
    png: true,
    svg: false, // write the .svg source too (off by default — PNG only)
    style: "trail", // trail | marketing
    headline: undefined,
    tagline: undefined,
    byline: undefined,
    wordmark: undefined, // trail style: spell text out of the city instead of a skyline
  };
  const norm = [];
  for (const a of argv) {
    if (a.startsWith("--") && a.includes("=")) norm.push(...a.split("=", 2));
    else norm.push(a);
  }
  for (let i = 0; i < norm.length; i++) {
    const t = norm[i];
    const next = norm[i + 1];
    switch (t) {
      case "--variant": opts.variant = next; i++; break;
      case "--theme": opts.theme = next; i++; break;
      case "--seed": opts.seed = Number(next); i++; break;
      case "--leader": opts.leader = Number(next); i++; break;
      case "--no-chip": opts.chip = false; break;
      case "--chip": opts.chip = true; break;
      case "--no-trail": opts.trail = false; break;
      case "--no-reserve-left": opts.reserveLeft = false; break;
      case "--style": opts.style = next; i++; break; // trail | marketing
      case "--headline": opts.headline = next; i++; break;
      case "--tagline": opts.tagline = next; i++; break;
      case "--byline": opts.byline = next; i++; break;
      case "--wordmark": opts.wordmark = next; i++; break;
      case "--city-left": opts.cityLeft = true; break;
      case "--city-right": opts.cityLeft = false; break;
      case "--scales": opts.scales = next.split(",").map(Number).filter((n) => n > 0); i++; break;
      case "--out": opts.out = next; i++; break;
      case "--svg": opts.svg = true; break;
      case "--svg-only": opts.svg = true; opts.png = false; break;
      default: break;
    }
  }
  return opts;
}

function loadComponent(componentName) {
  const filePath = path.resolve(__dirname, `../src/${componentName}.tsx`);
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      sourceMap: false,
    },
    fileName: `${componentName}.tsx`,
  });
  const module = { exports: {} };
  const script = new vm.Script(transpiled.outputText, {
    filename: `${componentName}.generated.js`,
  });
  const context = vm.createContext({
    require,
    module,
    exports: module.exports,
    __dirname: path.dirname(filePath),
    __filename: filePath.replace(/\.tsx$/, ".js"),
    process,
    console,
  });
  script.runInContext(context);
  return module.exports[componentName] || module.exports.default;
}

function resolveTheme(name) {
  const pkg = require("@principal-ade/industry-theme");
  const key = `${name}Theme`;
  const theme = pkg[key];
  if (!theme) {
    const available = Object.keys(pkg)
      .filter((k) => /Theme$/.test(k))
      .map((k) => k.replace(/Theme$/, ""))
      .join(", ");
    throw new Error(`Unknown theme "${name}". Available: ${available}`);
  }
  return theme;
}

/** Give the root <svg> an explicit xmlns + pixel size so librsvg rasterizes
 *  at exact dimensions, and drop the responsive width:100% style. */
function finalizeSvg(markup, w, h) {
  let out = markup.replace(/style="[^"]*"/, ""); // remove the first (root) style
  out = out.replace(
    /^<svg /,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" `,
  );
  return out;
}

async function rasterize(svg, w, h, scale, dest) {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch (error) {
    return { skipped: true, reason: "sharp not installed (npm i -D sharp)", error };
  }
  const buffer = Buffer.from(`${XML_HEADER}\n${svg}`);
  await sharp(buffer, { density: Math.round(96 * scale) })
    .resize(Math.round(w * scale), Math.round(h * scale), { fit: "fill", kernel: "lanczos3" })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(dest);
  return { skipped: false };
}

async function exportVariant(Banner, variant, theme, opts, outDir) {
  const preset = PRESETS[variant];
  const props =
    opts.style === "marketing"
      ? {
          variant,
          ...(opts.theme === "iceTangerine" ? {} : { theme }), // marketing defaults to its baked navy palette
          ...(opts.headline === undefined ? {} : { headline: opts.headline }),
          ...(opts.tagline === undefined ? {} : { tagline: opts.tagline }),
          ...(opts.byline === undefined ? {} : { byline: opts.byline }),
          ...(opts.cityLeft === undefined ? {} : { cityLeft: opts.cityLeft }),
        }
      : {
          variant,
          theme,
          seed: opts.seed,
          leaderMarker: opts.leader,
          showTrail: opts.trail,
          reserveLeft: opts.reserveLeft,
          ...(opts.chip === undefined ? {} : { showChip: opts.chip }),
          ...(opts.wordmark === undefined ? {} : { wordmark: opts.wordmark }),
        };
  const svg = finalizeSvg(renderToStaticMarkup(React.createElement(Banner, props)), preset.w, preset.h);

  // Name by surface, not theme. The two styles map to two audiences:
  //   • trail / wordmark style → "company" surfaces
  //   • marketing style        → "profile" surfaces
  // On X both are the same 1500×500 header, distinguished only by style; on
  // LinkedIn they're already separate variants (cover vs background).
  const base =
    variant === "twitterHeader"
      ? opts.style === "marketing"
        ? "x-profile-header"
        : "x-company-header"
      : preset.slug;

  // The SVG source is built in memory to rasterize the PNG; only write the
  // .svg file when explicitly asked (--svg / --svg-only).
  if (opts.svg) {
    const svgPath = path.join(outDir, `${base}.svg`);
    await fsp.writeFile(svgPath, `${XML_HEADER}\n${svg}`);
    console.log(`  svg  → ${path.relative(process.cwd(), svgPath)}  (${preset.w}×${preset.h})`);
  }

  if (!opts.png) return;
  for (const scale of opts.scales) {
    const suffix = scale === 1 ? "" : `@${scale}x`;
    const pngPath = path.join(outDir, `${base}${suffix}.png`);
    const r = await rasterize(svg, preset.w, preset.h, scale, pngPath);
    if (r.skipped) {
      console.log(`  png  ✗ ${r.reason}`);
      if (r.error && process.env.DEBUG) console.error(r.error);
      break;
    }
    console.log(
      `  png  → ${path.relative(process.cwd(), pngPath)}  (${Math.round(preset.w * scale)}×${Math.round(preset.h * scale)})`,
    );
  }
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  const outDir = path.resolve(process.cwd(), opts.out);
  await fsp.mkdir(outDir, { recursive: true });

  const componentName = opts.style === "marketing" ? "TrailMarketingBanner" : "TrailCityBanner";
  const Banner = loadComponent(componentName);
  if (typeof Banner !== "function") {
    throw new Error(`Could not load ${componentName} from src/${componentName}.tsx`);
  }
  const theme = resolveTheme(opts.theme);

  const variants =
    opts.variant === "all" ? Object.keys(PRESETS) : [opts.variant];
  for (const v of variants) {
    if (!PRESETS[v]) {
      throw new Error(`Unknown variant "${v}". Use: ${Object.keys(PRESETS).join(", ")}, or all`);
    }
    console.log(`\n${v}  [theme: ${opts.theme}]`);
    await exportVariant(Banner, v, theme, opts, outDir);
  }
  console.log(`\nDone → ${path.relative(process.cwd(), outDir)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
