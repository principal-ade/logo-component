import React, { useMemo, useRef, useState, useEffect } from "react";
import opentype from "opentype.js";

let globalIdCounter = 0;

type ChaosMode = "none" | "fragmented";
type ChartPattern = "latency" | "cpu" | "noise";
type DotDistribution = "even" | "endpoints" | "random";

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

  // Chart intro phase (time-series visualization)
  /** Show time-series chart intro animation (default: true when chaosMode="fragmented") */
  showChartIntro?: boolean;
  /** Duration the chart is visible before lines fade (default: 1.5s) */
  chartDuration?: number;
  /** Duration for chart lines to fade out (default: 0.5s) */
  chartLineFadeDuration?: number;
  /** Pause duration after lines fade, before dots move (default: 0.3s) */
  chartPauseDuration?: number;
  /** Duration for dots to animate from chart to target positions (default: 0.8s) */
  chartTransitionDuration?: number;
  /** Telemetry pattern style for the chart */
  chartPattern?: ChartPattern;

  // Dot distribution
  /** Pixels of path length per dot (lower = more dots). Default: 30 */
  dotsPerPathUnit?: number;
  /** Minimum dots per contour. Default: 1 */
  minDotsPerContour?: number;
  /** Maximum dots per contour (0 = unlimited). Default: 0 */
  maxDotsPerContour?: number;
  /** How dots are distributed along each contour. Default: "even" */
  dotDistribution?: DotDistribution;

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
  /** Colors for each word (space-separated). Falls back to `color` if not specified. */
  wordColors?: string[];
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
  wordIndex: number;
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
 * Generate time-series chart positions for dots
 */
function generateChartPositions(
  numDots: number,
  width: number,
  height: number,
  pattern: ChartPattern,
  seed: number
): Array<{ x: number; y: number }> {
  if (numDots === 0) return [];

  const random = seededRandom(seed);
  const positions: Array<{ x: number; y: number }> = [];

  // Chart area with padding
  const padding = width * 0.1;
  const chartWidth = width - padding * 2;
  const chartHeight = height * 0.6;
  const chartTop = height * 0.2;

  // Generate y-values based on pattern
  const yValues: number[] = [];

  switch (pattern) {
    case "latency": {
      // Mostly stable baseline with occasional spikes
      const baseline = 0.3;
      const numSpikes = Math.max(1, Math.floor(numDots * 0.15)); // ~15% are spikes
      const spikeIndices = new Set<number>();

      // Pick random spike positions
      while (spikeIndices.size < numSpikes) {
        spikeIndices.add(Math.floor(random() * numDots));
      }

      for (let i = 0; i < numDots; i++) {
        if (spikeIndices.has(i)) {
          // Spike: 60-95% height
          yValues.push(0.6 + random() * 0.35);
        } else {
          // Baseline with small noise: 20-40%
          yValues.push(baseline + (random() - 0.5) * 0.2);
        }
      }
      break;
    }

    case "cpu": {
      // Sine wave foundation with noise - gradual rises and drops
      const frequency = 2 + random() * 2; // 2-4 cycles across the chart
      for (let i = 0; i < numDots; i++) {
        const t = i / (numDots - 1 || 1);
        const sine = Math.sin(t * Math.PI * frequency) * 0.3;
        const noise = (random() - 0.5) * 0.15;
        yValues.push(0.5 + sine + noise);
      }
      break;
    }

    case "noise":
    default: {
      // Irregular fluctuations using smoothed noise
      let value = 0.5;
      for (let i = 0; i < numDots; i++) {
        // Random walk with mean reversion
        const drift = (0.5 - value) * 0.1; // Pull toward center
        const noise = (random() - 0.5) * 0.25;
        value = Math.max(0.15, Math.min(0.85, value + drift + noise));
        yValues.push(value);
      }
      break;
    }
  }

  // Convert to positions
  for (let i = 0; i < numDots; i++) {
    const x = padding + (i / (numDots - 1 || 1)) * chartWidth;
    // Invert y since SVG y increases downward
    const y = chartTop + (1 - yValues[i]) * chartHeight;
    positions.push({ x, y });
  }

  return positions;
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

/**
 * Sample points along an SVG path using browser's native getPointAtLength
 */
function samplePointsAlongPath(
  d: string,
  numPoints: number,
  distribution: DotDistribution,
  seed: number
): Array<{ x: number; y: number }> {
  if (numPoints <= 0) return [];

  // SSR fallback: estimate points without DOM
  if (typeof document === 'undefined') {
    const endpoints = getPathEndpoints(d);
    const points: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < numPoints; i++) {
      const t = numPoints === 1 ? 0 : i / (numPoints - 1);
      points.push({
        x: endpoints.start.x + (endpoints.end.x - endpoints.start.x) * t,
        y: endpoints.start.y + (endpoints.end.y - endpoints.start.y) * t,
      });
    }
    return points;
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);

  const totalLength = path.getTotalLength();
  if (totalLength === 0) {
    const endpoints = getPathEndpoints(d);
    return [endpoints.start];
  }

  // Generate normalized positions (0-1) based on distribution
  const positions: number[] = [];

  switch (distribution) {
    case "even":
      for (let i = 0; i < numPoints; i++) {
        positions.push(numPoints === 1 ? 0 : i / (numPoints - 1));
      }
      break;

    case "endpoints":
      // Concentrate more points near 0 and 1
      for (let i = 0; i < numPoints; i++) {
        const t = numPoints === 1 ? 0 : i / (numPoints - 1);
        // Apply curve to cluster at ends: more samples near 0 and 1
        const weighted = t < 0.5
          ? 0.5 * Math.pow(2 * t, 0.5)
          : 1 - 0.5 * Math.pow(2 * (1 - t), 0.5);
        positions.push(weighted);
      }
      break;

    case "random": {
      const random = seededRandom(seed);
      for (let i = 0; i < numPoints; i++) {
        positions.push(random());
      }
      positions.sort((a, b) => a - b); // Sort for visual consistency
      break;
    }
  }

  // Convert positions to actual points
  const points: Array<{ x: number; y: number }> = [];
  for (const t of positions) {
    const point = path.getPointAtLength(t * totalLength);
    points.push({ x: point.x, y: point.y });
  }

  return points;
}

