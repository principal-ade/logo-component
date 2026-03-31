# Logo Deployments

Tracks where logos are deployed across projects and the export settings used.

## Current Theme: Slate Gold

| Property | Value |
|----------|-------|
| Wireframe color | `#E4C04A` (gold) |
| Particle color | `#2563EB` (blue) |
| Letter color | `#ffffff` (white) |
| Background | `#1a1c1e` (dark) |

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

**Export command:**
```bash
npm run export-icon -- \
  --size=1024 \
  --name=principal-ade-icon \
  --color=#E4C04A \
  --particle-color=#2563EB \
  --letter-color=#ffffff \
  --circular-background \
  --background=#1a1c1e \
  --padding=14 \
  --density-multiplier=1
```

**Then copy and regenerate:**
```bash
cp exports/principal-ade-icon-1024.png /Users/griever/Developer/desktop-app/electron-app/principal-ade-icon.png
cd /Users/griever/Developer/desktop-app/electron-app
python3 generate_icons.py
```

**Notes:**
- Uses circular background with padding for macOS icon style
- `generate_icons.py` creates all sizes, .icns, and .ico files
- Only `principal-ade-icon.png` is tracked in git (generated icons are gitignored)

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
