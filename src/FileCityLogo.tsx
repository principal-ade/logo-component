import React, { useId } from 'react';
import type { Theme } from '@principal-ade/industry-theme';

export type FileCityMark = 'P' | 'AI' | 'PAI' | 'lockup' | 'none';

/**
 * How the per-file shading of the mark is chosen.
 * - `scatter`: each file picks a random shade (the default texture)
 * - `vertical` / `horizontal` / `diagonal`: a smooth directional gradient
 *   across the grid, dark → light.
 */
export type FileCityGradient =
  | 'scatter'
  | 'vertical'
  | 'horizontal'
  | 'diagonal';

export interface FileCityLogoProps {
  width?: number;
  height?: number;
  /**
   * Which brand mark the primary-colored files spell out. `'none'` is a
   * plain city grid with an optional single highlighted file.
   */
  mark?: FileCityMark;
  /**
   * Primary color — the tint of the files that form the mark and the
   * brighter building shades. Defaults to the theme's `primary`.
   */
  primary?: string;
  /**
   * Accent color used for the `trail` overlay so it stands apart from
   * the primary-colored mark. Defaults to the theme's `accent` (falling
   * back to the primary color).
   */
  accent?: string;
  /**
   * Base color the neutral building tints are derived from (the
   * equivalent of the theme's text color in TrailCityDiagram).
   */
  color?: string;
  /**
   * Panel background behind the grid. Pass `"transparent"` to drop the
   * panel and let the mark sit directly on its surface.
   */
  background?: string;
  /**
   * Optional theme — fills `primary` / `color` / `background` for any
   * that aren't passed explicitly, so the logo can ride a theme like
   * TrailCityDiagram does, or take raw colors like the other logos.
   */
  theme?: Theme;
  /** Grid size for the `'none'` plain-city variant (columns === rows). */
  cells?: number;
  /** For `mark="none"`: highlight one center file in the primary color. */
  highlight?: boolean;
  /**
   * Render part of the mark as a code trail — the lower stem + base of
   * the P's bowl become a dashed path with marker dots instead of solid
   * files, nodding to TrailCityDiagram. Only applies to marks containing
   * a "P" (`"P"` and `"PAI"`).
   */
  trail?: boolean;
  /**
   * How the mark's files are shaded. `diagonal` (default) runs a smooth
   * dark→light gradient corner to corner; `vertical` / `horizontal` do
   * the same in other directions; `scatter` gives each file a random shade.
   */
  gradient?: FileCityGradient;
  /** Round the panel corners. Default true. */
  rounded?: boolean;
  opacity?: number;
}

const VIEW = 100;

// 5-row pixel glyphs — the primary-colored files trace these.
//   `1` = a mark (primary) file
//   `H` = the letter's counter — a forced hole (background shows through,
//         no city file) so the loop reads as a real hole
//   `0` = a city file (muted backdrop)
const GLYPHS: Record<'P' | 'A' | 'I', string[]> = {
  // Closed bowl with a single hole punched in its center.
  P: ['111', '1H1', '111', '100', '100'],
  A: ['0110', '1HH1', '1111', '1001', '1001'],
  I: ['111', '010', '010', '010', '111'],
};

type CellKind = 'mark' | 'accent' | 'accentDim' | 'void' | 'city';

const MARK_LETTERS: Record<'P' | 'AI' | 'PAI', Array<'P' | 'A' | 'I'>> = {
  P: ['P'],
  AI: ['A', 'I'],
  PAI: ['P', 'A', 'I'],
};

/** Compose letters side by side (1 city column between them) into a
 *  single kind map: 1 = mark, 2 = void/hole, 0 = city. */
function composeMark(letters: Array<'P' | 'A' | 'I'>, gap = 1): number[][] {
  const rows = 5;
  const out: number[][] = Array.from({ length: rows }, () => [] as number[]);
  letters.forEach((key, li) => {
    if (li > 0) for (let r = 0; r < rows; r++) out[r].push(...new Array(gap).fill(0));
    const glyph = GLYPHS[key];
    for (let r = 0; r < rows; r++) {
      for (const ch of glyph[r]) out[r].push(ch === '1' ? 1 : ch === 'H' ? 2 : 0);
    }
  });
  return out;
}

