import React, { useMemo, useRef, useState, useEffect } from "react";
import { layoutText, PositionedPath } from "./strokeCharacters";

let globalIdCounter = 0;

type ChaosMode = "none" | "fragmented";

interface TextRevealProps {
  /** The text to display */
  text: string;

  /** Width of the SVG container */
  width?: number;
  /** Height of the SVG container */
  height?: number;

  /** Scale factor for the text (default 1) */
  scale?: number;
  /** Letter spacing in units (default 4) */
  letterSpacing?: number;
  /** Center the text in the container */
  centerText?: boolean;

  // Chaos/assembly phase (raw telemetry before structure)
  chaosMode?: ChaosMode;
  chaosDuration?: number;
  dotsDuration?: number;

  // Flow phase
  flowDuration?: number;
  flowDelay?: number;
  particlesPerPath?: number;
  particleRadius?: number;

  // Styling
  color?: string;
  particleColor?: string;
  strokeWidth?: number;
  opacity?: number;
  showGlow?: boolean;
  fadeAfterAssembly?: boolean;
  fadeOpacity?: number;

  // Playback
  loop?: boolean;
  loopDelay?: number;
}

/**
 * Estimates path length from SVG path data.
 */
function estimatePathLength(d: string): number {
  const coords = d.match(/-?\d+\.?\d*/g);
  if (!coords || coords.length < 4) return 100;

  let totalLength = 0;
  for (let i = 2; i < coords.length; i += 2) {
    const x1 = parseFloat(coords[i - 2]);
    const y1 = parseFloat(coords[i - 1]);
    const x2 = parseFloat(coords[i]);
    const y2 = parseFloat(coords[i + 1]);
    totalLength += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }

  return totalLength || 100;
}

/**
 * Parse start and end points from path data
 */
function getPathEndpoints(d: string): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const coords = d.match(/-?\d+\.?\d*/g);
  if (!coords || coords.length < 4) {
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
  }
  return {
    start: { x: parseFloat(coords[0]), y: parseFloat(coords[1]) },
    end: { x: parseFloat(coords[coords.length - 2]), y: parseFloat(coords[coords.length - 1]) },
  };
}

/**
 * Seeded random for consistent chaos patterns
 */
