import React from "react";

interface ForksLogoProps {
  width?: number;
  height?: number;
  color?: string;
  particleColor?: string;
  opacity?: number;
}

export const ForksLogo: React.FC<ForksLogoProps> = ({
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
        <radialGradient id="sphereGlowForks" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
        </radialGradient>

        {/* Animated pulse at center */}
        <radialGradient id="centerPulseForks" cx="50%" cy="50%" r="50%">
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
      <circle cx="100" cy="100" r="80" fill="url(#sphereGlowForks)" opacity="0.5" />

      {/* Particles behind the wireframe (back of sphere) */}
      {/* These appear first in SVG order, so they render behind the lines */}

      {/* Horizontal ellipses - back portions */}
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 0,0 A 67,27 0 1,0 -134,0 A 67,27 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="2s" path="M 0,0 A 67,40 0 1,0 -134,0 A 67,40 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="2s" repeatCount="indefinite" />
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
        <animateMotion dur="8s" repeatCount="indefinite" begin="2.5s" path="M 0,0 A 40,67 0 1,0 0,-134 A 40,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="2.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 0,0 A 53,67 0 1,0 0,-134 A 53,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;1;0.5;0;0" keyTimes="0;0.2;0.4;0.5;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>

      {/* "F" made of dots at center - vertical stem */}
      <circle cx="93" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="90" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="95" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="105" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="110" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="93" cy="115" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* "F" top horizontal bar */}
      <circle cx="98" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="103" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="108" cy="85" r="2" fill={finalParticleColor} opacity="0.9" />

      {/* "F" middle horizontal bar */}
      <circle cx="98" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />
      <circle cx="103" cy="100" r="2" fill={finalParticleColor} opacity="0.9" />

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
      {/* ry=13 ellipse - broken into left and right segments around F */}
      <path
        d="M 33,100 A 67,13 0 0,1 73,88.1"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 127,88.1 A 67,13 0 0,1 167,100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 33,100 A 67,13 0 0,0 73,111.9"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 127,111.9 A 67,13 0 0,0 167,100"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />

      {/* ry=27 ellipse - complete (has particle animation) */}
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
      {/* rx=13 ellipse - broken into top and bottom segments around F */}
      <path
        d="M 100,33 A 13,67 0 0,0 87,73"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 113,73 A 13,67 0 0,0 100,33"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 100,167 A 13,67 0 0,1 87,127"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      <path
        d="M 113,127 A 13,67 0 0,1 100,167"
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.7"
      />
      {/* rx=27 ellipse - complete (has particle animation) */}
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

      {/* Center horizontal line - broken into segments around F */}
      {/* Left segment: from sphere edge to intersection with rx=27 longitude line */}
      <line
        x1="33"
        y1="100"
        x2="73"
        y2="100"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Right segment: from intersection with rx=27 longitude line to sphere edge */}
      <line
        x1="127"
        y1="100"
        x2="167"
        y2="100"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Center vertical line - broken into segments around F */}
      {/* Top segment: from sphere edge to intersection with ry=27 latitude line */}
      <line
        x1="100"
        y1="33"
        x2="100"
        y2="73"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />
      {/* Bottom segment: from intersection with ry=27 latitude line to sphere edge */}
      <line
        x1="100"
        y1="127"
        x2="100"
        y2="167"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.8"
      />

      {/* Particles in front of the wireframe (front of sphere) */}
      {/* These appear last in SVG order, so they render on top of the lines */}

      {/* Horizontal ellipses - front portions */}
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="1s" path="M 0,0 A 67,27 0 1,0 -134,0 A 67,27 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="1s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="167" cy="100" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="2s" path="M 0,0 A 67,40 0 1,0 -134,0 A 67,40 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="2s" repeatCount="indefinite" />
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
        <animateMotion dur="8s" repeatCount="indefinite" begin="2.5s" path="M 0,0 A 40,67 0 1,0 0,-134 A 40,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="2.5s" repeatCount="indefinite" />
      </circle>
      <circle r="2.5" fill={finalParticleColor} cx="100" cy="167" opacity="0">
        <animateMotion dur="8s" repeatCount="indefinite" begin="3.5s" path="M 0,0 A 53,67 0 1,0 0,-134 A 53,67 0 1,0 0,0" />
        <animate attributeName="opacity" values="0;0;0.5;1;1;0.5;0" keyTimes="0;0.5;0.6;0.75;0.9;0.95;1" dur="8s" begin="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
};
