'use client';

import React, { useId, useMemo } from 'react';
import type { Theme } from '@principal-ade/industry-theme';

/**
 * Banner-native sibling of {@link TrailCityDiagram}.
 *
 * Same visual DNA — a seeded top-down city of file "buildings" with a dashed
 * trail threading numbered markers — but composed for wide, short social
 * banners instead of a 700×700 square:
 *   • the city is a wide strip whose column/row count derives from the frame,
 *   • the trail runs left→right with a gentle wave,
 *   • the left edge fades out to reserve room for a platform logo / wordmark,
 *   • the tall 280×200 snippet card is replaced by a compact code chip.
 *
 * Presets target the two surfaces we ship:
 *   • twitterHeader   — 1500 × 500  (3:1)
 *   • linkedinCompany — 1128 × 191  (~5.9:1)
 */

export type BannerVariant = 'twitterHeader' | 'linkedinCompany' | 'linkedinProfile';

interface VariantConfig {
  w: number;
  h: number;
  /** Row count at native size; the cell size is derived from h / rows. */
  rows: number;
  /** Whether the compact code chip shows by default. */
  chip: boolean;
}

const VARIANTS: Record<BannerVariant, VariantConfig> = {
  twitterHeader: { w: 1500, h: 500, rows: 9, chip: true },
  linkedinCompany: { w: 1128, h: 191, rows: 4, chip: false },
  // Personal/employee profile background — 4:1, taller than the company cover.
  linkedinProfile: { w: 1584, h: 396, rows: 7, chip: true },
};

export interface TrailCityBannerProps {
  /** Theme supplying colors. Falls back to dark-mode defaults when absent. */
  theme?: Theme;
  /** Class applied to the wrapping <svg>. */
  className?: string;
  /** Preset surface. Ignored for sizing if width/height are both given. */
  variant?: BannerVariant;
  /** Override the native frame width (defaults to the variant). */
  width?: number;
  /** Override the native frame height (defaults to the variant). */
  height?: number;
  /** Deterministic layout seed — change it to reshuffle the skyline. */
  seed?: number;
  /** Keep the left portion clear of the trail/markers so a logo or wordmark
   *  can overlay there. (No visual fade — just shifts where the trail starts.) */
  reserveLeft?: boolean;
  /** Show the dashed trail + numbered markers. */
  showTrail?: boolean;
  /** Show the compact code chip near the focal marker. Defaults per variant. */
  showChip?: boolean;
  /**
   * Which marker (1-based) the code chip's leader connects to — also the
   * highlighted/active marker. Defaults to 2.
   */
  leaderMarker?: number;
}

