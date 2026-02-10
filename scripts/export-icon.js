#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const fsp = fs.promises;
const path = require("node:path");
const process = require("node:process");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const DEFAULT_SIZE = 1024;
const DEFAULT_COLOR = "#00ffff";
const OUTPUT_DIR = "exports";
const XML_HEADER = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";

function parseArgs(argv) {
  const options = {
    size: DEFAULT_SIZE,
    color: DEFAULT_COLOR,
    particleColor: null,
    opacity: 1,
    outDir: OUTPUT_DIR,
    fileName: "logo",
    png: true,
    densityMultiplier: 2,
    background: null,
    circularBackground: false,
    padding: null,
    component: "Logo",
    scale: 1.0,
  };

  const normalized = [];
  for (let i = 0; i < argv.length; i++) {
    const current = argv[i];
    if (current.startsWith("--") && current.includes("=")) {
      const [flag, value] = current.split("=", 2);
      normalized.push(flag, value);
    } else {
      normalized.push(current);
    }
  }

  for (let i = 0; i < normalized.length; i++) {
    const token = normalized[i];
    if (!token.startsWith("--")) continue;
    const next = normalized[i + 1];
    switch (token) {
      case "--size":
        options.size = parseInteger(next, options.size, "size");
        i++;
        break;
      case "--color":
        options.color = next ?? options.color;
        i++;
        break;
      case "--particle-color":
        options.particleColor = next ?? null;
        i++;
        break;
      case "--opacity":
        options.opacity = clamp(Number(next), 0, 1, options.opacity);
        i++;
        break;
      case "--output":
        options.outDir = next ?? options.outDir;
        i++;
        break;
      case "--name":
        options.fileName = next ?? options.fileName;
        i++;
        break;
      case "--svg-only":
        options.png = false;
        break;
      case "--density-multiplier":
        options.densityMultiplier = Math.max(
          1,
          parseInteger(next, options.densityMultiplier, "density multiplier"),
        );
        i++;
        break;
      case "--background":
        options.background = parseBackground(next);
        i++;
        break;
      case "--circular-background":
        options.circularBackground = true;
        break;
      case "--padding":
        options.padding = parseInteger(next, 0, "padding", true);
        i++;
        break;
      case "--component":
        if (next === "ForksLogo" || next === "forks") {
          options.component = "ForksLogo";
          if (options.fileName === "logo") options.fileName = "forks-logo";
        } else if (next === "Logo" || next === "logo") {
          options.component = "Logo";
        } else {
          throw new Error(`Unknown component: ${next}. Use "Logo" or "ForksLogo".`);
        }
        i++;
        break;
      case "--scale":
        options.scale = clamp(Number(next), 0.1, 2.0, options.scale);
        i++;
        break;
      default:
        throw new Error(`Unknown flag: ${token}`);
    }
  }

  if (!options.particleColor) {
    options.particleColor = options.color;
  }

  return options;
}

function parseInteger(value, fallback, label, allowZero = false) {
  if (value === undefined || value === null) return fallback;
  const parsed = Number.parseInt(value, 10);
  const minValue = allowZero ? 0 : 1;
  if (Number.isNaN(parsed) || parsed < minValue) {
    throw new Error(`Invalid ${label ?? "value"}: ${value}`);
  }
  return parsed;
}

function clamp(value, min, max, fallback) {
  if (Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function parseBackground(value) {
  if (!value) return null;
  if (value.toLowerCase() === "transparent") {
    return { r: 0, g: 0, b: 0, alpha: 0 };
  }

  const hex = value.replace(/^#/, "");
  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error(
      `Background must be a 6 or 8 character hex color (e.g. #112233 or #11223344). Received: ${value}`,
    );
  }
  const r = Number.parseInt(hex.slice(0, 2), 16);
  const g = Number.parseInt(hex.slice(2, 4), 16);
  const b = Number.parseInt(hex.slice(4, 6), 16);
  const alpha = hex.length === 8 ? Number.parseInt(hex.slice(6, 8), 16) / 255 : 1;
  return { r, g, b, alpha };
}

function loadLogoComponent(componentName = "Logo") {
  const fileName = componentName === "ForksLogo" ? "ForksLogo.tsx" : "Logo.tsx";
  const filePath = path.resolve(__dirname, `../src/${fileName}`);
  const source = fs.readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2019,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      sourceMap: false,
    },
    fileName,
  });

  const module = { exports: {} };
  const script = new vm.Script(transpiled.outputText, { filename: `${componentName}.generated.js` });
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

  const exported = module.exports;
  return exported[componentName] || exported.default;
}

