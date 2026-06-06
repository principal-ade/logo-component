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

**Files updated:**
- `assets/icon.png` (1024x1024) - main app icon source
- `assets/adaptive-icon.png` (1024x1024) - Android adaptive icon
- `assets/splash-icon.png` (1024x1024) - splash screen
- `assets/favicon.png` (48x48) - web favicon

**Export commands:**
```bash
# 1024x1024 icon
npm run export-icon -- \
  --size=1024 \
  --name=logo-slate-gold \
  --color=#E4C04A \
  --particle-color=#2563EB \
  --letter-color=#ffffff \
  --background=#1a1c1e \
  --density-multiplier=1

# 48x48 favicon
npm run export-icon -- \
  --size=48 \
  --name=logo-slate-gold-favicon \
  --color=#E4C04A \
  --particle-color=#2563EB \
  --letter-color=#ffffff \
  --background=#1a1c1e \
  --density-multiplier=2
```

**Notes:**
- Expo generates all icon sizes from these source files via `app.json` config
- iOS xcassets are regenerated on `expo prebuild`

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

**Files updated:**
- `public/icon-192x192.png` - PWA icon
- `public/icon-512x512.png` - PWA icon
- `public/apple-touch-icon.png` - iOS home screen (same as 192x192)
- `src/app/favicon.png` (32x32) - browser tab favicon
- `src/app/favicon-16x16.png` - small favicon
- `src/app/favicon-32x32.png` - standard favicon

**Export commands:**
```bash
# PWA icons
npm run export-icon -- --size=192 --name=icon-192x192 --color=#E4C04A --particle-color=#2563EB --letter-color=#ffffff --background=#1a1c1e --density-multiplier=2
npm run export-icon -- --size=512 --name=icon-512x512 --color=#E4C04A --particle-color=#2563EB --letter-color=#ffffff --background=#1a1c1e --density-multiplier=2

# Favicons
npm run export-icon -- --size=32 --name=favicon-32x32 --color=#E4C04A --particle-color=#2563EB --letter-color=#ffffff --background=#1a1c1e --density-multiplier=2
npm run export-icon -- --size=16 --name=favicon-16x16 --color=#E4C04A --particle-color=#2563EB --letter-color=#ffffff --background=#1a1c1e --density-multiplier=2
```

**Copy commands:**
```bash
cp exports/icon-192x192-192.png /Users/griever/Developer/web-ade/web-ade/public/icon-192x192.png
cp exports/icon-192x192-192.png /Users/griever/Developer/web-ade/web-ade/public/apple-touch-icon.png
cp exports/icon-512x512-512.png /Users/griever/Developer/web-ade/web-ade/public/icon-512x512.png
cp exports/favicon-32x32-32.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon.png
cp exports/favicon-32x32-32.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon-32x32.png
cp exports/favicon-16x16-16.png /Users/griever/Developer/web-ade/web-ade/src/app/favicon-16x16.png
```

**Notes:**
- PWA icons are committed to git (served directly to browsers)
- No circular background needed for web icons

---

<!-- Add new deployments below -->
