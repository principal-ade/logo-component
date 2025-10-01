# Logo Component

An animated wireframe sphere logo component for React.

## Installation

```bash
npm install @a24z/logo-component
```

## Usage

```tsx
import { Logo } from '@a24z/logo-component';

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

## License

MIT
