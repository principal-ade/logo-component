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
   * before the next group. Default 3–6.
   */
  batchMin?: number;
  batchMax?: number;
  /** Milliseconds between cells within a group. Default 130. */
  cellMs?: number;
  /** Milliseconds to hold after a group completes, before the next. Default 700. */
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
   * weight), so the letter builds up gradually while the city pops in. */
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
    batchMin = 3,
    batchMax = 6,
    cellMs = 130,
    pauseMs = 700,
    buildSteps = 3,
    connectors = true,
    connectorColor,
    autoPlay = true,
    playKey,
    onComplete,
  } = props;

  const accentColor =
    connectorColor ??
    props.accent ??
    props.theme?.colors.accent ??
    props.primary ??
    props.theme?.colors.primary ??
    '#22d3ee';

  const { cells, extras, bgColor, baseColor, rounded, opacity, mark } = useMemo(
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
      // Start the connector drawing on when the group begins; once it's
      // complete, flip to fading so it dissolves through the pause.
      if (mi === 0) setConn({ group: gi, fading: false });
      if (lastInGroup) setConn({ group: gi, fading: true });
      if (lastInGroup) {
        groupRef.current = gi + 1;
        memberRef.current = 0;
        timer = setTimeout(step, pauseMs);
      } else {
        memberRef.current = mi + 1;
        timer = setTimeout(step, cellMs);
      }
    };

    timer = setTimeout(step, cellMs);
    return () => clearTimeout(timer);
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
  const connectorPath =
    connGroup && connGroup.length > 1
      ? connGroup
          .map((idx, i) => {
            const p = centerOf(idx);
            return `${i ? 'L' : 'M'} ${p.x} ${p.y}`;
          })
          .join(' ')
      : null;
  // Draw the trail on across the group's reveal (so the line reaches each
  // cell about as it lights up); fade should finish inside the pause.
  const drawMs = connGroup ? Math.max(cellMs, (connGroup.length - 1) * cellMs) : 0;
  const fadeMs = Math.max(120, Math.min(pauseMs - 60, 360));

  return (
    <FileCityPanel
      width={width}
      height={height}
      bgColor={bgColor}
      baseColor={baseColor}
      rounded={rounded}
      opacity={opacity}
      label={fileCityLabel(mark)}
    >
      {cells.map((cell, i) => {
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
      })}
      {connectors && connectorPath && conn && !done ? (
        // The trail is a dashed (dotted) path, revealed progressively by a
        // mask: a solid line draws itself on (stroke-dashoffset 1 → 0 with
        // pathLength normalized to 1), uncovering the dots block by block as
        // the trail extends.
        (() => {
          const maskId = `conn-mask-${uid}-${conn.group}`;
          const w = Math.max(0.6, sq * 0.12);
          return (
            <g key={`conn-${conn.group}`}>
              <style>{`@keyframes ${CONN_DRAW}{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}`}</style>
              <defs>
                <mask id={maskId} maskUnits="userSpaceOnUse">
                  <path
                    d={connectorPath}
                    fill="none"
                    stroke="#fff"
                    strokeWidth={w * 2.6}
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
                d={connectorPath}
                fill="none"
                stroke={accentColor}
                strokeWidth={w}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={`${sq * 0.18} ${sq * 0.14}`}
                mask={`url(#${maskId})`}
                style={{
                  transition: `opacity ${fadeMs}ms ease`,
                  opacity: conn.fading ? 0 : 0.9,
                }}
              />
            </g>
          );
        })()
      ) : null}
      {done ? extras : null}
    </FileCityPanel>
  );
};
