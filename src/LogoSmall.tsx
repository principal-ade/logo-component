import React from "react";

interface LogoSmallProps {
  width?: number;
  height?: number;
  color?: string;
  particleColor?: string;
  opacity?: number;
}

export const LogoSmall: React.FC<LogoSmallProps> = ({
  width = 32,
  height = 32,
  color = "currentColor",
  particleColor,
  opacity = 0.9,
}) => {
  const finalParticleColor = particleColor || color;
  return (
    <svg
      width={width}
      height={height}
      viewBox="30 30 140 140"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      {/* Main sphere outline */}
      <circle
        cx="100"
        cy="100"
        r="67"
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity="0.9"
      />

      {/* Simplified grid - horizontal and vertical ellipses */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="40"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="40"
        ry="67"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
      />

      {/* Diagonal ellipses in X pattern */}
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="40"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
        transform="rotate(45 100 100)"
      />
      <ellipse
        cx="100"
        cy="100"
        rx="67"
        ry="40"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.6"
        transform="rotate(-45 100 100)"
      />

      {/* Larger "P" made of dots at center - vertical stem */}
      <circle cx="90" cy="80" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="90" cy="88" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="90" cy="96" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="90" cy="104" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="90" cy="112" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="90" cy="120" r="3.5" fill={finalParticleColor} opacity="0.95" />

      {/* "P" top horizontal */}
      <circle cx="98" cy="80" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="106" cy="80" r="3.5" fill={finalParticleColor} opacity="0.95" />

      {/* "P" bowl - right side */}
      <circle cx="114" cy="88" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="114" cy="96" r="3.5" fill={finalParticleColor} opacity="0.95" />

      {/* "P" bowl - bottom horizontal */}
      <circle cx="106" cy="104" r="3.5" fill={finalParticleColor} opacity="0.95" />
      <circle cx="98" cy="104" r="3.5" fill={finalParticleColor} opacity="0.95" />
    </svg>
  );
};
