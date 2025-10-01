import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  color?: string;
  particleColor?: string;
  opacity?: number;
}

export const Logo: React.FC<LogoProps> = ({
  width = 150,
  height = 150,
  color = "currentColor",
  particleColor,
  opacity = 0.9,
}) => {
  const finalParticleColor = particleColor || color;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
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

      {/* Animated particles traveling along the wireframe lines */}

      {/* Horizontal center line */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="4s" repeatCount="indefinite" path="M 33,100 L 167,100" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="4s" repeatCount="indefinite" />
      </circle>

      {/* Horizontal latitude ellipses - full circles */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="0s" path="M 33,100 A 67,13 0 0,0 167,100 A 67,13 0 0,0 33,100" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="0s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 33,100 A 67,27 0 0,0 167,100 A 67,27 0 0,0 33,100" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="2s" path="M 33,100 A 67,40 0 0,0 167,100 A 67,40 0 0,0 33,100" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="3s" path="M 33,100 A 67,53 0 0,0 167,100 A 67,53 0 0,0 33,100" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="3s" repeatCount="indefinite" />
      </circle>

      {/* Vertical longitude ellipses - full circles */}
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="0.5s" path="M 100,33 A 13,67 0 0,0 100,167 A 13,67 0 0,0 100,33" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="0.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="1.5s" path="M 100,33 A 27,67 0 0,0 100,167 A 27,67 0 0,0 100,33" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="1.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="2.5s" path="M 100,33 A 40,67 0 0,0 100,167 A 40,67 0 0,0 100,33" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="2.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor}>
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 100,33 A 53,67 0 0,0 100,167 A 53,67 0 0,0 100,33" />
        <animate attributeName="opacity" values="0;1;1;1;0" keyTimes="0;0.1;0.9;0.95;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>

      {/* Center pulse triggered by particles */}
      <circle cx="100" cy="100" r="13" fill="url(#centerPulse)" opacity="0.3">
        <animate
          attributeName="r"
          values="3;17;3"
          dur="2s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.6;0;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main sphere outline */}
      <circle
        cx="100"
        cy="100"
        r="67"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.9"
      />

      {/* Horizontal latitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="13"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="27"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="40"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="53"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Vertical longitude lines */}
      <ellipse
        cx="100"
        cy="100"
        rx="13"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="27"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="40"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="53"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* Diagonal grid lines (angled ellipses) */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="33"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(30 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="33"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(60 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="33"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(120 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="33"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.6"
        transform="rotate(150 100 100)"
      />

      {/* Center horizontal line */}
      <line
        x1="33"
        y1="100"
        x2="167"
        y2="100"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Center vertical line */}
      <ellipse
        cx="100"
        cy="100"
        rx="0.5"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
};