export const OpenTypeTextReveal: React.FC<OpenTypeTextRevealProps> = ({
  text,
  fontUrl,
  fontSize = 72,
  width = 600,
  height = 150,
  centerText = true,
  showChartIntro,
  chartDuration = 1.5,
  chartLineFadeDuration = 0.5,
  chartPauseDuration = 0.3,
  chartTransitionDuration = 0.8,
  chartPattern = "latency",
  dotsPerPathUnit = 30,
  minDotsPerContour = 1,
  maxDotsPerContour = 0,
  dotDistribution = "even",
  chaosMode = "none",
  chaosDuration = 2,
  dotsDuration = 1.5,
  flowDuration = 2,
  flowDelay = 0.3,
  particlesPerPath = 1,
  particleRadius = 2,
  color = "currentColor",
  wordColors,
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

  // Chart intro is on by default when fragmented mode is active
  const shouldShowChartIntro = showChartIntro ?? isFragmented;

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

  // Generate paths from font, tracking word indices
  const { paths, textWidth, textHeight, wordCount } = useMemo(() => {
    if (!font) {
      return { paths: [] as PathInfo[], textWidth: 0, textHeight: fontSize, wordCount: 0 };
    }

    // Split text into words and generate paths per word
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const pathInfos: PathInfo[] = [];
    let currentX = 0;
    let contourIndex = 0;

    // Track overall bounds
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

    words.forEach((word, wordIndex) => {
      // Get path for this word
      const wordPath = font.getPath(word, currentX, fontSize, fontSize);
      const pathData = wordPath.toPathData(2);
      const contours = splitPathIntoContours(pathData);

      // Add contours with word index
      contours.forEach((d) => {
        pathInfos.push({
          d,
          id: `contour-${contourIndex++}`,
          length: estimatePathLength(d),
          endpoints: getPathEndpoints(d),
          wordIndex,
        });
      });

      // Update bounds
      const bbox = wordPath.getBoundingBox();
      minX = Math.min(minX, bbox.x1);
      minY = Math.min(minY, bbox.y1);
      maxX = Math.max(maxX, bbox.x2);
      maxY = Math.max(maxY, bbox.y2);

      // Advance X position for next word (add space width)
      const spaceWidth = font.getAdvanceWidth(' ', fontSize);
      currentX = bbox.x2 + spaceWidth;
    });

    return {
      paths: pathInfos,
      textWidth: maxX - minX,
      textHeight: maxY - minY,
      wordCount: words.length,
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

  // Calculate dots per contour based on path length
  const dotsPerContour = useMemo(() => {
    return resolvedPaths.map(path => {
      const rawCount = Math.round(path.length / dotsPerPathUnit);
      const bounded = maxDotsPerContour > 0
        ? Math.min(rawCount, maxDotsPerContour)
        : rawCount;
      return Math.max(minDotsPerContour, bounded);
    });
  }, [resolvedPaths, dotsPerPathUnit, minDotsPerContour, maxDotsPerContour]);

  const totalDots = useMemo(() => {
    return dotsPerContour.reduce((a, b) => a + b, 0);
  }, [dotsPerContour]);

  // Count dots per word for chart generation
  const dotsPerWord = useMemo(() => {
    const counts: number[] = [];
    resolvedPaths.forEach((path, contourIndex) => {
      const wordIdx = path.wordIndex;
      while (counts.length <= wordIdx) counts.push(0);
      counts[wordIdx] += dotsPerContour[contourIndex];
    });
    return counts;
  }, [resolvedPaths, dotsPerContour]);

  // Generate chart positions per word - each word gets its own full-width line
  const chartPositions = useMemo(() => {
    if (!shouldShowChartIntro) return [];

    const allPositions: Array<{ x: number; y: number; wordIndex: number }> = [];

    dotsPerWord.forEach((numDots, wordIndex) => {
      if (numDots === 0) return;
      // Each word gets its own time-series spanning the full width
      // Use different seed per word for variation
      const wordPositions = generateChartPositions(numDots, width, height, chartPattern, 123 + wordIndex * 1000);
      wordPositions.forEach(pos => {
        allPositions.push({ ...pos, wordIndex });
      });
    });

    return allPositions;
  }, [shouldShowChartIntro, dotsPerWord, width, height, chartPattern]);

  // Target positions for dots after chart phase - sampled along each contour
  const dotTargetPositions = useMemo(() => {
    // Group by word first to match chart positions order
    const positionsByWord: Array<Array<{ x: number; y: number; contourIndex: number; wordIndex: number }>> = [];

    resolvedPaths.forEach((path, contourIndex) => {
      const wordIdx = path.wordIndex;
      while (positionsByWord.length <= wordIdx) positionsByWord.push([]);

      const numDots = dotsPerContour[contourIndex];
      const sampledPoints = samplePointsAlongPath(path.d, numDots, dotDistribution, contourIndex * 1000);
      sampledPoints.forEach(point => {
        positionsByWord[wordIdx].push({ ...point, contourIndex, wordIndex: wordIdx });
      });
    });

    // Flatten in word order to match chartPositions
    return positionsByWord.flat();
  }, [resolvedPaths, dotsPerContour, dotDistribution]);

  // Helper to get color for a word index
  const getWordColor = (wordIndex: number): string => {
    if (wordColors && wordColors.length > 0) {
      return wordColors[wordIndex % wordColors.length];
    }
    return color;
  };

  // Chart intro timing
  const chartPhaseEndTime = shouldShowChartIntro
    ? chartDuration + chartLineFadeDuration + chartPauseDuration + chartTransitionDuration
    : 0;

  // Timing calculations (offset by chart phase if present)
  const numPaths = resolvedPaths.length || 1;
  const perItemDotsDuration = (dotsDuration * 0.5) / numPaths;
  const perItemLinesDuration = (dotsDuration * 0.5) / numPaths;
  const perItemAssemblyDuration = chaosDuration / numPaths;

  const dotsPhaseEnd = chartPhaseEndTime + dotsDuration * 0.5;
  const linesPhaseEnd = chartPhaseEndTime + dotsDuration;
  // Skip assembly phase when chart intro handles the transition
  const needsAssembly = isFragmented && !shouldShowChartIntro;
  const assemblyEndTime = needsAssembly
    ? chartPhaseEndTime + dotsDuration + chaosDuration
    : chartPhaseEndTime + dotsDuration;
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
    return null;
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

      {/* Chart intro layer - time series visualization */}
      {shouldShowChartIntro && chartPositions.length > 0 && (
        <g className="chart-intro">
          {/* Connecting lines - one per word, each spanning full width */}
          {(() => {
            // Group chart positions by word (chartPositions now has wordIndex)
            const positionsByWord: Map<number, Array<{ x: number; y: number }>> = new Map();
            chartPositions.forEach((pos) => {
              if (!positionsByWord.has(pos.wordIndex)) {
                positionsByWord.set(pos.wordIndex, []);
              }
              positionsByWord.get(pos.wordIndex)!.push({ x: pos.x, y: pos.y });
            });

            return Array.from(positionsByWord.entries()).map(([wordIndex, positions]) => (
              <polyline
                key={`chart-line-${wordIndex}`}
                points={positions.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke={getWordColor(wordIndex)}
                strokeWidth={strokeWidth * 0.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0"
              >
                {/* Fade in */}
                <animate
                  attributeName="opacity"
                  from="0"
                  to="0.6"
                  dur="0.3s"
                  begin="0s"
                  fill="freeze"
                />
                {/* Fade out */}
                <animate
                  attributeName="opacity"
                  from="0.6"
                  to="0"
                  dur={`${chartLineFadeDuration}s`}
                  begin={`${chartDuration}s`}
                  fill="freeze"
                />
              </polyline>
            ));
          })()}

          {/* Chart dots that animate to target positions */}
          {chartPositions.map((chartPos, index) => {
            const targetPos = dotTargetPositions[index];
            if (!targetPos) return null;

            const dotRadius = strokeWidth;
            const dotAppearDelay = (index / chartPositions.length) * 0.5; // Stagger appearance
            const transitionBegin = chartDuration + chartLineFadeDuration + chartPauseDuration;
            // Fade out when this dot's contour starts drawing
            const contourDrawBegin = dotsPhaseEnd + (targetPos.contourIndex + 1) * perItemLinesDuration;
            const dotColor = getWordColor(chartPos.wordIndex);

            return (
              <circle
                key={`chart-dot-${index}`}
                cx={chartPos.x}
                cy={chartPos.y}
                r={dotRadius}
                fill={dotColor}
                opacity="0"
              >
                {/* Fade in with stagger */}
                <animate
                  attributeName="opacity"
                  from="0"
                  to="1"
                  dur="0.15s"
                  begin={`${dotAppearDelay}s`}
                  fill="freeze"
                />
                {/* Move to target position */}
                <animate
                  attributeName="cx"
                  from={chartPos.x}
                  to={targetPos.x}
                  dur={`${chartTransitionDuration}s`}
                  begin={`${transitionBegin}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                  keyTimes="0;1"
                />
                <animate
                  attributeName="cy"
                  from={chartPos.y}
                  to={targetPos.y}
                  dur={`${chartTransitionDuration}s`}
                  begin={`${transitionBegin}s`}
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                  keyTimes="0;1"
                />
                {/* Fade out when this contour's line starts drawing */}
                <animate
                  attributeName="opacity"
                  from="1"
                  to="0"
                  dur="0.2s"
                  begin={`${contourDrawBegin}s`}
                  fill="freeze"
                />
              </circle>
            );
          })}
        </g>
      )}

      {/* Paths layer */}
      <g className="opentype-paths">
        {resolvedPaths.map((path, index) => {
          const offset = fragmentOffsets[index];
          const dotRadius = strokeWidth / 2;
          const pathColor = getWordColor(path.wordIndex);

          // Skip fragment offset when chart intro handles the transition
          const useFragmentOffset = isFragmented && !shouldShowChartIntro;

          return (
            <g
              key={path.id}
              transform={useFragmentOffset ? `translate(${offset.x}, ${offset.y})` : undefined}
            >
              {/* Endpoint dots for fragmented mode (skip if chart intro handles this) */}
              {isFragmented && !shouldShowChartIntro && (
                <>
                  <circle
                    cx={path.endpoints.start.x}
                    cy={path.endpoints.start.y}
                    r={dotRadius}
                    fill={pathColor}
                    opacity="0"
                  >
                    <animate
                      attributeName="opacity"
                      from="0"
                      to="1"
                      dur="0.15s"
                      begin={`${chartPhaseEndTime + index * perItemDotsDuration}s`}
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
              {(() => {
                // Determine animation mode
                const shouldDrawLines = isFragmented || shouldShowChartIntro;
                const drawDuration = shouldShowChartIntro && !isFragmented
                  ? perItemLinesDuration
                  : perItemLinesDuration + chaosDuration;

                return (
                  <path
                    d={path.d}
                    fill="none"
                    stroke={pathColor}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={shouldDrawLines ? 0 : 1}
                    strokeDasharray={shouldDrawLines ? path.length : undefined}
                    strokeDashoffset={shouldDrawLines ? path.length : undefined}
                  >
                    {shouldDrawLines && (
                      <>
                        <animate
                          attributeName="opacity"
                          values={`0;1;1;${fadeAfterAssembly ? fadeOpacity : 1}`}
                          keyTimes="0;0.1;0.9;1"
                          dur={`${drawDuration}s`}
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
                    {!shouldDrawLines && fadeAfterAssembly && (
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
                );
              })()}

              {/* Assembly animation - only when fragmented WITHOUT chart intro */}
              {useFragmentOffset && (
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
