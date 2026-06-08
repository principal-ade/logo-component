'use client';

import React, { useId } from 'react';
import type { Theme } from '@principal-ade/industry-theme';

/**
 * Banner port of web-ade's `TrailMarketingCardOG` marketing card.
 *
 * Same composition — a left hero (footprint trail walking toward a big
 * headline + "by Principal AI" byline) beside the File City panel with its
 * dashed trail, numbered markers and a snippet card — re-laid out for wide
 * social banners and rendered in pure SVG (the original uses Satori HTML so it
 * can run in @vercel/og; this version rasterizes through our sharp pipeline).
 *
 * Defaults to the OG card's baked iceTangerineDark palette so it looks exactly
 * like the marketing card; pass a `theme` to retint.
 */

export type MarketingBannerVariant =
  | 'linkedinProfile'
  | 'twitterHeader'
  | 'linkedinCompany';

const SIZES: Record<MarketingBannerVariant, { w: number; h: number }> = {
  linkedinProfile: { w: 1584, h: 396 },
  twitterHeader: { w: 1500, h: 500 },
  linkedinCompany: { w: 1128, h: 191 },
};

// OG card palette (iceTangerineDark, baked) — matches the web-ade card.
const OG = {
  text: '#d0e5ea',
  textTertiary: '#7ba8bc',
  background: '#0d274d',
  backgroundSecondary: '#0f2e58',
  surface: '#0f2e58',
  primary: '#ff6b35',
  accent: '#0893d2',
  border: '#1e3a5f',
  headerBand: '#2c3554',
};

// Pre-blended city tints over the navy bg (from the OG card).
const CITY_PALETTE = ['#393349', '#5a3d45', '#1d365a', '#284263', '#385170'] as const;

// Trail line color — matches FileCityLogoAnimated's connector (light grey).
const TRAIL_LINE = '#e5e7eb';

// Frame.io brand: lowercase "frame.io" wordmark set in Kumbh Sans (same color
// as the body text).
const FRAME_IO_FONT = "'Kumbh Sans', Inter, -apple-system, sans-serif";

// File City geometry — panel-space px (its own 540×540 coordinate system).
const CITY = 540;
const CELL = 42;
const OFFSET = 18;
const COLS = 12;
const ROWS = 12;
const SQUARE = CELL - 8;

