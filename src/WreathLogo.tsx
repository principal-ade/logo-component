import React from 'react';

interface WreathLogoProps {
  width?: number;
  height?: number;
  pColor?: string;
  wreathColor?: string;
  leafAccentColor?: string;
  opacity?: number;
  animationSpeed?: number;
}

export const WreathLogo: React.FC<WreathLogoProps> = ({
  width = 150,
  height = 150,
  pColor = '#2C3E50',
  wreathColor = '#27AE60',
  leafAccentColor = '#52BE80',
  opacity = 0.9,
  animationSpeed = 3,
}) => {
  const wreathRadius = 58;

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="wreathGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: wreathColor, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: wreathColor, stopOpacity: 0 }} />
        </radialGradient>

        <filter id="softGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <circle cx="100" cy="100" r="70" fill="url(#wreathGlow)" opacity="0.3" />

      {/* Smooth wavy circular wreath with ebbs and flows */}
      <path
        d={(() => {
          const numPoints = 24;
          const waveAmplitude = 2;
          let pathD = '';
          const points = [];

          // Generate all points first
          for (let i = 0; i <= numPoints; i++) {
            const angle = (360 / numPoints) * i;
            const radians = (angle * Math.PI) / 180;

            // Use sine wave for smooth variation
            const radiusVariation = Math.sin((angle * Math.PI) / 180 * 6) * waveAmplitude;
            const currentRadius = wreathRadius + radiusVariation;

            const x = 100 + currentRadius * Math.cos(radians);
            const y = 100 + currentRadius * Math.sin(radians);

            points.push({ x, y, angle, radians });
          }

          // Create smooth cubic bezier path with better control points
          pathD = `M ${points[0].x},${points[0].y}`;

          for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            // Calculate tangent for smooth curves
            const tangentLength = 0.4;
            const cp1x = current.x - Math.sin(current.radians) * tangentLength * 15;
            const cp1y = current.y + Math.cos(current.radians) * tangentLength * 15;
            const cp2x = next.x + Math.sin(next.radians) * tangentLength * 15;
            const cp2y = next.y - Math.cos(next.radians) * tangentLength * 15;

            pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
          }

          return pathD + ' Z';
        })()}
        fill="none"
        stroke={wreathColor}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
        filter="url(#softGlow)"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.65;0.85;0.65"
          dur={`${animationSpeed}s`}
          repeatCount="indefinite"
        />
      </path>

      {/* Inner smooth accent wavy circle */}
      <path
        d={(() => {
          const numPoints = 24;
          const waveAmplitude = 1.5;
          const innerRadius = wreathRadius - 9;
          let pathD = '';
          const points = [];

          for (let i = 0; i <= numPoints; i++) {
            const angle = (360 / numPoints) * i + 15; // Offset from main wreath
            const radians = (angle * Math.PI) / 180;

            // Use sine wave offset for smooth variation
            const radiusVariation = Math.sin(((angle + 30) * Math.PI) / 180 * 6) * waveAmplitude;
            const currentRadius = innerRadius + radiusVariation;

            const x = 100 + currentRadius * Math.cos(radians);
            const y = 100 + currentRadius * Math.sin(radians);

            points.push({ x, y, radians });
          }

          pathD = `M ${points[0].x},${points[0].y}`;

          for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];

            const tangentLength = 0.4;
            const cp1x = current.x - Math.sin(current.radians) * tangentLength * 15;
            const cp1y = current.y + Math.cos(current.radians) * tangentLength * 15;
            const cp2x = next.x + Math.sin(next.radians) * tangentLength * 15;
            const cp2y = next.y - Math.cos(next.radians) * tangentLength * 15;

            pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
          }

          return pathD + ' Z';
        })()}
        fill="none"
        stroke={leafAccentColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
        filter="url(#softGlow)"
      >
        <animate
          attributeName="stroke-opacity"
          values="0.5;0.7;0.5"
          dur={`${animationSpeed}s`}
          repeatCount="indefinite"
          begin="0.5s"
        />
      </path>

      {/* Letter P in the center - elegant design */}
      <g filter="url(#softGlow)">
        <defs>
          <linearGradient id="pGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: pColor, stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: pColor, stopOpacity: 0.85 }} />
          </linearGradient>
        </defs>

        {/* P - single unified path for cleaner look */}
        <path
          d="M 82,70
             L 82,130
             L 90,130
             L 90,102
             L 104,102
             C 114,102 122,94 122,84
             C 122,74 114,70 104,70
             Z
             M 90,78
             L 104,78
             C 109,78 114,80 114,84
             C 114,88 109,94 104,94
             L 90,94
             Z"
          fill="url(#pGradient)"
        >
          <animate
            attributeName="opacity"
            values="0.95;1;0.95"
            dur={`${animationSpeed}s`}
            repeatCount="indefinite"
          />
        </path>

        {/* Subtle highlight on the P */}
        <path
          d="M 83,72 L 83,128 L 84,128 L 84,72 Z"
          fill="white"
          opacity="0.15"
        />
      </g>

    </svg>
  );
};
