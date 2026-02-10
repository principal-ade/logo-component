import React from 'react';

interface SquareLogoProps {
  width?: number;
  height?: number;
  colors?: string[];
  opacity?: number;
}

export const SquareLogo: React.FC<SquareLogoProps> = ({
  width = 150,
  height = 150,
  colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#96CEB4', '#FFEAA7', '#DDA15E', '#BC6C25', '#E76F51'],
  opacity = 0.9,
}) => {
  const rectangleStyle = {
    transition: 'all 0.3s ease',
  };

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Top-left corner rectangle - BACKGROUND */}
      <rect
        x="10"
        y="10"
        width="10"
        height="15"
        fill={colors[1]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
        />
      </rect>

      {/* Left vertical stem - PART OF P */}
      <rect
        x="20"
        y="10"
        width="15"
        height="80"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </rect>

      {/* Top horizontal bar - PART OF P */}
      <rect
        x="35"
        y="10"
        width="30"
        height="12"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </rect>

      {/* Top-right corner rectangle - PART OF P */}
      <rect
        x="65"
        y="10"
        width="25"
        height="12"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="0.9s"
        />
      </rect>

      {/* Inner bowl rectangle - left part - BACKGROUND */}
      <rect
        x="35"
        y="22"
        width="15"
        height="18"
        fill={colors[3]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="1.2s"
        />
      </rect>

      {/* Inner bowl rectangle - right part - BACKGROUND */}
      <rect
        x="50"
        y="22"
        width="15"
        height="18"
        fill={colors[4]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="1.5s"
        />
      </rect>

      {/* Right vertical bar - PART OF P */}
      <rect
        x="65"
        y="22"
        width="12"
        height="18"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="1.8s"
        />
      </rect>

      {/* Far right vertical rectangle - PART OF P */}
      <rect
        x="77"
        y="22"
        width="13"
        height="28"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="2.1s"
        />
      </rect>

      {/* Far right vertical - bottom part - BACKGROUND */}
      <rect
        x="77"
        y="50"
        width="13"
        height="40"
        fill={colors[5]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="2.1s"
        />
      </rect>

      {/* Middle horizontal bar - PART OF P */}
      <rect
        x="35"
        y="40"
        width="55"
        height="10"
        fill={colors[0]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="2.4s"
        />
      </rect>

      {/* Bottom-left rectangle under stem - BACKGROUND */}
      <rect
        x="10"
        y="25"
        width="10"
        height="35"
        fill={colors[6]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="2.7s"
        />
      </rect>

      {/* Middle-left rectangle - BACKGROUND */}
      <rect
        x="35"
        y="50"
        width="20"
        height="20"
        fill={colors[7]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="0.3s"
        />
      </rect>

      {/* Middle-right rectangle - BACKGROUND */}
      <rect
        x="55"
        y="50"
        width="22"
        height="20"
        fill={colors[8]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </rect>

      {/* Bottom-left corner rectangle - BACKGROUND */}
      <rect
        x="10"
        y="60"
        width="10"
        height="30"
        fill={colors[1]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="0.9s"
        />
      </rect>

      {/* Bottom horizontal rectangle - left - BACKGROUND */}
      <rect
        x="35"
        y="70"
        width="25"
        height="20"
        fill={colors[2]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="1;0.8;1"
          dur="3s"
          repeatCount="indefinite"
          begin="1.2s"
        />
      </rect>

      {/* Bottom horizontal rectangle - right - BACKGROUND */}
      <rect
        x="60"
        y="70"
        width="17"
        height="20"
        fill={colors[3]}
        style={rectangleStyle}
        filter="url(#glow)"
      >
        <animate
          attributeName="opacity"
          values="0.8;1;0.8"
          dur="3s"
          repeatCount="indefinite"
          begin="1.5s"
        />
      </rect>

      {/* Subtle dividing lines */}
      <line
        x1="20"
        y1="10"
        x2="20"
        y2="90"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
      <line
        x1="35"
        y1="10"
        x2="35"
        y2="90"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
      <line
        x1="10"
        y1="22"
        x2="90"
        y2="22"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
      <line
        x1="10"
        y1="40"
        x2="90"
        y2="40"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
      <line
        x1="10"
        y1="50"
        x2="90"
        y2="50"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="0.5"
      />
    </svg>
  );
};