// Glyphs from FileCityLogo: 1 = mark square, 2 = hole, 0 = city file.
const GLYPHS = {
  P: [
    [1, 1, 1],
    [1, 2, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 2, 2, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
} as const;

// Big P, scaled 2× and centered in the 12×12 panel. { glyph, scale, c0, r0 }.
// `mark`: 1 = primary-colored, 3 = accent-colored (kept for future letters).
const PLACEMENTS: Array<{
  g: readonly (readonly number[])[];
  scale: number;
  c0: number;
  r0: number;
  mark: number;
}> = [
  { g: GLYPHS.P, scale: 2, c0: 3, r0: 1, mark: 1 }, // cols 3–8, rows 1–10
];

/** Glyph value at a grid cell: 1 = mark, 2 = hole, 0 = city/background. */
function glyphAt(col: number, row: number): number {
  for (const p of PLACEMENTS) {
    const gc = col - p.c0;
    const gr = row - p.r0;
    const w = p.g[0]!.length * p.scale;
    const h = p.g.length * p.scale;
    if (gc < 0 || gr < 0 || gc >= w || gr >= h) continue;
    const v = p.g[Math.floor(gr / p.scale)]![Math.floor(gc / p.scale)]!;
    if (v === 1) return p.mark; // 1 (primary) or 3 (accent)
    if (v === 2) return 2; // hole
  }
  return 0;
}

// Trail wraps around the OUTSIDE of the P and back under it: start on the left
// (one up from the bottom), up the left, across the top, down the right, then
// under the P along the bottom to the bottom-left corner where it meets the
// card. Markers sit on city cells, one out from the P's edges.
const MARKER_CELLS: Array<{ col: number; row: number; label: string }> = [
  { col: 2, row: 10, label: '1' }, // left side, start (one up from the bottom)
  { col: 2, row: 0, label: '2' }, // top-left
  { col: 9, row: 0, label: '3' }, // top-right
  { col: 9, row: 11, label: '4' }, // bottom-right
  { col: 1, row: 11, label: '5' }, // bottom-left, under the P (card anchor)
];

export interface TrailMarketingBannerProps {
  /** Preset surface. Ignored for sizing if width/height are both given. */
  variant?: MarketingBannerVariant;
  width?: number;
  height?: number;
  /** Big hero headline. */
  headline?: string;
  /** Snippet-card caption (lead token is brand-colored). */
  tagline?: string;
  /** Filename shown in the snippet card header. */
  filename?: string;
  /** Byline name (rendered as "by <name>"). Pass '' to hide the byline. */
  byline?: string;
  /** Put the file-city panel on the left and the hero on the right. Default is
   *  false (hero left, city on the right). */
  cityLeft?: boolean;
  /** Override the OG palette with a theme's colors. */
  theme?: Theme;
  className?: string;
}

export function TrailMarketingBanner({
  variant = 'linkedinProfile',
  width,
  height,
  headline = 'Code Trails',
  tagline = 'frame.io for code collaboration',
  filename = 'feature.ts',
  byline = 'Principal AI',
  cityLeft = false,
  theme,
  className,
}: TrailMarketingBannerProps) {
  const size = SIZES[variant];
  const W = width ?? size.w;
  const H = height ?? size.h;
  const uid = useId().replace(/:/g, '');
  const pal = resolvePalette(theme);

  // --- File City panel + hero sizes ------------------------------------
  const panelPad = Math.round(H * 0.075);
  const panelSide = H - panelPad * 2;
  const panelY = panelPad;
  const k = panelSide / CITY;

  // In city-left, nudge the hero up-and-left so it staggers diagonally off the
  // card (which stays anchored in the gap below it).
  const heroStaggerX = cityLeft ? Math.round(W * 0.055) : 0;
  const heroStaggerY = cityLeft ? Math.round(H * 0.1) : 0;
  // Sit the hero high in the frame so it clears the platform's profile photo +
  // name card, which overlap the lower-left of profile backgrounds. (cityLeft
  // keeps its original 0.4 anchor, less its stagger, so that layout is
  // unchanged.)
  const heroBaseFrac = cityLeft ? 0.4 : 0.3;
  const heroCY = Math.round(H * heroBaseFrac) - heroStaggerY;
  const footSize = Math.round(H * 0.04);
  const footGap = Math.round(H * 0.085);
  const headlineFont = Math.round(H * 0.205);
  const bylineFont = Math.round(H * 0.084);

  // Estimate the hero block's width (its widest line) so we can center the
  // hero+panel cluster instead of stranding empty space in the middle of a
  // wide frame. Rough text metrics are fine — this only drives placement.
  const headlineW = headline.length * headlineFont * 0.56;
  const footprintsW = 7 * footGap + footSize;
  const bylineW = byline ? `by ${byline}`.length * bylineFont * 0.56 : 0;
  const heroW = Math.max(headlineW, footprintsW, bylineW);

  // Gap between hero and panel, and the centered start so outer margins
  // balance left/right rather than pinning content to the edges.
  const gap = clamp(panelSide * 0.22, H * 0.3, W * 0.14);
  const minMargin = Math.round(W * 0.05);

  // Panel and hero, centered with balanced margins.
  //   cityLeft → [city] gap [hero]
  //   default  → [hero] gap [city]
  const total = heroW + gap + panelSide;
  let panelX: number;
  let heroX: number;
  if (cityLeft) {
    panelX = Math.max(minMargin, Math.round((W - total) / 2));
    heroX = panelX + panelSide + gap - heroStaggerX;
  } else {
    heroX = Math.max(minMargin, Math.round((W - total) / 2));
    panelX = Math.min(W - panelSide - minMargin, Math.round(heroX + heroW + gap));
  }

  // LinkedIn's profile background crops tighter on the left, so nudge the whole
  // hero + panel + card cluster right (everything is keyed off heroX/panelX).
  const clusterShiftX =
    variant === 'linkedinProfile' && !cityLeft ? Math.round(W * 0.1) : 0;
  if (clusterShiftX) {
    heroX += clusterShiftX;
    panelX = Math.min(W - panelSide - minMargin, panelX + clusterShiftX);
  }

  // LinkedIn fine-tuning: pull the city panel back left a touch.
  const isLinkedInProfile = variant === 'linkedinProfile' && !cityLeft;
  if (isLinkedInProfile) panelX -= Math.round(W * 0.03);
  // X fine-tuning: nudge the city panel right (the card, pinned to the panel's
  // near edge, rides along).
  const isTwitterProfile = variant === 'twitterHeader' && !cityLeft;
  if (isTwitterProfile) {
    panelX = Math.min(W - panelSide - minMargin, panelX + Math.round(W * 0.04));
  }
  // Indent the byline right so it tucks under the headline (profile surfaces).
  const indentByline =
    !cityLeft && (variant === 'linkedinProfile' || variant === 'twitterHeader');
  const bylineX = heroX + (indentByline ? Math.round(W * 0.025) : 0);

  const headlineY = heroCY + Math.round(headlineFont * 0.34);
  const bylineY = headlineY + Math.round(H * 0.115);

  // Split the byline so its last word (e.g. "AI") can be brand-colored.
  const bylineWords = byline.trim().split(/\s+/);
  const bylineLast = bylineWords.pop() ?? '';
  const bylineHead = bylineWords.join(' ');

  // --- Snippet card: hangs off the panel on the hero side, wired to the trace
  //     corner nearest the card (bowl bottom-right for city-left, stem bottom
  //     for city-right). ---
  const cardClip = `snip-${uid}`;
  // Anchor the card to the corner nearest it: bottom-left (last) for city-left
  // is on the right... use bottom-right for city-left, bottom-left for city-right.
  const anchorIndex = cityLeft ? MARKER_CELLS.length - 2 : MARKER_CELLS.length - 1;
  const anchorCell = MARKER_CELLS[anchorIndex]!;
  const anchorPt = cellCenter(anchorCell.col, anchorCell.row);
  const anchorX = panelX + anchorPt.x * k;
  const anchorY = panelY + anchorPt.y * k;

  const bodyFont = Math.round(H * 0.058);
  const headerFont = Math.round(H * 0.044);
  const headerH = Math.round(bodyFont * 1.6);
  const padX = Math.round(bodyFont * 0.7);
  const padY = Math.round(bodyFont * 0.7);
  // Tagline on a single line; in city-left the card spans the headline width so
  // it centers directly under "Code Trails".
  const taglineWords = tagline ? tagline.trim().split(/\s+/) : [];
  const taglineW = tagline ? Math.round(tagline.length * bodyFont * 0.55) : 0;
  const cardW = cityLeft
    ? taglineW + padX * 2 // just fits the one-line tagline
    : Math.max(Math.round(panelSide * 0.92), taglineW + padX * 2); // widen to fit the bigger text
  const cardH = headerH + padY * 2 + bodyFont;
  // The headline renders tighter than the estimate (bold + letterSpacing -2),
  // so use a corrected width to center the card under it.
  const headlineRenderW = Math.round(headlineW * 0.86);
  let cardX = Math.round(heroX + (headlineRenderW - cardW) / 2); // centered under the headline
  if (!cityLeft) {
    // The card would otherwise sit in the lower-left, where the platform drops
    // the profile photo / avatar. Push it right to clear that chrome (and sit
    // nearer the trail it labels) — but never far enough to run into the panel.
    const clearLeft = Math.round(W * 0.36);
    const maxLeft = panelX - cardW - Math.round(W * 0.012);
    cardX = clamp(cardX, Math.min(clearLeft, maxLeft), maxLeft);
  }
  const cardNearX = cityLeft ? cardX : cardX + cardW;
  const cardY = Math.max(panelY, panelY + panelSide - cardH);
  const leaderY = clamp(anchorY, cardY + 12, cardY + cardH - 12);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-label={`${headline} — ${byline ? `by ${byline} — ` : ''}a trail through a city of files`}
    >
      <defs>
        <clipPath id={`city-${uid}`}>
          <rect x={0} y={0} width={CITY} height={CITY} rx={16} />
        </clipPath>
      </defs>

      <rect x={0} y={0} width={W} height={H} fill={pal.background} />

      {/* File City panel, scaled from its native 540-space into the frame */}
      <g transform={`translate(${panelX}, ${panelY}) scale(${k})`}>
        <rect
          x={0}
          y={0}
          width={CITY}
          height={CITY}
          rx={16}
          fill={pal.backgroundSecondary}
          stroke={pal.border}
          strokeWidth={1}
        />
        <g clipPath={`url(#city-${uid})`}>
          <FileCity pal={pal} markerCells={MARKER_CELLS} glowIndex={anchorIndex} />
        </g>
      </g>

      {/* Snippet card — hangs off the panel on the hero side, wired to the
        * trail's final marker. */}
      {tagline && (
        <>
          <path
            d={`M ${anchorX} ${anchorY} L ${cardNearX} ${leaderY}`}
            fill="none"
            stroke={TRAIL_LINE}
            strokeWidth={1.5}
            strokeDasharray="5 4"
            opacity={0.7}
          />
          <circle cx={cardNearX} cy={leaderY} r={3.5} fill={pal.accent} />
          <SnippetCard
            x={cardX}
            y={cardY}
            w={cardW}
            h={cardH}
            headerH={headerH}
            headerFont={headerFont}
            bodyFont={bodyFont}
            padX={padX}
            padY={padY}
            words={taglineWords}
            filename={filename}
            pal={pal}
            clipId={cardClip}
          />
        </>
      )}

      {/* Hero — headline + byline */}
      <g>
        <text
          x={heroX}
          y={headlineY}
          fontSize={headlineFont}
          fontWeight={700}
          letterSpacing={-2}
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          fill={TRAIL_LINE}
        >
          {headline}
        </text>

        {byline && (
          <text
            x={bylineX}
            y={bylineY}
            fontSize={bylineFont}
            fontWeight={600}
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            xmlSpace="preserve"
          >
            <tspan fill={pal.textTertiary}>by </tspan>
            {bylineHead && <tspan fill={pal.primary}>{bylineHead} </tspan>}
            <tspan fill={pal.primary}>{bylineLast}</tspan>
          </text>
        )}
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// File City (native 540-space, ported from TrailMarketingCardOG)
// ---------------------------------------------------------------------------

function FileCity({
  pal,
  markerCells,
  glowIndex = 0,
}: {
  pal: Palette;
  markerCells: Array<{ col: number; row: number; label: string }>;
  glowIndex?: number;
}) {
  const pinned = new Set(markerCells.map((m) => `${m.col},${m.row}`));
  const cells = buildCity(pinned, pal.city, pal.mark, pal.markAccent);
  const markers = markerCells.map((m) => ({ ...cellCenter(m.col, m.row), label: m.label }));
  const feet = trailFootsteps(markers, 52, 7, 30);

  return (
    <>
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={SQUARE} height={SQUARE} rx={2} fill={c.fill} />
      ))}

      {/* Trail — footprints walking the curve through the markers (faded) */}
      <g opacity={0.16}>
        {feet.map((f, i) => (
          <Footprint
            key={i}
            x={f.x}
            y={f.y}
            angle={f.angle}
            mirror={f.mirror}
            size={13}
            color={TRAIL_LINE}
          />
        ))}
      </g>

      {/* Markers — accent dots; the wired (glow) one gets a soft ring */}
      {markers.map((m, i) => {
        const isGlow = i === glowIndex;
        const r = 12;
        return (
          <React.Fragment key={m.label}>
            {isGlow && <circle cx={m.x} cy={m.y} r={r + 9} fill={pal.primary} opacity={0.22} />}
            <circle cx={m.x} cy={m.y} r={r} fill={pal.primary} opacity={isGlow ? 1 : 0.4} />
          </React.Fragment>
        );
      })}
    </>
  );
}

