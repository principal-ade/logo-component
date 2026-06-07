# Logo Deployments

Tracks where logos are deployed across projects and the export settings used.

## Current Theme: Slate Gold

| Property | Value |
|----------|-------|
| Wireframe color | `#E4C04A` (gold) |
| Particle color | `#2563EB` (blue) |
| Letter color | `#ffffff` (white) |
| Background | `#1a1c1e` (dark) |

## Theme: Ice Tangerine Inverted

| Property | Value |
|----------|-------|
| Wireframe color | `#ff6b35` (orange/tangerine) |
| Particle color | `#e8f4f6` (light cyan/muted) |
| Letter color | `#e8f4f6` (light cyan/muted) |
| Background | `#0c1741` (dark blue) |

**Export command:**
```bash
npm run export-icon -- \
  --size=1024 \
  --name=logo-ice-tangerine-inverted \
  --color=#ff6b35 \
  --particle-color=#e8f4f6 \
  --letter-color=#e8f4f6 \
  --background=#0c1741 \
  --density-multiplier=1
```

## Theme: Ice Tangerine Dark — File City Logo

The `FileCityLogo` component (a top-down grid of file squares spelling the
brand mark) replaces the wireframe sphere on the desktop app. Colors are
taken from the `iceTangerineDarkTheme` preset in `@principal-ade/industry-theme`.

| Property | Value | FileCityLogo prop |
|----------|-------|-------------------|
| Primary (the P) | `#ff6b35` (orange) | `--primary` |
| Accent (AI in lockup) | `#0893d2` (blue) | `--accent` |
| Base / city tint | `#d0e5ea` (light) | `--base-color` |
| Background panel | `#0d274d` (dark navy) | `--background` |

**Exporter:** `scripts/export-icon.js` supports `--component=FileCityLogo`
with these flags: `--mark` (`P` / `AI` / `PAI` / `lockup` / `none`),
`--primary`, `--accent`, `--base-color`, `--background`, `--gradient`
(`scatter` / `vertical` / `horizontal` / `diagonal`, default `diagonal`),
`--rounded` / `--no-rounded`, and `--scale` (insets the rounded panel,
leaving transparent margin for the macOS squircle).

## Deployments

### Mobile App

**Location:** `/Users/griever/Developer/mobile-app`

**Current logo:** `FileCityLogo`, `mark=P`, Ice Tangerine Dark colors (same
palette as the desktop app). The in-app mark is the React Native port at
`mobile-app/src/components/FileCityLogo.tsx`; the launcher/splash assets
below are exported PNGs.

**Files updated:**
- `assets/icon.png` (1024x1024) - iOS / main app icon, **full-bleed square**
- `assets/adaptive-icon.png` (1024x1024) - Android adaptive icon foreground,
  inset to the ~66% safe zone
- `assets/splash-icon.png` (1024x1024) - splash logo, inset/centered
- `assets/favicon.png` (48x48) - web favicon

**Export commands** (run in `logo-component`; output lands in `exports/`):
```bash
# iOS icon — full-bleed square (no rounded panel; iOS masks corners itself)
npm run export-icon -- --component=FileCityLogo --mark=P --size=1024 \
  --name=mobile-icon --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=1

# Android adaptive foreground — rounded panel inset to ~66% safe zone
npm run export-icon -- --component=FileCityLogo --mark=P --size=1024 \
  --name=mobile-adaptive --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --rounded --scale=0.66 --density-multiplier=1

# Splash — centered mark with transparent margin (floats on the splash bg)
npm run export-icon -- --component=FileCityLogo --mark=P --size=1024 \
  --name=mobile-splash --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --rounded --scale=0.6 --density-multiplier=1

# Web favicon — 48px full-bleed
npm run export-icon -- --component=FileCityLogo --mark=P --size=48 \
  --name=mobile-favicon --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=2
```

**Copy commands:**
```bash
cp exports/mobile-icon-1024.png     /Users/griever/Developer/mobile-app/assets/icon.png
cp exports/mobile-adaptive-1024.png /Users/griever/Developer/mobile-app/assets/adaptive-icon.png
cp exports/mobile-splash-1024.png   /Users/griever/Developer/mobile-app/assets/splash-icon.png
cp exports/mobile-favicon-48.png    /Users/griever/Developer/mobile-app/assets/favicon.png
```

**Splash:** there's no `expo-splash-screen` plugin or runtime splash code — the
splash is purely declarative in `app.json` under `expo.splash` (`image` +
`resizeMode: "contain"` + `backgroundColor`). Native splash screens are baked
at build time. Both `splash.backgroundColor` and `android.adaptiveIcon
.backgroundColor` are set to the navy panel `#0d274d` so the mark floats on a
seamless field.