export function TrailCityBanner({
  theme,
  className,
  variant = 'twitterHeader',
  width,
  height,
  seed = 7,
  reserveLeft = true,
  showTrail = true,
  showChip,
  leaderMarker = 2,
}: TrailCityBannerProps) {
  const cfg = VARIANTS[variant];
  const W = width ?? cfg.w;
  const H = height ?? cfg.h;
  const uid = useId().replace(/:/g, '');

  // --- colors (mirrors TrailCityDiagram) -------------------------------
  const colors = theme?.colors;
  const accent = colors?.primary ?? '#22d3ee';
  const surface = colors?.surface ?? '#0f1419';
  const text = colors?.text ?? '#f8fafc';
  const muted = colors?.textMuted ?? '#94a3b8';
  const bg = colors?.background ?? '#0a0f14';

  const palette = useMemo(
    () => [
      withAlpha(accent, 0.36),
      withAlpha(accent, 0.55),
      withAlpha(text, 0.18),
      withAlpha(text, 0.3),
      withAlpha(text, 0.45),
    ],
    [accent, text],
  );

  // --- grid geometry derived from the frame ----------------------------
  const cell = cfg.h / cfg.rows; // building cell size, consistent across variants
  const COLS = Math.max(4, Math.round(W / cell));
  const ROWS = Math.max(2, Math.round(H / cell));
  const gap = Math.max(3, cell * 0.16);
  const offsetX = Math.round((W - COLS * cell) / 2);
  const offsetY = Math.round((H - ROWS * cell) / 2);

  const center = (col: number, row: number) => ({
    x: offsetX + col * cell + cell / 2,
    y: offsetY + row * cell + cell / 2,
  });

  // --- markers: walk left→right with a gentle wave ---------------------
  const markerCells = useMemo(() => {
    // Start the trail past the reserved-left zone so markers avoid the logo.
    const startCol = Math.round(COLS * (reserveLeft ? 0.34 : 0.12));
    const span = Math.max(1, COLS - startCol - 1);
    const colFracs = [0.0, 0.32, 0.62, 0.9];
    const rowFracs = [0.72, 0.36, 0.66, 0.42];
    return colFracs.map((f, i) => ({
      col: clamp(startCol + Math.round(f * span), 0, COLS - 1),
      row: clamp(Math.round(rowFracs[i] * (ROWS - 1)), 0, ROWS - 1),
      label: String(i + 1),
    }));
  }, [COLS, ROWS, reserveLeft]);

  const pinned = useMemo(
    () => new Set(markerCells.map((m) => `${m.col},${m.row}`)),
    [markerCells],
  );

  const buildings = useMemo(() => {
    const rng = mulberry32(seed);
    const list: { x: number; y: number; w: number; h: number; fill: string }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const isPinned = pinned.has(`${c},${r}`);
        const skipRoll = rng();
        // burn two draws to keep the color sequence stable vs. the diagram
        rng();
        rng();
        const colorRoll = rng();
        if (!isPinned && skipRoll < 0.16) continue;
        list.push({
          x: offsetX + c * cell + gap / 2,
          y: offsetY + r * cell + gap / 2,
          w: cell - gap,
          h: cell - gap,
          fill: palette[Math.floor(colorRoll * palette.length)]!,
        });
      }
    }
    return list;
  }, [palette, pinned, COLS, ROWS, cell, gap, offsetX, offsetY, seed]);

  const markers = useMemo(
    () => markerCells.map((m) => ({ ...center(m.col, m.row), label: m.label })),
    // center() is pure over the deps below
    [markerCells, offsetX, offsetY, cell],
  );

  const trailPath = useMemo(() => {
    const [first, ...rest] = markers;
    if (!first) return '';
    return [`M ${first.x} ${first.y}`, ...rest.map((m) => `L ${m.x} ${m.y}`)].join(' ');
  }, [markers]);

  const leaderIndex = clamp(Math.round(leaderMarker) - 1, 0, markers.length - 1);
  const focal = markers[leaderIndex];
  const markerSize = clamp(cell * 0.46, 14, 26);

  const chip = showChip ?? cfg.chip;
  const chipBox = useMemo(() => {
    if (!chip || !focal) return null;
    const margin = Math.round(cell * 0.5);
    const cw = clamp(cell * 5.2, 150, W - margin * 2);
    const ch = clamp(cell * 1.7, 54, Math.max(54, H * 0.5));
    // Sit the card horizontally near the next marker (#3) — to the right of
    // the leader marker — and dropped down a bit from the top band so the
    // leader reads as a clear run rather than a stub.
    const placeX = (markers[leaderIndex + 1] ?? focal).x;
    const cx = clamp(placeX - cw / 2, margin, W - margin - cw);
    const cy = clamp(margin + Math.round(cell * 1.4), margin, Math.max(margin, H - ch - margin));
    // Anchor on the chip's bottom edge, nearest the leader marker.
    const ax = clamp(focal.x, cx + 14, cx + cw - 14);
    const ay = cy + ch;
    return { x: cx, y: cy, w: cw, h: ch, ax, ay };
  }, [chip, focal, markers, leaderIndex, cell, W, H]);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-label="A trail of code locations connected across a wide top-down city of files"
    >
      <defs>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity={0.35} />
          <stop offset="100%" stopColor={accent} stopOpacity={0} />
        </radialGradient>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill={bg} />

      {/* City strip */}
      <g>
        {buildings.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            fill={b.fill}
            stroke={withAlpha(text, 0.08)}
            strokeWidth={0.5}
            rx={2}
          />
        ))}
      </g>


      {showTrail && (
        <>
          {/* Trail polyline */}
          <path
            d={trailPath}
            fill="none"
            stroke={accent}
            strokeWidth={clamp(cell * 0.05, 1.5, 3)}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${cell * 0.12} ${cell * 0.1}`}
            opacity={0.9}
          />

          {/* L-routed leader from the focal marker up to the code chip,
            * with an anchor dot where it meets the card. */}
          {chipBox && focal && (
            <>
              <path
                d={lRoutePath(
                  { x: focal.x, y: focal.y },
                  { x: chipBox.ax, y: chipBox.ay },
                )}
                fill="none"
                stroke={accent}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                opacity={0.75}
              />
              <circle cx={chipBox.ax} cy={chipBox.ay} r={3} fill={accent} />
            </>
          )}

          {/* Markers */}
          {markers.map((m, i) => {
            const isActive = i === leaderIndex;
            const half = markerSize / 2;
            return (
              <g key={m.label}>
                {isActive && (
                  <>
                    <circle cx={m.x} cy={m.y} r={markerSize * 1.6} fill={`url(#glow-${uid})`} />
                    <rect
                      x={m.x - half - 4}
                      y={m.y - half - 4}
                      width={markerSize + 8}
                      height={markerSize + 8}
                      rx={6}
                      fill={accent}
                      opacity={0.18}
                    >
                      <animate
                        attributeName="opacity"
                        values="0.28;0;0.28"
                        dur="2.4s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  </>
                )}
                <rect
                  x={m.x - half}
                  y={m.y - half}
                  width={markerSize}
                  height={markerSize}
                  rx={4}
                  fill={surface}
                  stroke={accent}
                  strokeWidth={1.75}
                />
                <text
                  x={m.x}
                  y={m.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={markerSize * 0.62}
                  fontWeight={700}
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill={text}
                >
                  {m.label}
                </text>
              </g>
            );
          })}

          {/* Compact code chip */}
          {chipBox && (
            <CodeChip
              x={chipBox.x}
              y={chipBox.y}
              w={chipBox.w}
              h={chipBox.h}
              surface={surface}
              text={text}
              muted={muted}
              accent={accent}
            />
          )}
        </>
      )}
    </svg>
  );
}

