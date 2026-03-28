import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  particleColor?: string;
  opacity?: number;
  /** Color for horizontal latitude lines (defaults to color) */
  horizontalColor?: string;
  /** Color for vertical longitude lines (defaults to color) */
  verticalColor?: string;
  /** Color for diagonal grid lines (defaults to color) */
  diagonalColor?: string;
  /** Color for the main sphere outline (defaults to color) */
  outlineColor?: string;
  /** Whether to show the main sphere outline */
  showOutline?: boolean;
  /** Color for center axis lines (defaults to color) */
  axisColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 150,
  height = 150,
  color = "currentColor",
  particleColor,
  opacity = 0.9,
  horizontalColor,
  verticalColor,
  diagonalColor,
  outlineColor,
  showOutline = true,
  axisColor,
}) => {
  const finalParticleColor = particleColor || color;
  const finalHorizontalColor = horizontalColor || color;
  const finalVerticalColor = verticalColor || color;
  const finalDiagonalColor = diagonalColor || color;
  const finalOutlineColor = outlineColor || color;
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
      <circle cx="100" cy="100" r="80" fill="url(#sphereGlow)" opacity="0.5" />

      {/* Particles behind the wireframe (back of sphere) */}
      {/* These appear first in SVG order, so they render behind the lines */}

      {/* Horizontal ellipses - back portions */}
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 0,0 A 67,27 0 1,0 -134,0 A 67,27 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3s" path="M 0,0 A 67,53 0 1,0 -134,0 A 67,53 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="3s" repeatCount="indefinite" />
      </circle>

      {/* Vertical ellipses - back portions */}
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1.5s" path="M 0,0 A 27,67 0 1,0 0,-134 A 27,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 0,0 A 53,67 0 1,0 0,-134 A 53,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>

      {/* "P" made of dots at center - vertical stem */}
      <circle cx="93" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="90" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="95" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="105" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="110" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="115" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* "P" top horizontal */}
      <circle cx="98" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="103" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* "P" bowl - right side */}
      <circle cx="108" cy="90" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="108" cy="95" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* "P" bowl - middle horizontal */}
      <circle cx="103" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="98" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* Main sphere outline */}
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
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="53"
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
      <ellipse
        cx="100"
        cy="100"
        rx="53"
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


      {/* Particles in front of the wireframe (front of sphere) */}
      {/* These appear last in SVG order, so they render on top of the lines */}

      {/* Horizontal ellipses - front portions */}
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 0,0 A 67,27 0 1,0 -134,0 A 67,27 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3s" path="M 0,0 A 67,53 0 1,0 -134,0 A 67,53 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="3s" repeatCount="indefinite" />
      </circle>

      {/* Vertical ellipses - front portions */}
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1.5s" path="M 0,0 A 27,67 0 1,0 0,-134 A 27,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 0,0 A 53,67 0 1,0 0,-134 A 53,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};
