# Generate Icons Skill

Generate application icons from the Logo component with proper colors and distribution to dependent projects.

## Standard Icon Colors

The Principal ADE logo icons use:
- **Wireframe sphere lines**: White (`#ffffff`)
- **"P" letter dots**: Cyan/Blue (`#00ffff`)
- **Circular background**: Dark gray (`#1a1a1a`)

## Generate Desktop App Icon

Generate the 1024x1024 icon for the desktop Electron app:

```bash
npm run export-icon -- \
  --size=1024 \
  --name=principal-ade-icon \
  --color=#ffffff \
  --particle-color=#00ffff \
  --background=#1a1a1a \
  --density-multiplier=1
```

Then copy to desktop-app and regenerate platform-specific icons:

```bash
cp exports/principal-ade-icon-1024.png /Users/griever/Developer/desktop-app/electron-app/principal-ade-icon.png
cd /Users/griever/Developer/desktop-app/electron-app
python3 generate_icons.py
```

This generates:
- Mac `.icns` file (uses Apple's standard 10% padding - 100px on 1024px canvas)
- Windows `.ico` file (with padding)
- All required size variants with and without padding

## Generate Web App Icons

Generate PWA icons for the web-ade project:

```bash
# 192x192 icon
npm run export-icon -- \
  --size=192 \
  --name=icon-192x192 \
  --color=#ffffff \
  --particle-color=#00ffff \
  --background=#1a1a1a \
  --density-multiplier=1

# 512x512 icon
npm run export-icon -- \
  --size=512 \
  --name=icon-512x512 \
  --color=#ffffff \
  --particle-color=#00ffff \
  --background=#1a1a1a \
  --density-multiplier=1
```

Then copy to web-ade:

```bash
cp exports/icon-192x192-192.png /Users/griever/Developer/web-ade/web-ade/public/icon-192x192.png
cp exports/icon-192x192-192.png /Users/griever/Developer/web-ade/web-ade/public/apple-touch-icon.png
cp exports/icon-512x512-512.png /Users/griever/Developer/web-ade/web-ade/public/icon-512x512.png
```

## Export Script Options

Available flags for `npm run export-icon`:

- `--size <number>`: Output dimensions in pixels (default: 1024)
- `--name <string>`: Base filename (default: "logo")
- `--color <hex>`: Wireframe sphere color (default: #00ffff)
- `--particle-color <hex>`: "P" letter color (defaults to --color)
- `--opacity <0-1>`: Overall opacity (default: 1)
- `--background <hex|transparent>`: Background fill color
- `--circular-background`: Use circular background instead of rectangular
- `--padding <number>`: Padding around the icon in pixels
- `--density-multiplier <number>`: Rasterization density (default: 2, use 1 to avoid pixel limits)
- `--svg-only`: Skip PNG generation
- `--output <path>`: Destination directory (default: "exports")
- `--component <Logo|ForksLogo>`: Which component to export (default: "Logo")

## Git Ignore for Generated Icons

In desktop-app/electron-app, generated icons are excluded from git:

```gitignore
# Generated icons (created by generate_icons.py)
assets/icon.icns
assets/icon.ico
assets/icons/
```

Only the source `principal-ade-icon.png` is tracked in git.

## Important Notes

- **Density Multiplier**: Use `--density-multiplier=1` for large sizes (1024+) to avoid Sharp's pixel limit errors
- **Mac Icons**: The Mac `.icns` file uses Apple's standard 10% padding (100 pixels on 1024px canvas) as per Apple Human Interface Guidelines
  - For 1024x1024 canvas: icon content should be 824x824 pixels
  - Rounded rectangle with 185.4px corner radius
  - This ensures visual consistency with other macOS apps
- **Web Icons**: PWA icons are committed to git since they're served directly to browsers (no padding needed)
- **Color Consistency**: Always use the standard colors above unless specifically requested otherwise
- **Background Shape**: Use rectangular `--background` (NOT `--circular-background`) - the Python script applies rounded corners, and circular backgrounds create visible white gaps between the circle and the rounded rectangle edges