**Notes:**
- Expo generates all icon sizes from these source files via `app.json` config.
- The icon/splash/adaptive PNGs are committed to git (Expo reads them directly).
- Run `npx expo prebuild --clean` (or an EAS build) to regenerate the native
  iOS LaunchScreen / xcassets and Android mipmaps from the new sources.
- `--scale` insets the rounded panel leaving transparent margin; bump it for a
  larger mark (e.g. adaptive `--scale=0.72`) — watch Android's circular mask.

---

### Desktop App (Electron)

**Location:** `/Users/griever/Developer/desktop-app/electron-app`

**Source file:**
- `principal-ade-icon.png` (1024x1024) - source for all generated icons

**Generated files:**
- `assets/icon.icns` - macOS app icon
- `assets/icon.ico` - Windows app icon
- `assets/icons/*.png` - all size variants (with and without padding)

**Current logo:** `FileCityLogo`, `mark=P`, Ice Tangerine Dark colors.

**Export command:**
```bash
# Full-bleed SQUARE source — generate_icons.py adds the padding + rounded
# corners itself, so export with --no-rounded and no inset.
npm run export-icon -- \
  --component=FileCityLogo \
  --mark=P \
  --size=1024 \
  --name=principal-ade-icon \
  --primary=#ff6b35 \
  --accent=#0893d2 \
  --base-color=#d0e5ea \
  --background=#0d274d \
  --no-rounded \
  --density-multiplier=1
```

**Then copy and regenerate:**
```bash
cp exports/principal-ade-icon-1024.png /Users/griever/Developer/desktop-app/electron-app/principal-ade-icon.png
cd /Users/griever/Developer/desktop-app/electron-app
python3 generate_icons.py
```

**Notes:**
- Source must be a **full-bleed square** — `generate_icons.py` applies
  Apple's ~10% padding and 18% rounded corners itself. Do **not** pass
  `--rounded`/`--scale`/`--circular-background`/`--padding` for this surface.
