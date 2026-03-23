import React, { useMemo, useRef, useState, useEffect } from "react";
import opentype from "opentype.js";

let globalIdCounter = 0;

type ChaosMode = "none" | "fragmented";

interface OpenTypeTextRevealProps {
  /** The text to display */
  text: string;
  /** URL or path to the font file (.otf, .ttf, .woff) */
  fontUrl: string;
  /** Font size in pixels */
  fontSize?: number;

  /** Width of the SVG container */
  width?: number;
  /** Height of the SVG container */
  height?: number;
  /** Center the text in the container */
  centerText?: boolean;

  // Chaos/assembly phase
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

interface PathInfo {
  d: string;
  id: string;
  length: number;
  endpoints: { start: { x: number; y: number }; end: { x: number; y: number } };
}

/**
 * Estimates path length from SVG path data including curves.
 */
function estimatePathLength(d: string): number {
  // Simple estimation - count segments and approximate
  const commands = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  let length = 0;
  let lastX = 0, lastY = 0;
  let startX = 0, startY = 0;

  for (const cmd of commands) {
    const type = cmd[0].toUpperCase();
    const nums = cmd.slice(1).match(/-?\d+\.?\d*/g)?.map(Number) || [];

    switch (type) {
      case 'M':
        lastX = nums[0] || 0;
        lastY = nums[1] || 0;
        startX = lastX;
        startY = lastY;
        break;
      case 'L':
        if (nums.length >= 2) {
          length += Math.sqrt((nums[0] - lastX) ** 2 + (nums[1] - lastY) ** 2);
          lastX = nums[0];
          lastY = nums[1];
        }
        break;
      case 'H':
        if (nums.length >= 1) {
          length += Math.abs(nums[0] - lastX);
          lastX = nums[0];
        }
        break;
      case 'V':
        if (nums.length >= 1) {
          length += Math.abs(nums[0] - lastY);
          lastY = nums[0];
        }
        break;
      case 'C':
        // Cubic bezier - approximate with chord length * 1.5
        if (nums.length >= 6) {
          const dx = nums[4] - lastX;
          const dy = nums[5] - lastY;
          length += Math.sqrt(dx * dx + dy * dy) * 1.5;
          lastX = nums[4];
          lastY = nums[5];
        }
        break;
      case 'Q':
        // Quadratic bezier - approximate with chord length * 1.3
        if (nums.length >= 4) {
          const dx = nums[2] - lastX;
          const dy = nums[3] - lastY;
          length += Math.sqrt(dx * dx + dy * dy) * 1.3;
          lastX = nums[2];
          lastY = nums[3];
        }
        break;
      case 'Z':
        length += Math.sqrt((startX - lastX) ** 2 + (startY - lastY) ** 2);
        lastX = startX;
        lastY = startY;
        break;
    }
  }

  return length || 100;
}

/**
 * Get start and end points from path
 */
function getPathEndpoints(d: string): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const coords = d.match(/-?\d+\.?\d*/g);
  if (!coords || coords.length < 2) {
    return { start: { x: 0, y: 0 }, end: { x: 0, y: 0 } };
  }

  // Start is first two coords (after M)
  const start = { x: parseFloat(coords[0]), y: parseFloat(coords[1]) };

  // End is last two coords before Z (or just last two)
  const end = {
    x: parseFloat(coords[coords.length - 2]),
    y: parseFloat(coords[coords.length - 1])
  };

  return { start, end };
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

/**
 * Split compound path into individual contours
 */
function splitPathIntoContours(d: string): string[] {
  const contours: string[] = [];
  const parts = d.split(/(?=[Mm])/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed) {
      contours.push(trimmed);
    }
  }

  return contours;
}

