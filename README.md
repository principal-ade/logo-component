# Logo Component

An animated wireframe sphere logo component for React.

## Installation

```bash
npm install @principal-ai/logo-component
```

## Usage

```tsx
import { Logo } from '@principal-ai/logo-component';

function App() {
  return (
    <Logo
      width={150}
      height={150}
      color="currentColor"
      particleColor="#00ff00"
      opacity={0.9}
    />
  );
}
```

## Props

- `width` (number, default: 150): Width of the logo in pixels
- `height` (number, default: 150): Height of the logo in pixels
- `color` (string, default: "currentColor"): Color of the wireframe lines
- `particleColor` (string, optional): Color of the animated particles (defaults to `color`)
- `opacity` (number, default: 0.9): Overall opacity of the logo

## Exporting PNG icons

Use the provided script to render the SVG at a high resolution and optionally convert it to a PNG. The script will always write an SVG, and if [`sharp`](https://sharp.pixelplumbing.com/) is installed it will also generate a PNG while keeping transparency intact.

```bash
# Install sharp once if you plan to generate PNGs
npm install sharp

# Export a 1024x1024 icon (SVG + PNG) to the exports/ directory
npm run export-icon

# Customize the export (e.g. different size, colors, or SVG only)
npm run export-icon -- --size=512 --color=#ff00ff --svg-only
```

### Available flags

- `--size <number>` – Output width and height in pixels (default: `1024`).
- `--color <hex>` – Stroke color for the wireframe (default: `#00ffff`).
- `--particle-color <hex>` – Particle color (defaults to `--color`).
- `--opacity <0-1>` – Overrides the root SVG opacity (default: `1`).
- `--output <path>` – Destination directory (default: `exports`).
- `--name <string>` – Base file name used for the exports (default: `logo`).
- `--svg-only` – Skip PNG generation, useful if `sharp` is not installed.
- `--background <hex|transparent>` – Fill color to apply behind the icon when rasterizing.
- `--density-multiplier <number>` – Multiplies the rasterization density before resizing (default: `2`).

## License

MIT