function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  width = 400,
  height = 100,
  scale = 1,
  letterSpacing = 4,
  centerText = true,
  chaosMode = "none",
  chaosDuration = 2,
  dotsDuration = 1.5,
  flowDuration = 2,
  flowDelay = 0.3,
  particlesPerPath = 1,
  particleRadius = 2.5,
  color = "currentColor",
  particleColor,
  strokeWidth = 2,
  opacity = 0.9,
  showGlow = true,
  fadeAfterAssembly = true,
  fadeOpacity = 0.5,
  loop = true,
  loopDelay = 1,
}) => {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `txr${globalIdCounter++}`;
  }
  const uniqueId = idRef.current;
  const finalParticleColor = particleColor || color;
  const isFragmented = chaosMode === "fragmented";

  // Loop via remount
  const [cycle, setCycle] = useState(0);

  // Layout the text into paths
  const { paths: layoutPaths, width: textWidth, height: textHeight } = useMemo(() => {
    return layoutText(text, { letterSpacing, scale });
  }, [text, letterSpacing, scale]);

  // Calculate centering offset
  const offsetX = centerText ? (width - textWidth) / 2 : 0;
  const offsetY = centerText ? (height - textHeight) / 2 : 0;

  // Apply offset to paths
  const resolvedPaths = useMemo(() => {
    return layoutPaths.map((path) => ({
      ...path,
      d: offsetPath(path.d, offsetX, offsetY),
    }));
  }, [layoutPaths, offsetX, offsetY]);

  // Calculate path data
  const pathData = useMemo(() => {
    return resolvedPaths.map((p) => ({
      length: estimatePathLength(p.d),
      endpoints: getPathEndpoints(p.d),
    }));
  }, [resolvedPaths]);

  // Generate offsets for fragmented mode
  const fragmentOffsets = useMemo(() => {
    const random = seededRandom(42);
    return resolvedPaths.map(() => ({
      x: (random() - 0.5) * 120,
      y: (random() - 0.5) * 80,
    }));
  }, [resolvedPaths]);

  // Timing calculations
  const numPaths = resolvedPaths.length || 1;
  const perItemDotsDuration = (dotsDuration * 0.5) / numPaths;
  const perItemLinesDuration = (dotsDuration * 0.5) / numPaths;
  const perItemAssemblyDuration = chaosDuration / numPaths;

  const dotsPhaseEnd = dotsDuration * 0.5;
  const linesPhaseEnd = dotsDuration;
  const assemblyEndTime = isFragmented ? dotsDuration + chaosDuration : 0;
  const flowBeginTime = assemblyEndTime + flowDelay;

  // Total animation duration
  const totalDuration = flowBeginTime + flowDuration;

  // Remount-based loop
  useEffect(() => {
    if (!loop) return;
    const timeout = setTimeout(() => {
      setCycle((c) => c + 1);
    }, (totalDuration + loopDelay) * 1000);
    return () => clearTimeout(timeout);
  }, [loop, totalDuration, loopDelay, cycle]);

  // Calculate viewBox to fit content
  const viewBox = `0 0 ${width} ${height}`;

  return (
    <svg
      key={cycle}
      width={width}
      height={height}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        {/* Glow filter for particles */}
        {showGlow && (
          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        {/* Particle radial gradient */}
        <radialGradient
          id={`particleGradient-${uniqueId}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop
            offset="0%"
            style={{ stopColor: finalParticleColor, stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: finalParticleColor, stopOpacity: 0.3 }}
          />
        </radialGradient>
      </defs>

      {/* Paths layer */}
      <g className="text-paths">
        {resolvedPaths.map((path, index) => {
          const offset = fragmentOffsets[index];
          const { length: pathLength, endpoints } = pathData[index] || {
            length: 100,
            endpoints: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } },
          };
          const dotRadius = strokeWidth / 2;

          return (
            <g
              key={path.id}
              transform={isFragmented ? `translate(${offset.x}, ${offset.y})` : undefined}
            >
              {/* Endpoint dots - appear first in fragmented mode */}
              {isFragmented && (
                <>
                  <circle
                    cx={endpoints.start.x}
                    cy={endpoints.start.y}
                    r={dotRadius}
                    fill={color}
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.15s"
                      begin={`${index * perItemDotsDuration}s`}
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0"
                      dur="0.2s"
                      begin={`${dotsPhaseEnd + (index + 1) * perItemLinesDuration}s`}
                      fill="freeze"
                    />
                  </circle>
                  <circle
                    cx={endpoints.end.x}
                    cy={endpoints.end.y}
                    r={dotRadius}
                    fill={color}
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.15s"
                      begin={`${index * perItemDotsDuration}s`}
                      fill="freeze"
                    />
                    <animate
                      attributeName="opacity"
                      from="1"
                      to="0"
                      dur="0.2s"
                      begin={`${dotsPhaseEnd + (index + 1) * perItemLinesDuration}s`}
                      fill="freeze"
                    />
                  </circle>
                </>
              )}

              {/* The path/line */}
              <path
                d={path.d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isFragmented ? 0 : 1}
                strokeDasharray={isFragmented ? pathLength : undefined}
                strokeDashoffset={isFragmented ? pathLength : undefined}
              >
                {isFragmented && (
                  <>
                    <animate
                      attributeName="opacity"
                      values={`0;1;1;${fadeAfterAssembly ? fadeOpacity : 1}`}
                      keyTimes="0;0.1;0.9;1"
                      dur={`${perItemLinesDuration + chaosDuration}s`}
                      begin={`${dotsPhaseEnd + index * perItemLinesDuration}s`}
                      fill="freeze"
                    />
                    <animate
                      attributeName="stroke-dashoffset"
                      from={pathLength}
                      to="0"
                      dur={`${perItemLinesDuration}s`}
                      begin={`${dotsPhaseEnd + index * perItemLinesDuration}s`}
                      fill="freeze"
                      calcMode="spline"
                      keySplines="0.4 0 0.2 1"
                      keyTimes="0;1"
                    />
                  </>
                )}
                {!isFragmented && fadeAfterAssembly && (
                  <animate
                    attributeName="opacity"
                    from="1"
                    to={fadeOpacity}
                    dur="0.5s"
                    begin={`${flowBeginTime}s`}
                    fill="freeze"
                  />
                )}
              </path>

              {/* Assembly animation - move to final position */}
              {isFragmented && (
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`${offset.x} ${offset.y}`}
                  to="0 0"
                  dur={`${perItemAssemblyDuration}s`}
                  begin={`${linesPhaseEnd + index * perItemAssemblyDuration}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.33 0 0.2 1"
                  keyTimes="0;1"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* Flow layer - particles */}
      <g
        className="text-particles"
        filter={showGlow ? `url(#glow-${uniqueId})` : undefined}
      >
        {resolvedPaths.flatMap((path, pathIndex) => {
          return Array.from({ length: particlesPerPath }).map((_, particleIndex) => {
            const particleDelay = (particleIndex / particlesPerPath) * flowDuration;
            const beginTime = flowBeginTime + particleDelay;

            return (
              <circle
                key={`particle-${pathIndex}-${particleIndex}`}
                r={particleRadius}
                fill={`url(#particleGradient-${uniqueId})`}
                opacity="0"
              >
                <animateMotion
                  dur={`${flowDuration}s`}
                  begin={`${beginTime}s`}
                  fill="freeze"
                  path={path.d}
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${flowDuration}s`}
                  begin={`${beginTime}s`}
                  fill="freeze"
                />
              </circle>
            );
          });
        })}
      </g>
    </svg>
  );
};

/**
 * Offset all coordinates in a path by the given amounts
 */
function offsetPath(d: string, offsetX: number, offsetY: number): string {
  let coordIndex = 0;
  return d.replace(/-?\d+\.?\d*/g, (match) => {
    const num = parseFloat(match);
    const isY = coordIndex % 2 === 1;
    coordIndex++;
    if (isY) {
      return String(num + offsetY);
    } else {
      return String(num + offsetX);
    }
  });
}
