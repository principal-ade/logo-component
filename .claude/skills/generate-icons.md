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
  --circular-background \
  --background=#1a1a1a \
  --padding=14 \
  --density-multiplier=1
```

The `--padding=14` adds approximately 100px of transparent spacing around the circular logo within the icon (before the macOS 100px padding is applied).

Then copy to desktop-app and regenerate platform-specific icons:

```bash
cp exports/principal-ade-icon-1024.png /Users/griever/Developer/desktop-app/electron-app/principal-ade-icon.png
cd /Users/griever/Developer/desktop-app/electron-app
python3 generate_icons.py
```

This generates:
- Mac `.icns` file (uses Apple's exact specification: 100px padding on 1024px canvas)
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
- `--padding <number>`: Additional spacing around the logo in SVG coordinates (e.g., 14 ≈ 100px at 1024px output)
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
- **Mac Icons**: The Mac `.icns` file uses Apple's exact specification: 100 pixels of padding on 1024px canvas (9.765625%) as per Apple Human Interface Guidelines
  - For 1024x1024 canvas: 100px padding on each side, icon content is 824x824 pixels
  - Rounded rectangle with 185.4px corner radius
  - The padding scales proportionally for other icon sizes
  - This ensures visual consistency with other macOS apps
- **Web Icons**: PWA icons are committed to git since they're served directly to browsers (no padding needed)
- **Color Consistency**: Always use the standard colors above unless specifically requested otherwise
- **Background Shape**: Use `--circular-background` with `--background` to create a circular dark background behind the logo sphere
  - The circular background is set to radius 70 to fully cover the white wireframe stroke (radius 67 with 1.5px stroke width)
  - The area outside the circle (within the rounded rectangle) will be transparent
  - The Python script applies Apple's 100px padding with rounded corners, creating the proper macOS icon shape
  - This allows the logo's spherical design to be preserved while meeting macOS icon requirements
- **Glow Effect**: The export script automatically removes the radius 80 glow effect for static icons to prevent visual artifacts
