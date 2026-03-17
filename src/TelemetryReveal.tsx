import React, { useMemo, useRef, useState, useEffect } from "react";
import { TELEMETRY_PRESETS, PathDefinition } from "./presets";

let globalIdCounter = 0;

type ChaosMode = "none" | "fragmented";

interface TelemetryRevealProps {
  width?: number;
  height?: number;
  paths?: PathDefinition[];
  preset?: "network" | "tree" | "circuit" | "hexagon" | "codebase";
  viewBox?: string;

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
 * Estimates path length from simple SVG path data (M/L commands).
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
 * Parse start and end points from path data (M x1,y1 L x2,y2)
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

export const TelemetryReveal: React.FC<TelemetryRevealProps> = ({
  width = 200,
  height = 200,
  paths: customPaths,
  preset = "network",
  viewBox,
  chaosMode = "none",
  chaosDuration = 3,
  dotsDuration = 2,
  flowDuration = 2,
  flowDelay = 0.3,
  particlesPerPath = 2,
  particleRadius = 3,
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
    idRef.current = `tr${globalIdCounter++}`;
  }
  const uniqueId = idRef.current;
  const finalParticleColor = particleColor || color;
  const isFragmented = chaosMode === "fragmented";

  // Loop via remount
  const [cycle, setCycle] = useState(0);

  // Resolve paths from custom or preset
  const resolvedPaths = useMemo(() => {
    if (customPaths) return customPaths;
    const presetConfig = TELEMETRY_PRESETS[preset];
    return presetConfig?.paths || [];
  }, [customPaths, preset]);

  // Resolve viewBox
  const resolvedViewBox = useMemo(() => {
    if (viewBox) return viewBox;
    if (!customPaths && TELEMETRY_PRESETS[preset]?.viewBox) {
      return TELEMETRY_PRESETS[preset].viewBox;
    }
    return "0 0 200 200";
  }, [viewBox, customPaths, preset]);

  // Calculate path lengths and endpoints
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
      x: (random() - 0.5) * 80,
      y: (random() - 0.5) * 80,
    }));
  }, [resolvedPaths]);

  // Timing calculations
  // In fragmented mode: dots appear, extend to lines, then assemble
  // Phase 1: Dots appear one at a time (dotsDuration / 2)
  // Phase 2: Lines draw one at a time (dotsDuration / 2)
  // Phase 3: Lines move to final position one at a time (chaosDuration)
  // Phase 4: Particles flow
  const numPaths = resolvedPaths.length || 1;
  const perItemDotsDuration = (dotsDuration * 0.5) / numPaths;
  const perItemLinesDuration = (dotsDuration * 0.5) / numPaths;
  const perItemAssemblyDuration = chaosDuration / numPaths;

  const dotsPhaseEnd = dotsDuration * 0.5;
  const linesPhaseEnd = dotsDuration;
  const assemblyEndTime = isFragmented ? dotsDuration + chaosDuration : 0;
  const flowBeginTime = assemblyEndTime + flowDelay;

  // Total animation duration (last particle finishes at flowBeginTime + flowDuration)
  const totalDuration = flowBeginTime + flowDuration;

  // Remount-based loop
  useEffect(() => {
    if (!loop) return;
    const timeout = setTimeout(() => {
      setCycle((c) => c + 1);
    }, (totalDuration + loopDelay) * 1000);
    return () => clearTimeout(timeout);
  }, [loop, totalDuration, loopDelay, cycle]);

  return (
    <svg
      key={cycle}
      width={width}
      height={height}
      viewBox={resolvedViewBox}
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

      {/* Paths layer - unified for both modes */}
      <g className="telemetry-paths">
        {resolvedPaths.map((path, index) => {
          const offset = fragmentOffsets[index];
          const { length: pathLength, endpoints } = pathData[index] || { length: 100, endpoints: { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } } };
          const dotRadius = strokeWidth / 2;

          return (
            <g
              key={path.id || `path-${index}`}
              transform={isFragmented ? `translate(${offset.x}, ${offset.y})` : undefined}
            >
              {/* Endpoint dots - appear first, stay until line is drawn */}
              {isFragmented && (
                <>
                  {/* Start dot */}
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
                  {/* End dot */}
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
                {/* In fragmented mode: lines draw AFTER all dots appear (sequential) */}
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
                {/* In none mode: just apply fade if needed */}
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

              {/* Assembly animation - move entire group to final position (sequential) */}
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

      {/* Flow layer - particles with animateMotion */}
      <g
        className="telemetry-particles"
        filter={showGlow ? `url(#glow-${uniqueId})` : undefined}
      >
        {resolvedPaths.flatMap((path, pathIndex) => {
          return Array.from({ length: particlesPerPath }).map(
            (_, particleIndex) => {
              const particleDelay =
                (particleIndex / particlesPerPath) * flowDuration;
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
            }
          );
        })}
      </g>
    </svg>
  );
};
