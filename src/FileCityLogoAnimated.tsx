import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  computeFileCityLayout,
  fileCityLabel,
  FileCityPanel,
  type FileCityLogoProps,
} from './FileCityLogo';

export interface FileCityLogoAnimatedProps extends FileCityLogoProps {
  /**
   * Min / max number of cells in each group. The cells in a group reveal
   * one at a time (`cellMs` apart); then the build holds for `pauseMs`
   * before the next group. Default 5–10.
   */
  batchMin?: number;
  batchMax?: number;
  /** Milliseconds between cells within a group. Default 185. */
  cellMs?: number;
  /** Milliseconds to hold after a group completes, before the next. Default 900. */
  pauseMs?: number;
  /**
   * Draw a connector line threading the cells of the active group in reveal
   * order — it grows as each cell appears, then fades out during the pause.
   * Default true.
   */
  connectors?: boolean;
  /** Connector color. Defaults to the accent (falling back to primary). */
  connectorColor?: string;
  /**
   * How many samples a full-weight (letter) cell needs before it reaches
   * full intensity. City files need proportionally fewer (by their lower
   * weight), so the letter builds up gradually while the city pops in.
   * Default 1 — every square is touched exactly once and pops to full.
   * Raise it (e.g. 3) for the gradual heatmap build-up. */
  buildSteps?: number;
  /** Start playing on mount. Default true. */
  autoPlay?: boolean;
  /** Replay key — change this value to restart the animation. */
  playKey?: string | number;
  /** Called once the heatmap has fully resolved. */
  onComplete?: () => void;
}

// CSS keyframe name for the connector draw-on. CSS animations restart on
// element remount (unlike SMIL's document-timeline `begin`), so each group's
// freshly-keyed connector draws from the start.
const CONN_DRAW = 'fc-conn-draw';
// Node dots pop in (scale + fade) as the trail reaches each one.
const DOT_POP = 'fc-dot-pop';
// Once resolved, a soft sheen sweeps diagonally across the mark.
const SHEEN = 'fc-sheen';

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

/**
 * Animated file-city mark: the squares accumulate like a heatmap. Each tick
 * a batch of cells gets a "sample" added; letter cells weigh more so they
 * take several samples to reach full intensity while city files resolve
 * quickly. Once the summed weights fill in, the logo holds on screen.
 */