async function ensureDirectory(dir) {
  await fsp.mkdir(dir, { recursive: true });
}

async function writeSvg(filePath, markup) {
  await fsp.writeFile(filePath, `${XML_HEADER}\n${markup}`);
}

async function maybeWritePng(svgMarkup, options, destination) {
  if (!options.png) {
    return { skipped: true, reason: "PNG generation disabled via --svg-only" };
  }

  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch (error) {
    return {
      skipped: true,
      reason:
        "sharp is not installed. Install it with `npm install sharp` to enable PNG output.",
      error,
    };
  }

  const svgBuffer = Buffer.from(`${XML_HEADER}\n${svgMarkup}`);
  const density = Math.max(1, Math.round(options.size * options.densityMultiplier));
  let pipeline = sharp(svgBuffer, { density });

  pipeline = pipeline.resize({
    width: options.size,
    height: options.size,
    fit: "contain",
    kernel: "lanczos3" // Use highest quality resampling
  });

  // Flatten with background color if specified (but not for circular backgrounds)
  if (options.background && options.background.alpha > 0 && !options.circularBackground) {
    pipeline = pipeline.flatten({ background: options.background });
  }

  pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });

  await pipeline.toFile(destination);
  return { skipped: false };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const outputDir = path.resolve(process.cwd(), options.outDir);
  const baseName = `${options.fileName}-${options.size}`;
  const svgPath = path.join(outputDir, `${baseName}.svg`);
  const pngPath = path.join(outputDir, `${baseName}.png`);

  const Logo = loadLogoComponent(options.component);
  if (typeof Logo !== "function") {
    throw new Error(`Unable to load ${options.component} component. Ensure src/${options.component}.tsx exports the component.`);
  }

  const element = React.createElement(Logo, {
    width: options.size,
    height: options.size,
    color: options.color,
    particleColor: options.particleColor,
    opacity: options.opacity,
  });
  let svgMarkup = renderToStaticMarkup(element);

  // Remove the glow effect for static icons (radius 80 circle with sphereGlow gradient)
  svgMarkup = svgMarkup.replace(/<circle cx="100" cy="100" r="80"[^>]*fill="url\(#sphereGlow\)"[^>]*><\/circle>/, '');

  // Apply scale if specified (scales logo content, not viewBox)
  if (options.scale !== 1.0) {
    svgMarkup = svgMarkup.replace(
      /(<\/defs>)/,
      `$1<g transform="translate(100,100) scale(${options.scale}) translate(-100,-100)">`
    );
    svgMarkup = svgMarkup.replace(/<\/svg>$/, '</g></svg>');
  }

  // Adjust viewBox if padding is specified (crops around the circle)
  // Circle is at cx=100, cy=100 with r=67, so bounds are 33,33 to 167,167
  if (options.padding !== null) {
    const circleRadius = 67;
    const circleCenter = 100;
    const minCoord = circleCenter - circleRadius - options.padding;
    const viewSize = (circleRadius + options.padding) * 2;
    svgMarkup = svgMarkup.replace(
      /viewBox="[^"]*"/,
      `viewBox="${minCoord} ${minCoord} ${viewSize} ${viewSize}"`
    );
  }

  // Insert background if specified
  if (options.background && options.background.alpha > 0) {
    const { r, g, b, alpha } = options.background;
    const bgColor = `rgba(${r},${g},${b},${alpha})`;
    // Insert background right after the opening <svg> tag
    const bgElement = options.circularBackground
      ? `<circle cx="100" cy="100" r="70" fill="${bgColor}" shape-rendering="geometricPrecision"/>`
      : `<rect width="100%" height="100%" fill="${bgColor}"/>`;
    svgMarkup = svgMarkup.replace(
      /(<svg[^>]*>)/,
      `$1${bgElement}`
    );
  }

  await ensureDirectory(outputDir);
  await writeSvg(svgPath, svgMarkup);

  const pngResult = await maybeWritePng(svgMarkup, options, pngPath);

  console.log(`SVG written to ${path.relative(process.cwd(), svgPath)}`);
  if (pngResult.skipped) {
    console.log(`PNG skipped: ${pngResult.reason}`);
    if (pngResult.error && process.env.DEBUG) {
      console.error(pngResult.error);
    }
  } else {
    console.log(`PNG written to ${path.relative(process.cwd(), pngPath)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