function CodeChip({
  x,
  y,
  w,
  h,
  surface,
  text,
  muted,
  accent,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  surface: string;
  text: string;
  muted: string;
  accent: string;
}) {
  const header = clamp(h * 0.32, 18, 30);
  const pad = clamp(w * 0.05, 8, 16);
  const lines = [
    { w: w * 0.62, c: muted },
    { w: w * 0.8, c: text },
    { w: w * 0.45, c: accent },
  ];
  const lineGap = (h - header - pad) / (lines.length + 0.5);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={w}
        height={h}
        rx={10}
        fill={surface}
        stroke={withAlpha(accent, 0.55)}
        strokeWidth={1.5}
      />
      <rect width={w} height={header} rx={10} fill={withAlpha(accent, 0.1)} />
      <text
        x={pad}
        y={header / 2}
        dominantBaseline="central"
        fontSize={clamp(header * 0.46, 10, 14)}
        fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
        fill={text}
      >
        db/users.ts:42
      </text>
      <g transform={`translate(${pad}, ${header + pad})`}>
        {lines.map((l, i) => (
          <rect
            key={i}
            x={0}
            y={i * lineGap}
            width={l.w - pad * 2}
            height={clamp(h * 0.06, 4, 8)}
            rx={2}
            fill={l.c}
            opacity={0.75}
          />
        ))}
      </g>
    </g>
  );
}

// --- local helpers (kept private; mirror TrailCityDiagram) -------------

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

/** VH leader from `a` (marker) to `b` (chip anchor): exits `a` vertically
 *  toward `b.y`, then turns and runs horizontally to `b.x`. */
function lRoutePath(
  a: { x: number; y: number },
  b: { x: number; y: number },
  radius = 12,
): string {
  const ySign = b.y < a.y ? -1 : 1;
  const xSign = b.x < a.x ? -1 : 1;
  const r = Math.min(radius, Math.abs(a.y - b.y) / 2, Math.abs(a.x - b.x) / 2) || 0;
  return [
    `M ${a.x} ${a.y}`,
    `L ${a.x} ${b.y - ySign * r}`,
    `Q ${a.x} ${b.y} ${a.x + xSign * r} ${b.y}`,
    `L ${b.x} ${b.y}`,
  ].join(' ');
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
  if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${a}`;
  }
  return color;
}