export const FileCityLogoAnimated: React.FC<FileCityLogoAnimatedProps> = (props) => {
  const uid = useId().replace(/:/g, '');
  const {
    width = 150,
    height = 150,
    batchMin = 5,
    batchMax = 10,
    cellMs = 185,
    pauseMs = 900,
    buildSteps = 1,
    connectors = true,
    connectorColor,
    autoPlay = true,
    playKey,
    onComplete,
  } = props;

  // The trail line is a light grey (close to white); the nodes it threads
  // to are marked with accent-colored dots so the destinations pop.
  const trailColor = connectorColor ?? '#e5e7eb';
  const dotColor =
    props.accent ??
    props.theme?.colors.accent ??
    props.primary ??
    props.theme?.colors.primary ??
    '#22d3ee';

  const { cells, extras, bgColor, baseColor, rounded, opacity, mark, gloss } = useMemo(
    () => computeFileCityLayout(props),
    // Re-derive only when an input that affects layout changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      props.mark,
      props.primary,
      props.accent,
      props.color,
      props.background,
      props.theme,
      props.cells,
      props.highlight,
      props.trail,
      props.gradient,
      props.rounded,
      props.margin,
      props.aiCard,
      props.opacity,
      props.gloss,
      props.squareRadius,
    ],
  );

  // Per-cell number of samples to fully reveal it (>=1; letter cells take
  // `buildSteps`, city cells proportionally fewer by their weight).
  const stepsFor = useMemo(
    () => cells.map((cell) => Math.max(1, Math.round(cell.weight * buildSteps))),
    [cells, buildSteps],
  );

  // The pool of pending samples: each cell index repeated `steps` times,
  // shuffled deterministically so the batches scatter across the grid,
  // then sliced into groups of `batchMin`..`batchMax`.
  const groups = useMemo(() => {
    const p: number[] = [];
    stepsFor.forEach((n, i) => {
      for (let k = 0; k < n; k++) p.push(i);
    });
    const shuffle = mulberry32(0x5eed + cells.length);
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(shuffle() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    const sizeRand = mulberry32(0xb47c4 + cells.length);
    const g: number[][] = [];
    let i = 0;
    while (i < p.length) {
      const size = batchMin + Math.floor(sizeRand() * (batchMax - batchMin + 1));
      g.push(p.slice(i, i + size));
      i += size;
    }
    return g;
  }, [stepsFor, cells.length, batchMin, batchMax]);

  // `progress[i]` = samples applied to cell i. Once every group has been
  // walked the animation is done and the logo holds.
  const [progress, setProgress] = useState<number[]>(() => cells.map(() => 0));
  const [done, setDone] = useState(false);
  // The connector for the active group: which group it traces, and whether
  // it's drawing on (during the reveal) or fading out (during the pause).
  const [conn, setConn] = useState<{ group: number; fading: boolean } | null>(null);
  const groupRef = useRef(0);
  const memberRef = useRef(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Drive the accumulation. Re-runs whenever the layout, timing, or the
  // explicit `playKey` changes — that's our "replay."
  useEffect(() => {
    // Respect reduced-motion: jump straight to the resolved logo.
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    groupRef.current = 0;
    memberRef.current = 0;
    setProgress(cells.map(() => 0));
    setConn(null);
    setDone(false);

    if (!autoPlay || cells.length === 0 || reduce) {
      setProgress(stepsFor.slice());
      setDone(true);
      onCompleteRef.current?.();
      return;
    }

    let timer: ReturnType<typeof setTimeout>;
    let fadeTimer: ReturnType<typeof setTimeout>;
    // Hold the finished trail on screen before it fades, so the completed
    // group lingers a beat. Keep linger + fade within the pause.
    const lingerMs = Math.max(0, Math.min(pauseMs - fadeMs - 40, 450));

    // Reveal one cell per step. Within a group the steps are `cellMs`
    // apart; finishing a group schedules the next one after `pauseMs`.
    const step = () => {
      const gi = groupRef.current;
      if (gi >= groups.length) {
        setDone(true);
        onCompleteRef.current?.();
        return;
      }
      const group = groups[gi];
      const mi = memberRef.current;
      const idx = group[mi];
      setProgress((prev) => {
        const next = prev.slice();
        next[idx] = Math.min(stepsFor[idx], next[idx] + 1);
        return next;
      });

      const lastInGroup = mi + 1 >= group.length;
      // Start the connector drawing on when the group begins.
      if (mi === 0) setConn({ group: gi, fading: false });
      if (lastInGroup) {
        // The trail is fully drawn — hold it for `lingerMs`, then flip to
        // fading so it dissolves before the next group begins.
        fadeTimer = setTimeout(
          () => setConn({ group: gi, fading: true }),
          lingerMs,
        );
        groupRef.current = gi + 1;
        memberRef.current = 0;
        timer = setTimeout(step, pauseMs);
      } else {
        memberRef.current = mi + 1;
        timer = setTimeout(step, cellMs);
      }
    };

    timer = setTimeout(step, cellMs);
    return () => {
      clearTimeout(timer);
      clearTimeout(fadeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cells, groups, stepsFor, cellMs, pauseMs, autoPlay, playKey]);

  // Easing for the per-cell fill-in so each sample lands softly.
  const ease = (t: number) => 1 - Math.pow(1 - t, 2);

  // Connector geometry — the full path through the active group's cell
  // centers (drawn on with stroke-dashoffset, so we render every point up
  // front and animate the reveal).
  const sq = cells.length ? cells[0].sq : 1;
  const centerOf = (idx: number) => ({
    x: cells[idx].x + cells[idx].sq / 2,
    y: cells[idx].y + cells[idx].sq / 2,
  });
  const connGroup = conn ? groups[conn.group] : null;
  // Build a gently-curved path through the node centers (Catmull-Rom →
  // cubic Béziers). It still passes exactly through every dot, just with a
  // soft bend between them instead of straight segments. `k` is the curve
  // strength — small keeps it subtle.
  const smoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length < 2) return null;
    if (pts.length === 2)
      return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;
    const k = 0.2;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const cp1x = p1.x + (p2.x - p0.x) * k;
      const cp1y = p1.y + (p2.y - p0.y) * k;
      const cp2x = p2.x - (p3.x - p1.x) * k;
      const cp2y = p2.y - (p3.y - p1.y) * k;
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
    }
    return d;
  };
  const connectorPath =
    connGroup && connGroup.length > 1
      ? smoothPath(connGroup.map((idx) => centerOf(idx)))
      : null;
  // Draw the trail on across the group's reveal (so the line reaches each
  // cell about as it lights up); fade should finish inside the pause.
  const drawMs = connGroup ? Math.max(cellMs, (connGroup.length - 1) * cellMs) : 0;
  const fadeMs = Math.max(120, Math.min(pauseMs - 60, 360));

  // One cell as a <rect>.
  const renderCell = (cell: (typeof cells)[number], i: number) => {
    const reveal = done ? 1 : ease(progress[i] / stepsFor[i]);
    if (reveal <= 0) return null;
    return (
      <rect
        key={cell.key}
        x={cell.x}
        y={cell.y}
        width={cell.sq}
        height={cell.sq}
        rx={cell.rx}
        fill={cell.fill}
        fillOpacity={reveal}
        stroke={cell.stroke}
        strokeWidth={cell.strokeWidth}
        strokeOpacity={reveal}
      />
    );
  };

  const showTrail = connectors && connectorPath && conn && !done;
  const fadeStyle = {
    transition: `opacity ${fadeMs}ms ease`,
    opacity: conn?.fading ? 0 : 1,
  } as const;
  const maskId = `conn-mask-${uid}-${conn?.group ?? 0}`;
  const lineW = Math.max(0.6, sq * 0.12);
  const dotR = Math.max(1.4, sq * 0.27);
  const segCount = connGroup ? connGroup.length - 1 : 0;

  // The trail line (drawn-on dashed path) on its own layer.
  const trailLine = showTrail ? (
    <g key={`conn-line-${conn!.group}`} style={fadeStyle}>
      <style>{`@keyframes ${CONN_DRAW}{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}@keyframes ${DOT_POP}{from{opacity:0;transform:scale(0.2)}to{opacity:1;transform:scale(1)}}`}</style>
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          <path
            d={connectorPath!}
            fill="none"
            stroke="#fff"
            strokeWidth={lineW * 2.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1}
            style={{ animation: `${CONN_DRAW} ${drawMs}ms linear forwards` }}
          />
        </mask>
      </defs>
      <path
        d={connectorPath!}
        fill="none"
        stroke={trailColor}
        strokeWidth={lineW}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${sq * 0.18} ${sq * 0.14}`}
        mask={`url(#${maskId})`}
        opacity={0.9}
      />
    </g>
  ) : null;

  // The accent node-dots — always the topmost trail layer so they read as
  // markers even when the line tucks behind the blocks.
  const trailDots = showTrail ? (
    <g key={`conn-dots-${conn!.group}`} style={fadeStyle}>
      {connGroup!.map((idx, i) => {
        const p = centerOf(idx);
        const delay = segCount > 0 ? (i / segCount) * drawMs : 0;
        return (
          <circle
            key={`dot-${idx}-${i}`}
            cx={p.x}
            cy={p.y}
            r={dotR}
            fill={dotColor}
            style={{
              transformBox: 'fill-box',
              transformOrigin: 'center',
              animation: `${DOT_POP} 220ms ease-out ${delay}ms both`,
            }}
          />
        );
      })}
    </g>
  ) : null;

  return (
    <FileCityPanel
      width={width}
      height={height}
      bgColor={bgColor}
      baseColor={baseColor}
      rounded={rounded}
      opacity={opacity}
      gloss={gloss}
      label={fileCityLabel(mark)}
    >
      {/* Base pass: every cell. */}
      {cells.map((cell, i) => renderCell(cell, i))}
      {/* The trail line and its accent node-dots ride on top of the city. */}
      {trailLine}
      {trailDots}
      {done ? extras : null}
      {/* Once resolved, a diagonal sheen sweeps across the mark — a bright
          band clipped to the blocks, translated left → right and then
          resting off-screen before the next pass. */}
      {done ? (
        <>
          <style>{`@keyframes ${SHEEN}{from{transform:translateX(-120px)}to{transform:translateX(120px)}}`}</style>
          <defs>
            <clipPath id={`sheen-clip-${uid}`}>
              {cells.map((cell) => (
                <rect
                  key={cell.key}
                  x={cell.x}
                  y={cell.y}
                  width={cell.sq}
                  height={cell.sq}
                  rx={cell.rx}
                />
              ))}
            </clipPath>
            <linearGradient id={`sheen-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity={0} />
              <stop offset="42%" stopColor="#fff" stopOpacity={0} />
              <stop offset="50%" stopColor="#fff" stopOpacity={0.5} />
              <stop offset="58%" stopColor="#fff" stopOpacity={0} />
              <stop offset="100%" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g clipPath={`url(#sheen-clip-${uid})`} style={{ pointerEvents: 'none' }}>
            <g style={{ animation: `${SHEEN} 1.1s ease-in-out forwards` }}>
              <rect x={-20} y={-20} width={140} height={140} fill={`url(#sheen-grad-${uid})`} />
            </g>
          </g>
        </>
      ) : null}
    </FileCityPanel>
  );
};