function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function withAlpha(color: string, alpha: number): string {
  // Accept #rgb / #rrggbb — leave non-hex as-is and rely on the caller.
  if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${a}`;
  }
  return color;
}

function toRgb(color: string): [number, number, number] | null {
  if (!/^#([0-9a-f]{3}){1,2}$/i.test(color)) return null;
  let hex = color.slice(1);
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  return [
    parseInt(hex.slice(0, 2), 16),
    parseInt(hex.slice(2, 4), 16),
    parseInt(hex.slice(4, 6), 16),
  ];
}

/** Blend two colors. `t` = 0 returns `a`, `t` = 1 returns `b`. Falls
 *  back to `a` when either side isn't a parseable hex. */
function mix(a: string, b: string, t: number): string {
  const ca = toRgb(a);
  const cb = toRgb(b);
  if (!ca || !cb) return a;
  const ch = (i: number) =>
    Math.round(ca[i] + (cb[i] - ca[i]) * Math.max(0, Math.min(1, t)))
      .toString(16)
      .padStart(2, '0');
  return `#${ch(0)}${ch(1)}${ch(2)}`;
}

/**
 * A compact, iconic "file city" mark — the same top-down grid of file
 * squares as {@link TrailCityDiagram}, distilled to a logo: a small grid
 * of smaller buildings, no trail / markers / snippet. The primary-colored
 * files spell out the brand mark (P / AI / PAI) so the letters emerge
 * from the muted city.
 */