/** Snippet card rendered in banner space (outside the city panel). */
function SnippetCard({
  x,
  y,
  w,
  h,
  headerH,
  headerFont,
  bodyFont,
  padX,
  padY,
  words,
  filename,
  pal,
  clipId,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  headerH: number;
  headerFont: number;
  bodyFont: number;
  padX: number;
  padY: number;
  words: string[];
  filename: string;
  pal: Palette;
  clipId: string;
}) {
  return (
    <g>
      <defs>
        <clipPath id={clipId}>
          <rect x={x} y={y} width={w} height={h} rx={12} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect x={x} y={y} width={w} height={h} fill={pal.surface} />
        <rect x={x} y={y} width={w} height={headerH} fill={pal.headerBand} />
        <text
          x={x + padX}
          y={y + headerH / 2}
          dominantBaseline="central"
          fontSize={headerFont}
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fill={pal.textTertiary}
        >
          {filename}
        </text>
        {words.length > 0 && (
          <text
            x={x + padX}
            y={y + headerH + padY + bodyFont}
            fontSize={bodyFont}
            fontWeight={600}
            fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            xmlSpace="preserve"
          >
            {words.map((wd, wi) => {
              // First word is the Frame.io wordmark (dark, Kumbh Sans); the
              // trailing phrase ("code collaboration") is brand-colored; the
              // connective words stay body text.
              const isFrame = wi === 0;
              const isTail = wi >= words.length - 2;
              return (
                <tspan
                  key={wi}
                  fill={isTail ? pal.primary : pal.text}
                  fontFamily={isFrame ? FRAME_IO_FONT : undefined}
                >
                  {wi > 0 ? ' ' : ''}
                  {wd}
                </tspan>
              );
            })}
          </text>
        )}
      </g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={12}
        fill="none"
        stroke={pal.primary}
        strokeWidth={1.5}
      />
    </g>
  );
}

