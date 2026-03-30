import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  /** Color for orbiting particles (defaults to color) */
  particleColor?: string;
  /** Color for the "P" letter dots in the center (defaults to particleColor, then color) */
  letterColor?: string;
  opacity?: number;
  /** Color for horizontal latitude lines (defaults to color) */
  horizontalColor?: string;
  /** Color for vertical longitude lines (defaults to color) */
  verticalColor?: string;
  /** Color for diagonal grid lines (defaults to color) */
  diagonalColor?: string;
  /** Color for the main sphere outline (defaults to accentColor, then color) */
  outlineColor?: string;
  /** Whether to show the main sphere outline */
  showOutline?: boolean;
  /** Color for center axis lines (defaults to color) */
  axisColor?: string;
  /** Whether to show the background glow effect */
  showGlow?: boolean;
  /** Accent color for the outer sphere outline (defaults to color) */
  accentColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 150,
  height = 150,
  color = "currentColor",
  particleColor,
  letterColor,
  opacity = 0.9,
  horizontalColor,
  verticalColor,
  diagonalColor,
  outlineColor,
  showOutline = true,
  axisColor,
  showGlow = false,
  accentColor,
}) => {
  const finalParticleColor = particleColor || color;
  const finalLetterColor = letterColor || particleColor || color;
  const finalHorizontalColor = horizontalColor || color;
  const finalVerticalColor = verticalColor || color;
  const finalDiagonalColor = diagonalColor || color;
  const finalOutlineColor = outlineColor || accentColor || color;
  const finalAxisColor = axisColor || color;
  return (
    <svg
      width={width}
      height={height}
      viewBox="30 30 140 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Wireframe sphere with grid lines */}
      <defs>
        <radialGradient id="sphereGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>

        {/* Animated pulse at center */}
        <radialGradient id="centerPulse" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.8 }}>
            <animate
              attributeName="stop-opacity"
              values="0.8;0.3;0.8"
              dur="2s"
              repeatCount="indefinite"
            />
          </stop>
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      {/* Glow effect */}
      {showGlow && (
        <circle cx="100" cy="100" r="80" fill="url(#sphereGlow)" opacity="0.5" />
      )}

      {/* "P" made of dots at center - vertical stem */}
      <circle cx="93" cy="85" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="90" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="95" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="100" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="105" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="110" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="93" cy="115" r="2" fill={finalLetterColor} opacity="0.9" />

      {/* "P" top horizontal */}
      <circle cx="98" cy="85" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="103" cy="85" r="2" fill={finalLetterColor} opacity="0.9" />

      {/* "P" bowl - right side */}
      <circle cx="108" cy="90" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="108" cy="95" r="2" fill={finalLetterColor} opacity="0.9" />

      {/* "P" bowl - middle horizontal */}
      <circle cx="103" cy="100" r="2" fill={finalLetterColor} opacity="0.9" />
      <circle cx="98" cy="100" r="2" fill={finalLetterColor} opacity="0.9" />

      {/* Horizontal latitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="27"
        fill="none"
        stroke={finalHorizontalColor}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Vertical longitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="27"
        ry="67"
        fill="none"
        stroke={finalVerticalColor}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Diagonal grid lines (angled ellipses) */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="35"
        fill="none"
        stroke={finalDiagonalColor}
        strokeWidth="1"
        opacity="0.7"
        transform="rotate(30 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="35"
        fill="none"
        stroke={finalDiagonalColor}
        strokeWidth="1"
        opacity="0.7"
        transform="rotate(60 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="35"
        fill="none"
        stroke={finalDiagonalColor}
        strokeWidth="1"
        opacity="0.7"
        transform="rotate(120 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="35"
        fill="none"
        stroke={finalDiagonalColor}
        strokeWidth="1"
        opacity="0.7"
        transform="rotate(150 100 100)"
      />

      {/* Main sphere outline - rendered after ellipses so it appears on top */}
      {showOutline && (
        <circle
          cx="100"
          cy="100"
          r="67"
          fill="none"
          stroke={finalOutlineColor}
          strokeWidth="1.5"
          opacity="0.9"
        />
      )}

      {/* Orbiting particles - rendered last so they appear on top */}
      <g transform="translate(100, 100)">
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 67,0 A 67,27 0 1,1 -67,0 A 67,27 0 1,1 67,0" />
        </circle>
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 0,-67 A 27,67 0 1,1 0,67 A 27,67 0 1,1 0,-67" />
        </circle>
      </g>
    </svg>
  );
};
