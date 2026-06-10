'use client';

import React, { useEffect, useMemo, useState } from 'react';
import type { Theme } from '@principal-ade/industry-theme';

export interface TrailCityProgressProps {
  theme?: Theme;
  className?: string;
  /** Grid columns. Default 14. */
  cols?: number;
  /** Grid rows. Default 14. */
  rows?: number;
  /**
   * Fraction of the map that should be revealed, 0..1. This is the external
   * control: drive it from a typewriter / step counter and the squares
   * populate to match. The component tweens the newly revealed cells in.
   */
  progress?: number;
  /** Fraction of grid cells that are buildings vs. empty gaps. Default 0.82. */
  density?: number;
  /** Seed for the deterministic layout + reveal order. Default 7. */
  seed?: number;
  /** Per-cell fade-in duration, ms. Default 520. */
  revealMs?: number;
  /** Delay between consecutive cells appearing, ms. Default 70. */
  staggerMs?: number;
  /** Override the building accent color (else taken from theme.colors.primary). */
  primary?: string;
  /** Override the neutral building color (else taken from theme.colors.text). */
  neutral?: string;
  /** Accessible label for the SVG. */
  ariaLabel?: string;
}

const CELL = 50;

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
  if (color.startsWith('#')) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('');
    const n = parseInt(hex, 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

interface Cell {
  key: string;
  x: number;
  y: number;
  size: number;
  rx: number;
  fill: string;
  /** Position of this cell in the reveal sequence. */
  rank: number;
}

/**
 * A top-down "city map" of square buildings that progressively populates as the
 * `progress` prop climbs from 0 to 1. Layout and reveal order are seeded so the
 * fill is deterministic across renders. Pure SVG, theme-aware.
 */
export function TrailCityProgress({
  theme,
  className,
  cols = 14,
  rows = 14,
  progress = 0,
  density = 0.82,
  seed = 7,
  revealMs = 520,
  staggerMs = 70,
  primary,
  neutral,
  ariaLabel = 'A city map filling in square by square',
}: TrailCityProgressProps) {
  const reducedMotion = usePrefersReducedMotion();

  const accent = primary ?? theme?.colors?.primary ?? '#22d3ee';
  const text = neutral ?? theme?.colors?.text ?? '#f8fafc';

  const { cells, total, viewW, viewH } = useMemo(() => {
    const palette = [
      withAlpha(accent, 0.55),
      withAlpha(accent, 0.36),
      withAlpha(text, 0.45),
      withAlpha(text, 0.3),
      withAlpha(text, 0.18),
    ];

    const rng = mulberry32(seed);
    const built: Omit<Cell, 'rank'>[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const keepRoll = rng();
        const colorRoll = rng();
        const sizeRoll = rng();
        if (keepRoll > density) continue; // empty gap between buildings
        const size = CELL - 8 - sizeRoll * 8; // 34..42px, slight jitter
        built.push({
          key: `${c}-${r}`,
          x: c * CELL + (CELL - size) / 2,
          y: r * CELL + (CELL - size) / 2,
          size,
          rx: 3,
          fill: palette[Math.floor(colorRoll * palette.length)]!,
        });
      }
    }

    // Deterministic reveal order: shuffle indices with a second seed.
    const order = built.map((_, i) => i);
    const sh = mulberry32(seed * 2 + 1);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(sh() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    const rank = new Array<number>(built.length);
    order.forEach((cellIdx, position) => {
      rank[cellIdx] = position;
    });

    const withRank: Cell[] = built.map((b, i) => ({ ...b, rank: rank[i] }));
    return {
      cells: withRank,
      total: withRank.length,
      viewW: cols * CELL,
      viewH: rows * CELL,
    };
  }, [accent, text, cols, rows, density, seed]);

  const target = Math.round(clamp01(progress) * total);

  // `shown` tweens toward `target`, one cell every staggerMs, so newly
  // revealed cells fade in one after another instead of all at once.
  const [shown, setShown] = useState(reducedMotion ? target : 0);
  useEffect(() => {
    if (reducedMotion) {
      setShown(target);
      return;
    }
    if (shown === target) return;
    const dir = shown < target ? 1 : -1;
    const id = setTimeout(() => setShown((s) => s + dir), staggerMs);
    return () => clearTimeout(id);
  }, [shown, target, staggerMs, reducedMotion]);

  return (
    <svg
      className={className}
      viewBox={`0 0 ${viewW} ${viewH}`}
      width="100%"
      height="100%"
      role="img"
      aria-label={ariaLabel}
      style={{ display: 'block', overflow: 'visible' }}
    >
      {cells.map((cell) => {
        const visible = cell.rank < shown;
        return (
          <rect
            key={cell.key}
            x={cell.x}
            y={cell.y}
            width={cell.size}
            height={cell.size}
            rx={cell.rx}
            ry={cell.rx}
            fill={cell.fill}
            style={{
              opacity: visible ? 1 : 0,
              transition: reducedMotion ? 'none' : `opacity ${revealMs}ms ease`,
            }}
          />
        );
      })}
    </svg>
  );
}
