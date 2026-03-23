/**
 * Single-stroke character definitions for TextReveal component.
 * Each character is defined as a set of simple SVG paths that particles can trace.
 * Coordinates use a consistent cell: 0-40 width, 0-60 height, baseline at y=60.
 */

export interface CharacterPath {
  d: string;
  id: string;
}

export interface CharacterDefinition {
  paths: CharacterPath[];
  width: number; // advance width including spacing
}

export const STROKE_CHARACTERS: Record<string, CharacterDefinition> = {
  // Uppercase letters
  A: {
    paths: [
      { d: "M 2,60 L 20,4 L 38,60", id: "a-legs" },
      { d: "M 10,38 L 30,38", id: "a-bar" },
    ],
    width: 42,
  },
  B: {
    paths: [
      { d: "M 4,60 L 4,4", id: "b-stem" },
      { d: "M 4,4 L 24,4 Q 34,4 34,16 Q 34,28 24,32 L 4,32", id: "b-top" },
      { d: "M 4,32 L 26,32 Q 38,32 38,46 Q 38,60 26,60 L 4,60", id: "b-bot" },
    ],
    width: 42,
  },
  C: {
    paths: [
      { d: "M 36,12 Q 20,0 8,16 Q 0,28 0,32 Q 0,48 8,52 Q 20,64 36,52", id: "c-arc" },
    ],
    width: 40,
  },
  D: {
    paths: [
      { d: "M 4,60 L 4,4", id: "d-stem" },
      { d: "M 4,4 L 20,4 Q 38,4 38,32 Q 38,60 20,60 L 4,60", id: "d-arc" },
    ],
    width: 42,
  },
  E: {
    paths: [
      { d: "M 4,60 L 4,4", id: "e-stem" },
      { d: "M 4,4 L 34,4", id: "e-top" },
      { d: "M 4,32 L 28,32", id: "e-mid" },
      { d: "M 4,60 L 34,60", id: "e-bot" },
    ],
    width: 38,
  },
  F: {
    paths: [
      { d: "M 4,60 L 4,4", id: "f-stem" },
      { d: "M 4,4 L 34,4", id: "f-top" },
      { d: "M 4,32 L 26,32", id: "f-mid" },
    ],
    width: 36,
  },
  G: {
    paths: [
      { d: "M 36,12 Q 20,0 8,16 Q 0,28 0,32 Q 0,48 8,52 Q 20,64 36,52 L 36,36 L 22,36", id: "g-shape" },
    ],
    width: 42,
  },
  H: {
    paths: [
      { d: "M 4,60 L 4,4", id: "h-left" },
      { d: "M 36,60 L 36,4", id: "h-right" },
      { d: "M 4,32 L 36,32", id: "h-bar" },
    ],
    width: 42,
  },
  I: {
    paths: [
      { d: "M 20,4 L 20,60", id: "i-stem" },
      { d: "M 8,4 L 32,4", id: "i-top" },
      { d: "M 8,60 L 32,60", id: "i-bot" },
    ],
    width: 36,
  },
  J: {
    paths: [
      { d: "M 28,4 L 28,48 Q 28,60 16,60 Q 4,60 4,48", id: "j-hook" },
    ],
    width: 34,
  },
  K: {
    paths: [
      { d: "M 4,60 L 4,4", id: "k-stem" },
      { d: "M 34,4 L 4,36 L 36,60", id: "k-legs" },
    ],
    width: 40,
  },
  L: {
    paths: [
      { d: "M 4,4 L 4,60 L 34,60", id: "l-shape" },
    ],
    width: 38,
  },
  M: {
    paths: [
      { d: "M 4,60 L 4,4 L 22,32 L 40,4 L 40,60", id: "m-shape" },
    ],
    width: 46,
  },
  N: {
    paths: [
      { d: "M 4,60 L 4,4 L 36,60 L 36,4", id: "n-shape" },
    ],
    width: 42,
  },
  O: {
    paths: [
      { d: "M 20,4 Q 4,4 4,32 Q 4,60 20,60 Q 36,60 36,32 Q 36,4 20,4 Z", id: "o-circle" },
    ],
    width: 42,
  },
  P: {
    paths: [
      { d: "M 4,60 L 4,4", id: "p-stem" },
      { d: "M 4,4 L 24,4 Q 36,4 36,18 Q 36,32 24,32 L 4,32", id: "p-bowl" },
    ],
    width: 40,
  },
  Q: {
    paths: [
      { d: "M 20,4 Q 4,4 4,32 Q 4,60 20,60 Q 36,60 36,32 Q 36,4 20,4 Z", id: "q-circle" },
      { d: "M 26,48 L 40,64", id: "q-tail" },
    ],
    width: 44,
  },
  R: {
    paths: [
      { d: "M 4,60 L 4,4", id: "r-stem" },
      { d: "M 4,4 L 24,4 Q 36,4 36,18 Q 36,32 24,32 L 4,32", id: "r-bowl" },
      { d: "M 22,32 L 38,60", id: "r-leg" },
    ],
    width: 42,
  },
  S: {
    paths: [
      { d: "M 34,12 Q 34,4 20,4 Q 4,4 4,16 Q 4,28 20,32 Q 36,36 36,48 Q 36,60 20,60 Q 4,60 4,52", id: "s-curve" },
    ],
    width: 40,
  },
  T: {
    paths: [
      { d: "M 4,4 L 36,4", id: "t-top" },
      { d: "M 20,4 L 20,60", id: "t-stem" },
    ],
    width: 40,
  },
  U: {
    paths: [
      { d: "M 4,4 L 4,46 Q 4,60 20,60 Q 36,60 36,46 L 36,4", id: "u-shape" },
    ],
    width: 42,
  },
  V: {
    paths: [
      { d: "M 2,4 L 20,60 L 38,4", id: "v-shape" },
    ],
    width: 42,
  },
  W: {
    paths: [
      { d: "M 0,4 L 10,60 L 22,28 L 34,60 L 44,4", id: "w-shape" },
    ],
    width: 48,
  },
  X: {
    paths: [
      { d: "M 4,4 L 36,60", id: "x-down" },
      { d: "M 36,4 L 4,60", id: "x-up" },
    ],
    width: 42,
  },
  Y: {
    paths: [
      { d: "M 4,4 L 20,32 L 36,4", id: "y-arms" },
      { d: "M 20,32 L 20,60", id: "y-stem" },
    ],
    width: 42,
  },
  Z: {
    paths: [
      { d: "M 4,4 L 36,4 L 4,60 L 36,60", id: "z-shape" },
    ],
    width: 42,
  },

  // Numbers
  "0": {
    paths: [
      { d: "M 20,4 Q 4,4 4,32 Q 4,60 20,60 Q 36,60 36,32 Q 36,4 20,4 Z", id: "0-circle" },
      { d: "M 12,48 L 28,16", id: "0-slash" },
    ],
    width: 42,
  },
  "1": {
    paths: [
      { d: "M 10,16 L 22,4 L 22,60", id: "1-shape" },
      { d: "M 12,60 L 32,60", id: "1-base" },
    ],
    width: 38,
  },
  "2": {
    paths: [
      { d: "M 4,16 Q 4,4 20,4 Q 36,4 36,16 Q 36,28 4,60 L 36,60", id: "2-shape" },
    ],
    width: 42,
  },
  "3": {
    paths: [
      { d: "M 4,12 Q 4,4 20,4 Q 36,4 36,18 Q 36,32 20,32 Q 36,32 36,46 Q 36,60 20,60 Q 4,60 4,52", id: "3-shape" },
    ],
    width: 42,
  },
  "4": {
    paths: [
      { d: "M 28,60 L 28,4 L 4,44 L 38,44", id: "4-shape" },
    ],
    width: 42,
  },
  "5": {
    paths: [
      { d: "M 34,4 L 6,4 L 4,28 Q 4,28 20,28 Q 36,28 36,44 Q 36,60 20,60 Q 4,60 4,52", id: "5-shape" },
    ],
    width: 42,
  },
  "6": {
    paths: [
      { d: "M 32,8 Q 20,4 10,16 Q 4,28 4,44 Q 4,60 20,60 Q 36,60 36,44 Q 36,28 20,28 Q 4,28 4,44", id: "6-shape" },
    ],
    width: 42,
  },
  "7": {
    paths: [
      { d: "M 4,4 L 36,4 L 16,60", id: "7-shape" },
    ],
    width: 42,
  },
  "8": {
    paths: [
      { d: "M 20,32 Q 6,32 6,18 Q 6,4 20,4 Q 34,4 34,18 Q 34,32 20,32 Q 4,32 4,46 Q 4,60 20,60 Q 36,60 36,46 Q 36,32 20,32", id: "8-shape" },
    ],
    width: 42,
  },
  "9": {
    paths: [
      { d: "M 8,56 Q 20,60 30,48 Q 36,36 36,20 Q 36,4 20,4 Q 4,4 4,20 Q 4,36 20,36 Q 36,36 36,20", id: "9-shape" },
    ],
    width: 42,
  },

  // Punctuation & special
  " ": {
    paths: [],
    width: 20,
  },
  ".": {
    paths: [
      { d: "M 8,56 L 12,56 L 12,60 L 8,60 Z", id: "period" },
    ],
    width: 20,
  },
  ",": {
    paths: [
      { d: "M 12,56 L 8,66", id: "comma" },
    ],
    width: 20,
  },
  "!": {
    paths: [
      { d: "M 10,4 L 10,42", id: "exclaim-stem" },
      { d: "M 8,56 L 12,56 L 12,60 L 8,60 Z", id: "exclaim-dot" },
    ],
    width: 20,
  },
  "?": {
    paths: [
      { d: "M 4,12 Q 4,4 18,4 Q 32,4 32,16 Q 32,28 18,32 L 18,42", id: "question-curve" },
      { d: "M 16,56 L 20,56 L 20,60 L 16,60 Z", id: "question-dot" },
    ],
    width: 36,
  },
  "-": {
    paths: [
      { d: "M 4,32 L 28,32", id: "hyphen" },
    ],
    width: 32,
  },
  ":": {
    paths: [
      { d: "M 8,20 L 12,20 L 12,24 L 8,24 Z", id: "colon-top" },
      { d: "M 8,48 L 12,48 L 12,52 L 8,52 Z", id: "colon-bot" },
    ],
    width: 20,
  },
  "/": {
    paths: [
      { d: "M 4,60 L 28,4", id: "slash" },
    ],
    width: 32,
  },

  // Lowercase (simplified - same height as uppercase for now)
  a: {
    paths: [
      { d: "M 30,24 Q 30,16 18,16 Q 6,16 6,32 Q 6,48 18,48 Q 30,48 30,32 L 30,16 L 30,48", id: "a-lower" },
    ],
    width: 36,
  },
  b: {
    paths: [
      { d: "M 6,4 L 6,48", id: "b-stem-lower" },
      { d: "M 6,32 Q 6,16 20,16 Q 34,16 34,32 Q 34,48 20,48 Q 6,48 6,32", id: "b-bowl-lower" },
    ],
    width: 38,
  },
  c: {
    paths: [
      { d: "M 32,20 Q 18,14 10,24 Q 6,32 10,40 Q 18,50 32,44", id: "c-lower" },
    ],
    width: 36,
  },
  d: {
    paths: [
      { d: "M 30,4 L 30,48", id: "d-stem-lower" },
      { d: "M 30,32 Q 30,16 16,16 Q 2,16 2,32 Q 2,48 16,48 Q 30,48 30,32", id: "d-bowl-lower" },
    ],
    width: 36,
  },
  e: {
    paths: [
      { d: "M 6,32 L 32,32 Q 32,16 18,16 Q 4,16 4,32 Q 4,48 18,48 Q 32,48 32,42", id: "e-lower" },
    ],
    width: 38,
  },
  f: {
    paths: [
      { d: "M 28,8 Q 20,4 14,12 L 14,48", id: "f-stem-lower" },
      { d: "M 4,24 L 26,24", id: "f-bar-lower" },
    ],
    width: 30,
  },
  g: {
    paths: [
      { d: "M 30,16 L 30,56 Q 30,66 16,66 Q 4,66 4,58", id: "g-stem-lower" },
      { d: "M 30,32 Q 30,16 16,16 Q 2,16 2,32 Q 2,48 16,48 Q 30,48 30,32", id: "g-bowl-lower" },
    ],
    width: 36,
  },
  h: {
    paths: [
      { d: "M 6,4 L 6,48", id: "h-stem-lower" },
      { d: "M 6,28 Q 6,16 20,16 Q 32,16 32,28 L 32,48", id: "h-arch-lower" },
    ],
    width: 38,
  },
  i: {
    paths: [
      { d: "M 10,20 L 10,48", id: "i-stem-lower" },
      { d: "M 8,8 L 12,8 L 12,12 L 8,12 Z", id: "i-dot-lower" },
    ],
    width: 22,
  },
  j: {
    paths: [
      { d: "M 18,20 L 18,56 Q 18,66 6,66", id: "j-hook-lower" },
      { d: "M 16,8 L 20,8 L 20,12 L 16,12 Z", id: "j-dot-lower" },
    ],
    width: 26,
  },
  k: {
    paths: [
      { d: "M 6,4 L 6,48", id: "k-stem-lower" },
      { d: "M 30,16 L 6,36 L 32,48", id: "k-legs-lower" },
    ],
    width: 36,
  },
  l: {
    paths: [
      { d: "M 10,4 L 10,48", id: "l-stem-lower" },
    ],
    width: 20,
  },
  m: {
    paths: [
      { d: "M 4,48 L 4,24 Q 4,16 14,16 Q 24,16 24,24 L 24,48", id: "m-left-lower" },
      { d: "M 24,24 Q 24,16 34,16 Q 44,16 44,24 L 44,48", id: "m-right-lower" },
    ],
    width: 50,
  },
  n: {
    paths: [
      { d: "M 6,48 L 6,16", id: "n-stem-lower" },
      { d: "M 6,28 Q 6,16 20,16 Q 32,16 32,28 L 32,48", id: "n-arch-lower" },
    ],
    width: 38,
  },
  o: {
    paths: [
      { d: "M 18,16 Q 4,16 4,32 Q 4,48 18,48 Q 32,48 32,32 Q 32,16 18,16 Z", id: "o-lower" },
    ],
    width: 38,
  },
  p: {
    paths: [
      { d: "M 6,16 L 6,64", id: "p-stem-lower" },
      { d: "M 6,32 Q 6,16 20,16 Q 34,16 34,32 Q 34,48 20,48 Q 6,48 6,32", id: "p-bowl-lower" },
    ],
    width: 38,
  },
  q: {
    paths: [
      { d: "M 30,16 L 30,64", id: "q-stem-lower" },
      { d: "M 30,32 Q 30,16 16,16 Q 2,16 2,32 Q 2,48 16,48 Q 30,48 30,32", id: "q-bowl-lower" },
    ],
    width: 36,
  },
  r: {
    paths: [
      { d: "M 6,48 L 6,16", id: "r-stem-lower" },
      { d: "M 6,28 Q 6,16 20,16 Q 28,16 30,22", id: "r-shoulder-lower" },
    ],
    width: 32,
  },
  s: {
    paths: [
      { d: "M 28,20 Q 28,16 18,16 Q 6,16 6,24 Q 6,32 18,32 Q 30,32 30,40 Q 30,48 18,48 Q 6,48 6,44", id: "s-lower" },
    ],
    width: 36,
  },
  t: {
    paths: [
      { d: "M 16,4 L 16,44 Q 16,48 24,48", id: "t-stem-lower" },
      { d: "M 6,16 L 28,16", id: "t-bar-lower" },
    ],
    width: 30,
  },
  u: {
    paths: [
      { d: "M 6,16 L 6,36 Q 6,48 18,48 Q 30,48 30,36 L 30,16 L 30,48", id: "u-lower" },
    ],
    width: 38,
  },
  v: {
    paths: [
      { d: "M 4,16 L 18,48 L 32,16", id: "v-lower" },
    ],
    width: 38,
  },
  w: {
    paths: [
      { d: "M 2,16 L 10,48 L 20,28 L 30,48 L 38,16", id: "w-lower" },
    ],
    width: 42,
  },
  x: {
    paths: [
      { d: "M 6,16 L 30,48", id: "x-down-lower" },
      { d: "M 30,16 L 6,48", id: "x-up-lower" },
    ],
    width: 38,
  },
  y: {
    paths: [
      { d: "M 6,16 L 18,40", id: "y-left-lower" },
      { d: "M 30,16 L 10,64", id: "y-right-lower" },
    ],
    width: 38,
  },
  z: {
    paths: [
      { d: "M 6,16 L 30,16 L 6,48 L 30,48", id: "z-lower" },
    ],
    width: 38,
  },
};

