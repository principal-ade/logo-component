import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  /** Color for orbiting particles (defaults to color) */
  particleColor?: string;
  /** Color for the "P" letter in the center (defaults to particleColor, then color) */
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
  /** Use a text-based P instead of dots (defaults to false) */
  useTextLetter?: boolean;
  /** Font family for text-based P (defaults to Georgia) */
  letterFontFamily?: string;
  /** Background color for the SVG */
  backgroundColor?: string;
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
  useTextLetter = false,
  letterFontFamily = "Georgia, serif",
  backgroundColor,
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

      {/* Background */}
      {backgroundColor && (
        <rect x="30" y="30" width="140" height="140" fill={backgroundColor} />
      )}

      {/* Glow effect */}
      {showGlow && (
        <circle cx="100" cy="100" r="80" fill="url(#sphereGlow)" opacity="0.5" />
      )}

      {/* Crosshair lines from edge to ellipses */}
      {/* Top */}
      <line x1="100" y1="33" x2="100" y2="68" stroke={finalAxisColor} strokeWidth="1" opacity="0.7" />
      {/* Bottom */}
      <line x1="100" y1="167" x2="100" y2="132" stroke={finalAxisColor} strokeWidth="1" opacity="0.7" />
      {/* Left */}
      <line x1="33" y1="100" x2="68" y2="100" stroke={finalAxisColor} strokeWidth="1" opacity="0.7" />
      {/* Right */}
      <line x1="167" y1="100" x2="132" y2="100" stroke={finalAxisColor} strokeWidth="1" opacity="0.7" />

      {/* Horizontal latitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="32"
        fill="none"
        stroke={finalHorizontalColor}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Vertical longitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="32"
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
        ry="40"
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
        ry="40"
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
        ry="40"
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
        ry="40"
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

      {/* "P" letter at center */}
      {useTextLetter ? (
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dominantBaseline="central"
          fill={finalLetterColor}
          fontSize="48"
          fontFamily={letterFontFamily}
          fontWeight="bold"
          opacity="0.9"
        >
          P
        </text>
      ) : (
        <>
          {/* "P" made of dots - vertical stem */}
          <circle cx="90" cy="79" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="86" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="93" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="100" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="107" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="114" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="90" cy="121" r="2.5" fill={finalLetterColor} opacity="0.9" />

          {/* "P" top horizontal */}
          <circle cx="97" cy="79" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="104" cy="79" r="2.5" fill={finalLetterColor} opacity="0.9" />

          {/* "P" bowl - right side */}
          <circle cx="111" cy="86" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="111" cy="93" r="2.5" fill={finalLetterColor} opacity="0.9" />

          {/* "P" bowl - middle horizontal */}
          <circle cx="104" cy="100" r="2.5" fill={finalLetterColor} opacity="0.9" />
          <circle cx="97" cy="100" r="2.5" fill={finalLetterColor} opacity="0.9" />
        </>
      )}

      {/* Orbiting particles - rendered last so they appear on top */}
      {/* Particle on horizontal latitude ellipse - forward */}
      <circle r="2.5" fill={finalParticleColor} opacity="0.9">
        <animateMotion dur="8s" repeatCount="indefinite" path="M 167,100 A 67,32 0 0,1 33,100 A 67,32 0 0,1 167,100" />
      </circle>

      {/* Particle on vertical longitude ellipse - backward */}
      <circle r="2.5" fill={finalParticleColor} opacity="0.9">
        <animateMotion dur="8s" repeatCount="indefinite" path="M 100,33 A 32,67 0 0,0 100,167 A 32,67 0 0,0 100,33" />
      </circle>

      {/* Particle on diagonal ellipse (30°) - forward */}
      <g transform="rotate(30 100 100)">
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 167,100 A 67,40 0 0,1 33,100 A 67,40 0 0,1 167,100" />
        </circle>
      </g>

      {/* Particle on diagonal ellipse (60°) - backward */}
      <g transform="rotate(60 100 100)">
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 167,100 A 67,40 0 0,0 33,100 A 67,40 0 0,0 167,100" />
        </circle>
      </g>

      {/* Particle on diagonal ellipse (120°) - forward */}
      <g transform="rotate(120 100 100)">
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 167,100 A 67,40 0 0,1 33,100 A 67,40 0 0,1 167,100" />
        </circle>
      </g>

      {/* Particle on diagonal ellipse (150°) - backward */}
      <g transform="rotate(150 100 100)">
        <circle r="2.5" fill={finalParticleColor} opacity="0.9">
          <animateMotion dur="8s" repeatCount="indefinite" path="M 167,100 A 67,40 0 0,0 33,100 A 67,40 0 0,0 167,100" />
        </circle>
      </g>
    </svg>
  );
};