export const OpenTypeTextReveal: React.FC<OpenTypeTextRevealProps> = ({
  text,
  fontUrl,
  fontSize = 72,
  width = 600,
  height = 150,
  centerText = true,
  chaosMode = "none",
  chaosDuration = 2,
  dotsDuration = 1.5,
  flowDuration = 2,
  flowDelay = 0.3,
  particlesPerPath = 1,
  particleRadius = 2,
  color = "currentColor",
  particleColor,
  strokeWidth = 1.5,
  opacity = 0.9,
  showGlow = true,
  fadeAfterAssembly = true,
  fadeOpacity = 0.5,
  loop = true,
  loopDelay = 1,
}) => {
  const idRef = useRef<string | null>(null);
  if (idRef.current === null) {
    idRef.current = `otr${globalIdCounter++}`;
  }
  const uniqueId = idRef.current;
  const finalParticleColor = particleColor || color;
  const isFragmented = chaosMode === "fragmented";

  // Font and path state
  const [font, setFont] = useState<opentype.Font | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cycle, setCycle] = useState(0);

  // Load font
  useEffect(() => {
    let cancelled = false;

    opentype.load(fontUrl)
      .then((loadedFont) => {
        if (!cancelled) {
          setFont(loadedFont);
          setError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || "Failed to load font");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fontUrl]);

  // Generate paths from font
  const { paths, textWidth, textHeight } = useMemo(() => {
    if (!font) {
      return { paths: [] as PathInfo[], textWidth: 0, textHeight: fontSize };
    }

    // Get the path for the text
    const textPath = font.getPath(text, 0, fontSize, fontSize);
    const pathData = textPath.toPathData(2); // 2 decimal places

    // Split into individual contours (each letter shape)
    const contours = splitPathIntoContours(pathData);

    const pathInfos: PathInfo[] = contours.map((d, index) => ({
      d,
      id: `contour-${index}`,
      length: estimatePathLength(d),
      endpoints: getPathEndpoints(d),
    }));

    // Calculate bounds
    const bbox = textPath.getBoundingBox();

    return {
      paths: pathInfos,
      textWidth: bbox.x2 - bbox.x1,
      textHeight: bbox.y2 - bbox.y1,
    };
  }, [font, text, fontSize]);

  // Calculate centering offset
  const offsetX = centerText ? (width - textWidth) / 2 : 0;
  const offsetY = centerText ? (height - textHeight) / 2 - (fontSize * 0.2) : 0;

  // Apply offset to paths
  const resolvedPaths = useMemo(() => {
    return paths.map((path) => ({
      ...path,
      d: offsetPathData(path.d, offsetX, offsetY),
      endpoints: {
        start: { x: path.endpoints.start.x + offsetX, y: path.endpoints.start.y + offsetY },
        end: { x: path.endpoints.end.x + offsetX, y: path.endpoints.end.y + offsetY },
      },
    }));
  }, [paths, offsetX, offsetY]);

  // Generate fragment offsets
  const fragmentOffsets = useMemo(() => {
    const random = seededRandom(42);
    return resolvedPaths.map(() => ({
      x: (random() - 0.5) * 150,
      y: (random() - 0.5) * 100,
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
  const totalDuration = flowBeginTime + flowDuration;

  // Loop via remount
  useEffect(() => {
    if (!loop) return;
    const timeout = setTimeout(() => {
      setCycle((c) => c + 1);
    }, (totalDuration + loopDelay) * 1000);
    return () => clearTimeout(timeout);
  }, [loop, totalDuration, loopDelay, cycle]);

  if (error) {
    return (
      <svg width={width} height={height}>
        <text x={10} y={30} fill="red" fontSize={14}>
          Error: {error}
        </text>
      </svg>
    );
  }

  if (!font) {
    return (
      <svg width={width} height={height}>
        <text x={10} y={30} fill={color} fontSize={14}>
          Loading font...
        </text>
      </svg>
    );
  }

  return (
    <svg
      key={cycle}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        {showGlow && (
          <filter id={`glow-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}

        <radialGradient
          id={`particleGradient-${uniqueId}`}
          cx="50%"
          cy="50%"
          r="50%"
        >
          <stop offset="0%" style={{ stopColor: finalParticleColor, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: finalParticleColor, stopOpacity: 0.3 }} />
        </radialGradient>
      </defs>

      {/* Paths layer */}
      <g className="opentype-paths">
        {resolvedPaths.map((path, index) => {
          const offset = fragmentOffsets[index];
          const dotRadius = strokeWidth / 2;

          return (
            <g
              key={path.id}
              transform={isFragmented ? `translate(${offset.x}, ${offset.y})` : undefined}
            >
              {/* Endpoint dots for fragmented mode */}
              {isFragmented && (
                <>
                  <circle
                    cx={path.endpoints.start.x}
                    cy={path.endpoints.start.y}
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

              {/* The path */}
              <path
                d={path.d}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={isFragmented ? 0 : 1}
                strokeDasharray={isFragmented ? path.length : undefined}
                strokeDashoffset={isFragmented ? path.length : undefined}
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
                      from={path.length}
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

              {/* Assembly animation */}
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
        className="opentype-particles"
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
 * Offset all coordinates in path data
 */
function offsetPathData(d: string, offsetX: number, offsetY: number): string {
  let result = "";
  let i = 0;
  let coordIndex = 0;

  while (i < d.length) {
    const char = d[i];

    // Check for command letters
    if (/[MmLlHhVvCcSsQqTtAaZz]/.test(char)) {
      result += char;

      // Reset coord tracking for absolute commands, or handle relative
      if (char === 'Z' || char === 'z') {
        coordIndex = 0;
      } else if (char === 'H' || char === 'h') {
        // Horizontal - only X coords
        coordIndex = -1; // Special handling
      } else if (char === 'V' || char === 'v') {
        // Vertical - only Y coords
        coordIndex = -2; // Special handling
      } else {
        coordIndex = 0;
      }
      i++;
    } else if (/[-\d.]/.test(char)) {
      // Parse number
      let numStr = "";
      while (i < d.length && /[-\d.eE]/.test(d[i])) {
        numStr += d[i];
        i++;
      }

      const num = parseFloat(numStr);

      // Apply offset based on coordinate type
      if (coordIndex === -1) {
        // H command - X only
        result += String(num + offsetX);
      } else if (coordIndex === -2) {
        // V command - Y only
        result += String(num + offsetY);
      } else if (coordIndex % 2 === 0) {
        // X coordinate
        result += String(num + offsetX);
      } else {
        // Y coordinate
        result += String(num + offsetY);
      }

      if (coordIndex >= 0) coordIndex++;
    } else {
      // Whitespace or comma
      result += char;
      i++;
    }
  }

  return result;
}