/**
 * Layout text and return positioned paths
 */
export interface PositionedPath {
  d: string;
  id: string;
  charIndex: number;
  char: string;
}

export function layoutText(
  text: string,
  options: {
    x?: number;
    y?: number;
    letterSpacing?: number;
    scale?: number;
  } = {}
): { paths: PositionedPath[]; width: number; height: number } {
  const { x = 0, y = 0, letterSpacing = 4, scale = 1 } = options;
  const paths: PositionedPath[] = [];
  let currentX = x;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const charDef = STROKE_CHARACTERS[char] || STROKE_CHARACTERS[char.toUpperCase()];

    if (charDef) {
      for (const path of charDef.paths) {
        // Transform the path to the current position
        const transformedD = transformPath(path.d, currentX, y, scale);
        paths.push({
          d: transformedD,
          id: `${path.id}-${i}`,
          charIndex: i,
          char,
        });
      }
      currentX += (charDef.width + letterSpacing) * scale;
    }
  }

  return {
    paths,
    width: currentX - x,
    height: 60 * scale,
  };
}

/**
 * Transform path coordinates by offset and scale
 */
function transformPath(d: string, offsetX: number, offsetY: number, scale: number): string {
  // Match all coordinate pairs in the path
  return d.replace(/-?\d+\.?\d*/g, (match, offset, fullString) => {
    const num = parseFloat(match);
    // Determine if this is an X or Y coordinate by counting preceding numbers
    const before = fullString.substring(0, offset);
    const numCount = (before.match(/-?\d+\.?\d*/g) || []).length;
    const isY = numCount % 2 === 1;

    if (isY) {
      return String(num * scale + offsetY);
    } else {
      return String(num * scale + offsetX);
    }
  });
}