export const FileCityLogo: React.FC<FileCityLogoProps> = ({
  width = 150,
  height = 150,
  mark = 'P',
  primary,
  accent,
  color,
  background,
  theme,
  cells = 5,
  highlight = true,
  trail = false,
  gradient = 'diagonal',
  rounded = true,
  opacity = 0.9,
}) => {
  const uid = useId().replace(/:/g, '');
  const primaryColor = primary ?? theme?.colors.primary ?? '#22d3ee';
  const accentColor = accent ?? theme?.colors.accent ?? primaryColor;
  const baseColor = color ?? theme?.colors.text ?? '#f8fafc';
  const bgColor = background ?? theme?.colors.background ?? '#0a0f14';

  // Same palette weighting as TrailCityDiagram so the two read as a set.
  const palette = [
    withAlpha(primaryColor, 0.18),
    withAlpha(primaryColor, 0.32),
    withAlpha(baseColor, 0.08),
    withAlpha(baseColor, 0.14),
    withAlpha(baseColor, 0.22),
  ];

  // The mark files vary in shade so the letter doesn't read as one flat
  // block, but every shade stays vivid so it still stands out from the
  // muted city behind it.
  const markPalette = [
    primaryColor,
    mix(primaryColor, '#ffffff', 0.22),
    mix(primaryColor, '#ffffff', 0.1),
    withAlpha(primaryColor, 0.82),
  ];

  // Same idea for `accent` cells (e.g. the AI in the lockup), so they
  // read in the accent color while the P stays primary.
  const accentPalette = [
    accentColor,
    mix(accentColor, '#ffffff', 0.22),
    mix(accentColor, '#ffffff', 0.1),
    withAlpha(accentColor, 0.82),
  ];

  // Dimmed accent — used for the A in the lockup so it sits back from the
  // brighter I.
  const accentDimPalette = [
    withAlpha(accentColor, 0.5),
    withAlpha(accentColor, 0.62),
    withAlpha(accentColor, 0.42),
    withAlpha(accentColor, 0.55),
  ];

  // Build a square grid. For `mark="none"` it's a plain `cells × cells`
  // city; otherwise the glyph bitmap sits inside a square grid (side =
  // longest glyph dimension + a margin ring) so the city reads square.
  const margin = 1;
  const trailEnabled = trail && (mark === 'P' || mark === 'PAI');
  let side: number;
  let offX = 0;
  let offY = 0;
  let kindAt: (c: number, r: number) => CellKind;

  if (mark === 'none') {
    side = cells;
    const hi = Math.floor((cells - 1) / 2);
    kindAt = (c, r) => (highlight && c === hi && r === hi ? 'mark' : 'city');
  } else if (mark === 'lockup') {
    // Brand lockup: P on the left (cols 0-2, vertically centered), a gap
    // column, then a stacked "AI" filling the right 3 columns — A in the
    // top 4 rows, I in the bottom 3.
    side = 7;
    const pGlyph = GLYPHS.P;                       // 3 × 5
    const aGlyph = ['111', '1H1', '111', '101'];   // 3 × 4
    const iGlyph = ['111', '010', '111'];          // 3 × 3
    const at = (g: string[], gc: number, gr: number): string | null => {
      if (gr < 0 || gr >= g.length) return null;
      const row = g[gr];
      return gc < 0 || gc >= row.length ? null : row[gc];
    };
    kindAt = (c, r) => {
      // P is primary; the stacked AI is accent.
      const pch = at(pGlyph, c, r - 1); // P: cols 0-2, rows 1-5
      if (pch != null) {
        return pch === '1' ? 'mark' : pch === 'H' ? 'void' : 'city';
      }
      const ach = at(aGlyph, c - 4, r); // A: cols 4-6, rows 0-3 (dimmer)
      if (ach != null) {
        return ach === '1' ? 'accentDim' : ach === 'H' ? 'void' : 'city';
      }
      const ich = at(iGlyph, c - 4, r - 4); // I: cols 4-6, rows 4-6 (brighter)
      if (ich != null) {
        return ich === '1' ? 'accent' : ich === 'H' ? 'void' : 'city';
      }
      return 'city';
    };
  } else {
    const bitmap = composeMark(MARK_LETTERS[mark]);
    const bw = bitmap[0].length;
    const bh = bitmap.length;
    side = Math.max(bw, bh) + margin * 2;
    // With a trail, shove the letter to the left so the trail has room
    // on the right; otherwise center it in the square.
    offX = trailEnabled ? margin : Math.floor((side - bw) / 2);
    offY = Math.floor((side - bh) / 2);
    kindAt = (c, r) => {
      const bc = c - offX;
      const br = r - offY;
      if (br < 0 || br >= bh || bc < 0 || bc >= bw) return 'city';
      const v = bitmap[br][bc];
      return v === 1 ? 'mark' : v === 2 ? 'void' : 'city';
    };
  }
  const cols = side;
  const rows = side;

  // Trail to the right of the letter — starts in the top-right corner,
  // crosses 2 cells diagonally to its first node, zigzags down, and ends
  // in the bottom-right corner. The dots sit on city files, which are
  // forced to render under them.
  const trailGrid: Array<[number, number]> = trailEnabled
    ? [
        [cols - 1, 0],          // start: top-right corner
        [cols - 3, 2],          // first segment crosses 2 diagonally
        [cols - 2, 4],
        [cols - 1, rows - 1],   // end: bottom-right corner
      ]
    : [];
  const trailKeys = new Set(trailGrid.map(([c, r]) => `${c}-${r}`));
  const centerOf = (c: number, r: number) => ({
    x: startX + c * cell + cell / 2,
    y: startY + r * cell + cell / 2,
  });

  // True when an edge neighbor is a letter file (mark or accent) — those
  // city cells must always render so no empty square shares a side with
  // the letter (and breaks a stroke). Diagonal corners are allowed to go
  // empty, so the margins around the letter still get some missing squares.
  const isLetterKind = (k: CellKind) =>
    k === 'mark' || k === 'accent' || k === 'accentDim';
  const touchesMark = (c: number, r: number) =>
    isLetterKind(kindAt(c - 1, r)) ||
    isLetterKind(kindAt(c + 1, r)) ||
    isLetterKind(kindAt(c, r - 1)) ||
    isLetterKind(kindAt(c, r + 1));

  // Per-file shade for a letter cell. `scatter` keeps the random-shade
  // texture; the directional modes interpolate the letter's base color
  // dark→light across the grid.
  const baseFor = (kind: CellKind) =>
    kind === 'accent'
      ? accentColor
      : kind === 'accentDim'
        ? mix(accentColor, bgColor, 0.45)
        : primaryColor;
  const gradientShade = (base: string, c: number, r: number) => {
    const fx = cols > 1 ? c / (cols - 1) : 0;
    const fy = rows > 1 ? r / (rows - 1) : 0;
    const t =
      gradient === 'vertical'
        ? fy
        : gradient === 'horizontal'
          ? fx
          : (fx + fy) / 2; // diagonal
    const lo = mix(base, '#000000', 0.12);
    const hi = mix(base, '#ffffff', 0.4);
    return mix(lo, hi, t);
  };

  // Square files centered in the panel; letterboxed when the mark is
  // wider than it is tall (AI / PAI).
  const pad = 12;
  const avail = VIEW - pad * 2;
  const cell = Math.min(avail / cols, avail / rows);
  const sq = cell * 0.74; // smaller than the cell → gaps between buildings
  const inset = (cell - sq) / 2;
  const startX = (VIEW - cell * cols) / 2;
  const startY = (VIEW - cell * rows) / 2;

  const rng = mulberry32(7);
  const files: React.ReactNode[] = [];
  // Track the previous cell to the left (per row) and above (per column)
  // so we never leave two empty squares back to back in either
  // direction — that's what produced the long blank runs.
  const colEmpty: boolean[] = new Array(cols).fill(false);
  for (let r = 0; r < rows; r++) {
    let lastEmpty = false;
    for (let c = 0; c < cols; c++) {
      const kind = kindAt(c, r);
      const skipRoll = rng();
      const colorRoll = rng();
      // Void cells are the letter's counter — leave them empty so the
      // background shows through as a real hole. Mark files always
      // render; city files skip occasionally so the primary letters read
      // against a sparser, muted backdrop — but only when the square to
      // the left and the square above are both filled, so gaps stay
      // isolated.
      if (kind === 'void') {
        lastEmpty = true;
        colEmpty[c] = true;
        continue;
      }
      if (kind === 'city' && !lastEmpty && !colEmpty[c] && !touchesMark(c, r) && !trailKeys.has(`${c}-${r}`) && skipRoll < 0.2) {
        lastEmpty = true;
        colEmpty[c] = true;
        continue;
      }
      lastEmpty = false;
      colEmpty[c] = false;
      const isLetter = isLetterKind(kind);
      const letterPalette =
        kind === 'accent'
          ? accentPalette
          : kind === 'accentDim'
            ? accentDimPalette
            : markPalette;
      const letterColor =
        kind === 'accent' || kind === 'accentDim' ? accentColor : primaryColor;
      const letterFill =
        gradient === 'scatter'
          ? letterPalette[Math.floor(colorRoll * letterPalette.length)]
          : gradientShade(baseFor(kind), c, r);
      const x = startX + c * cell + inset;
      const y = startY + r * cell + inset;
      files.push(
        <rect
          key={`${c}-${r}`}
          x={x}
          y={y}
          width={sq}
          height={sq}
          rx={Math.max(1, sq * 0.12)}
          fill={
            isLetter
              ? letterFill
              : palette[Math.floor(colorRoll * palette.length)]
          }
          stroke={isLetter ? withAlpha(letterColor, 0.55) : withAlpha(baseColor, 0.08)}
          strokeWidth={isLetter ? 0.6 : 0.4}
        />,
      );
    }
  }

  // Trail overlay — a dashed accent path to the right of the letter with
  // a marker dot on each node.
  if (trailEnabled && trailGrid.length > 1) {
    const linePts = trailGrid.map(([c, r]) => centerOf(c, r));
    const d = linePts.map((p, i) => `${i ? 'L' : 'M'} ${p.x} ${p.y}`).join(' ');
    const dot = Math.max(1.5, sq * 0.3);
    files.push(
      <path
        key="trail-path"
        d={d}
        fill="none"
        stroke={accentColor}
        strokeWidth={Math.max(1, cell * 0.12)}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${cell * 0.18} ${cell * 0.18}`}
        opacity={0.9}
      />,
    );
    trailGrid.forEach(([c, r], i) => {
      const p = centerOf(c, r);
      files.push(
        <circle
          key={`trail-dot-${i}`}
          cx={p.x}
          cy={p.y}
          r={dot}
          fill={mix(accentColor, '#ffffff', 0.15)}
          stroke={bgColor}
          strokeWidth={0.5}
        />,
      );
    });
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${VIEW} ${VIEW}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity, display: 'block', overflow: 'visible' }}
      role="img"
      aria-label={
        mark === 'none'
          ? 'A top-down grid of file squares'
          : `A top-down grid of file squares spelling ${mark}`
      }
    >
      <defs>
        <clipPath id={`panel-${uid}`}>
          <rect x={0} y={0} width={VIEW} height={VIEW} rx={rounded ? 14 : 0} />
        </clipPath>
      </defs>
      <g clipPath={`url(#panel-${uid})`}>
        <rect x={0} y={0} width={VIEW} height={VIEW} fill={bgColor} rx={rounded ? 14 : 0} />
        {files}
      </g>
    </svg>
  );
};