- `--density-multiplier=1` at size 1024 (a higher multiplier exceeds
  sharp's pixel limit at that size).
- `generate_icons.py` creates all sizes, .icns, and .ico files
- Only `principal-ade-icon.png` is tracked in git (generated icons are gitignored)

**Dev badge (macOS):**
- `generate_icons.py` also emits `assets/icon-dev.png` — the padded/rounded
  icon with a red "DEV" corner ribbon composited into the bottom-right.
- `src/main/main.ts` applies it via `app.dock.setIcon(...)` when
  `!app.isPackaged` (dev only); packaged builds keep the normal icon.
- To restyle the ribbon, edit `add_dev_ribbon()` in `generate_icons.py`
  (ribbon color/text/size/position) and re-run the script.

**Previous logo (wireframe sphere, Slate Gold) — for reference:**
```bash
npm run export-icon -- --size=1024 --name=principal-ade-icon \
  --color=#E4C04A --particle-color=#2563EB --letter-color=#ffffff \
  --circular-background --background=#1a1c1e --padding=14 --density-multiplier=1
```

---

### Web App (Next.js)

**Location:** `/Users/griever/Developer/web-ade/web-ade`

**Current logo:** `FileCityLogo`, `mark=P`, Ice Tangerine Dark colors, navy
panel `#0d274d`. App Router project — favicon is the `src/app/favicon.ico`
convention; PWA icons come from `src/app/manifest.ts`.

**Files updated:**
- `public/icon-192x192.png` - PWA icon (manifest)
- `public/icon-512x512.png` - PWA icon (manifest; reused for `purpose: maskable`)
- `public/apple-touch-icon.png` (180x180) - iOS home screen
- `src/app/favicon.ico` - **browser tab favicon (the one Next actually serves)**
- `src/app/favicon.png` / `favicon-16x16.png` / `favicon-32x32.png` - legacy PNGs
  (not auto-served by App Router; refreshed for tidiness)

**Export commands** (run in `logo-component`; full-bleed square — browsers/OS
round the corners themselves):
```bash
npm run export-icon -- --component=FileCityLogo --mark=P --size=192 \
  --name=web-icon-192 --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=2
npm run export-icon -- --component=FileCityLogo --mark=P --size=512 \
  --name=web-icon-512 --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=2
npm run export-icon -- --component=FileCityLogo --mark=P --size=180 \
  --name=web-apple --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=2
npm run export-icon -- --component=FileCityLogo --mark=P --size=32 \
  --name=web-favicon-32 --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=4
npm run export-icon -- --component=FileCityLogo --mark=P --size=16 \
  --name=web-favicon-16 --primary=#ff6b35 --accent=#0893d2 \
  --base-color=#d0e5ea --background=#0d274d --no-rounded --density-multiplier=4
```

**favicon.ico** — the export script only emits PNG, so build the multi-res
`.ico` with PIL (same lib `generate_icons.py` uses):
```bash
python3 -c "from PIL import Image; \
Image.open('exports/web-icon-512-512.png').convert('RGBA') \
.save('exports/web-favicon.ico', sizes=[(16,16),(32,32),(48,48),(64,64)])"
```

**Copy commands:**
```bash
cp exports/web-icon-192-192.png /Users/griever/Developer/web-ade/web-ade/public/icon-192x192.png
cp exports/web-icon-512-512.png /Users/griever/Developer/web-ade/web-ade/public/icon-512x512.png
cp exports/web-apple-180.png    /Users/griever/Developer/web-ade/web-ade/public/apple-touch-icon.png
cp exports/web-favicon.ico      /Users/griever/Developer/web-ade/web-ade/src/app/favicon.ico
cp exports/web-favicon-32-32.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon-32x32.png
cp exports/web-favicon-32-32.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon.png
cp exports/web-favicon-16-16.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon-16x16.png
```

**Notes:**
- PWA / favicon assets are committed to git (served directly to browsers).
- `favicon.ico` is what the browser tab uses (App Router convention) — updating
  only the PNGs won't change the tab; the `.ico` must be regenerated.
- The 512 PWA icon is reused for `purpose: "maskable"`; the P sits centered with
  a city margin ring, so Android's safe-zone crop only trims decorative tiles.
- PWA colors live in `src/app/manifest.ts` (`background_color` / `theme_color`)
  and `src/app/layout.tsx` (`viewport.themeColor`) — set to navy `#0d274d`.
- The `/api/og` social image is a separate dynamic route, not an icon.

---

### Landing Page (Next.js)

**Location:** `/Users/griever/Developer/messaging-server/landing-page`

**Current logo:** `FileCityLogo`, `mark=P`, Ice Tangerine Dark colors, navy
panel `#0d274d`. Reuses the exact same `web-*` exports as the Web App above —
only the destination filenames differ (this project follows the
`realfavicongenerator` naming convention, all under `public/`).

**Files updated** (all in `public/`, served directly):
- `favicon.ico` - browser tab favicon (declared in `src/app/layout.tsx`
  `metadata.icons`)
- `favicon-16x16.png` / `favicon-32x32.png` - PNG favicons (layout metadata)
- `favicon.png` (32x32) - legacy default-path favicon (refreshed for tidiness;
  copy of the 32px PNG)
- `apple-touch-icon.png` (180x180) - iOS home screen (layout metadata)
- `android-chrome-192x192.png` / `android-chrome-512x512.png` - PWA icons
  (referenced from `public/manifest.json`, `purpose: "any maskable"`)

**Export commands:** identical to the Web App section above — reuse the same
`exports/web-*` files (no separate export run needed).

**Copy commands:**
```bash
cp exports/web-favicon.ico       /Users/griever/Developer/messaging-server/landing-page/public/favicon.ico
cp exports/web-favicon-16-16.png /Users/griever/Developer/messaging-server/landing-page/public/favicon-16x16.png
cp exports/web-favicon-32-32.png /Users/griever/Developer/messaging-server/landing-page/public/favicon-32x32.png
cp exports/web-favicon-32-32.png /Users/griever/Developer/messaging-server/landing-page/public/favicon.png
cp exports/web-apple-180.png     /Users/griever/Developer/messaging-server/landing-page/public/apple-touch-icon.png
cp exports/web-icon-192-192.png  /Users/griever/Developer/messaging-server/landing-page/public/android-chrome-192x192.png
cp exports/web-icon-512-512.png  /Users/griever/Developer/messaging-server/landing-page/public/android-chrome-512x512.png
```

**Notes:**
- Favicon/icon paths are declared in `src/app/layout.tsx` (`metadata.icons` +
  `metadata.manifest`) and `public/manifest.json` — assets are referenced by
  these fixed names, so refreshing the files in place is all that's needed.
- **Theme colors are intentionally NOT navy here.** Unlike the Web App, the
  landing site uses a near-black theme: `theme_color: #1a1a1a` /
  `background_color: #0a0a0a` in `manifest.json` and `themeColor: "#1a1a1a"`
  in `layout.tsx`. These match the page background and were left unchanged; the
  navy `#0d274d` lives only inside the icon panels.
- `public/logo.svg` (300x300) and `public/principal-ade-icon.png` (950x950)
  exist in `public/` but are **not referenced anywhere** in the codebase — left
  untouched. If they ever become an in-page brand mark, export a fresh
  `FileCityLogo` SVG/PNG for them separately.

---

<!-- Add new deployments below -->