/** Footprint glyph (viewBox "2 1 9 18"). `angle` points the toe along the
 *  walk direction (90° = walking →); `mirror` flips left vs right foot. */
function Footprint({
  x,
  y,
  angle = 90,
  mirror = false,
  size,
  color,
}: {
  x: number;
  y: number;
  angle?: number;
  mirror?: boolean;
  size: number;
  color: string;
}) {
  const k = size / 9; // glyph is ~9 units wide
  const m = mirror ? ' scale(-1, 1)' : '';
  return (
    <g
      transform={`translate(${x}, ${y}) rotate(${angle})${m} scale(${k}) translate(-6.5, -10)`}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
      <path d="M4 13h4" />
    </g>
  );
}

/** Lay footprints along the (smoothed) trail through `pts`: sample the curve,
 *  walk it at `spacing`, alternate feet, offset each to the side and rotate it
 *  to face the direction of travel. */
function trailFootsteps(
  pts: Array<{ x: number; y: number }>,
  spacing: number,
  offset: number,
  clearance = 0,
): Array<{ x: number; y: number; angle: number; mirror: boolean }> {
  if (pts.length < 2) return [];
  // Straight segments from one marker to the next.
  const samples: Array<{ x: number; y: number }> = pts.map((p) => ({ x: p.x, y: p.y }));
  const cum = [0];
  for (let i = 1; i < samples.length; i++) {
    cum.push(cum[i - 1]! + Math.hypot(samples[i]!.x - samples[i - 1]!.x, samples[i]!.y - samples[i - 1]!.y));
  }
  const total = cum[cum.length - 1]!;
  const feet: Array<{ x: number; y: number; angle: number; mirror: boolean }> = [];
  let si = 1;
  let idx = 0;
  for (let d = spacing * 0.5; d < total; d += spacing, idx++) {
    while (si < cum.length && cum[si]! < d) si++;
    const a = samples[si - 1]!;
    const b = samples[Math.min(si, samples.length - 1)]!;
    const segLen = (cum[si] ?? total) - cum[si - 1]! || 1;
    const f = (d - cum[si - 1]!) / segLen;
    const x = a.x + (b.x - a.x) * f;
    const y = a.y + (b.y - a.y) * f;
    // Keep clear of the dots (which sit on the vertices).
    if (clearance > 0 && pts.some((v) => Math.hypot(x - v.x, y - v.y) < clearance)) continue;
    let dx = b.x - a.x;
    let dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const sign = idx % 2 === 0 ? -1 : 1; // alternate sides of the path
    feet.push({
      x: x + -dy * offset * sign,
      y: y + dx * offset * sign,
      angle: (Math.atan2(dy, dx) * 180) / Math.PI + 90,
      mirror: sign > 0,
    });
  }
  return feet;
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

interface Palette {
  text: string;
  textTertiary: string;
  background: string;
  backgroundSecondary: string;
  surface: string;
  primary: string;
  accent: string;
  border: string;
  headerBand: string;
  city: readonly string[];
  mark: readonly string[];
  markAccent: readonly string[];
}

/** Bright primary shades that make the "P" squares pop off the muted city. */
function markShades(primary: string): string[] {
  return [
    primary,
    mix(primary, '#ffffff', 0.2),
    mix(primary, '#ffffff', 0.08),
    primary,
  ];
}

function resolvePalette(theme?: Theme): Palette {
  if (!theme) {
    return {
      ...OG,
      city: CITY_PALETTE,
      mark: markShades(OG.primary),
      markAccent: markShades(OG.accent),
    };
  }
  const c = theme.colors;
  const primary = c?.primary ?? OG.primary;
  const accent = c?.accent ?? c?.secondary ?? OG.accent;
  const text = c?.text ?? OG.text;
  const background = c?.background ?? OG.background;
  const surface = c?.surface ?? OG.surface;
  return {
    background,
    backgroundSecondary: c?.backgroundSecondary ?? surface,
    surface,
    primary,
    accent,
    text,
    textTertiary: c?.textMuted ?? OG.textTertiary,
    border: c?.border ?? OG.border,
    headerBand: OG.headerBand,
    city: [
      withAlpha(primary, 0.18),
      withAlpha(primary, 0.32),
      withAlpha(text, 0.08),
      withAlpha(text, 0.14),
      withAlpha(text, 0.22),
    ],
    mark: markShades(primary),
    markAccent: markShades(accent),
  };
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function cellCenter(col: number, row: number) {
  return { x: OFFSET + col * CELL + CELL / 2, y: OFFSET + row * CELL + CELL / 2 };
}

function buildCity(
  pinned: ReadonlySet<string>,
  cityPalette: readonly string[],
  markPalette: readonly string[],
  markAccentPalette: readonly string[],
) {
  const rng = mulberry32(7);
  const cells: { x: number; y: number; fill: string }[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isPinned = pinned.has(`${c},${r}`);
      const g = glyphAt(c, r);
      const isMark = g === 1 || g === 3;
      const skipRoll = rng();
      rng();
      rng();
      const colorRoll = rng();
      // Holes punch through to the panel background (unless a marker sits there).
      if (g === 2 && !isPinned) continue;
      // City files thin out for texture; marks + markers always render.
      if (!isMark && !isPinned && skipRoll < 0.18) continue;
      const pal = g === 3 ? markAccentPalette : g === 1 ? markPalette : cityPalette;
      cells.push({
        x: OFFSET + c * CELL + 4,
        y: OFFSET + r * CELL + 4,
        fill: pal[Math.floor(colorRoll * pal.length)]!,
      });
    }
  }
  return cells;
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

/** Greedy word-wrap to ~maxChars per line. */
function wrapWords(text: string, maxChars: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of text.split(' ')) {
    if (cur && (cur + ' ' + w).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? `${cur} ${w}` : w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Blend hex `a` toward hex `b` by `t` (0..1). */
function mix(a: string, b: string, t: number): string {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  if (!pa || !pb) return a;
  const ch = (x: number, y: number) => Math.round(x + (y - x) * t);
  const h = (n: number) => n.toString(16).padStart(2, '0');
  return `#${h(ch(pa.r, pb.r))}${h(ch(pa.g, pb.g))}${h(ch(pa.b, pb.b))}`;
}

function hexToRgb(color: string): { r: number; g: number; b: number } | null {
  if (!/^#([0-9a-f]{3}){1,2}$/i.test(color)) return null;
  let hex = color.slice(1);
  if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('');
  return {
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
  };
}

function withAlpha(color: string, alpha: number): string {
  if (/^#([0-9a-f]{3}){1,2}$/i.test(color)) {
    let hex = color.slice(1);
    if (hex.length === 3) hex = hex.split('').map((ch) => ch + ch).join('');
    const a = Math.round(Math.max(0, Math.min(1, alpha)) * 255)
      .toString(16)
      .padStart(2, '0');
    return `#${hex}${a}`;
  }
  return color;
}
