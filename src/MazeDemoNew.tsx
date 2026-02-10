import React, { useMemo, useState, useEffect } from "react";
import { MazeGenerator } from "./utils/mazeGenerator";

interface MazeDemoTheme {
  primary: string;
  error: string;
  warning: string;
  success: string;
  background: string;
  text: string;
}

interface MazeDemoProps {
  width?: number;
  height?: number;
  theme?: Partial<MazeDemoTheme>;
  mazeSeed?: number;
}

const defaultTheme: MazeDemoTheme = {
  primary: "#6366f1",
  error: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
  background: "#2a2a2a",
  text: "#ffffff",
};

interface RevealedCell {
  col: number;
  row: number;
}

export const MazeDemoNew: React.FC<MazeDemoProps> = ({
  width = 450,
  height = 620,
  theme: themeProp,
  mazeSeed = 42,
}) => {
  const theme = { ...defaultTheme, ...themeProp };
  // Maze configuration
  const gridSize = 10;
  const cellSize = 30;
  const padding = 50;
  const mazeWidth = gridSize * cellSize;
  const mazeHeight = gridSize * cellSize;
  const mazeX = (width - mazeWidth) / 2;

  // Key positions
  const startCol = 0;
  const startRow = 0;
  const destCol = 9;
  const destRow = 9;

  // State
  const [revealedCells, setRevealedCells] = useState<RevealedCell[]>([]);
  const [directionHint, setDirectionHint] = useState<string>("");
  const [timeCost, setTimeCost] = useState<number>(0);
  const [clickCost, setClickCost] = useState<number>(0);
  const [blockageFound, setBlockageFound] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [started, setStarted] = useState<boolean>(false);
  const [currentSeed, setCurrentSeed] = useState<number>(() => Math.floor(Math.random() * 10000));
  const [blockageInjected, setBlockageInjected] = useState<boolean>(false);
  const [deployed, setDeployed] = useState<boolean>(false);
  const [mode, setMode] = useState<'initial' | 'no-agentic' | 'agentic' | 'principal'>('initial');

  // Total incident cost
  const incidentCost = timeCost + clickCost;

  // Update currentSeed when mazeSeed prop changes
  useEffect(() => {
    setCurrentSeed(mazeSeed);
  }, [mazeSeed]);

  // Increment time cost
  useEffect(() => {
    if (blockageFound || !startTime || !started) return;

    const interval = setInterval(() => {
      setTimeCost(prev => prev + 1);
    }, 10);

    return () => clearInterval(interval);
  }, [blockageFound, startTime, started]);

  // Generate maze
  const { horizontalWalls, verticalWalls, blockageWall, actualBlockageCol, actualBlockageRow } = useMemo(() => {
    let seed = currentSeed;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const originalRandom = Math.random;
    Math.random = seededRandom;

    const generator = new MazeGenerator(gridSize, gridSize);
    generator.generate(startRow, startCol);

    let blockCell = { row: 5, col: 5 } as any;
    let direction: 'north' | 'south' | 'east' | 'west' = 'east';
    let blockageWall: any = null;

    if (blockageInjected) {
      const path = generator.findPath(startRow, startCol, destRow, destCol);

      if (path.length > 2) {
        const middleStart = Math.floor(path.length * 0.3);
        const middleEnd = Math.floor(path.length * 0.7);
        const blockIndex = Math.floor(seededRandom() * (middleEnd - middleStart)) + middleStart;
        blockCell = path[blockIndex];

        if (blockIndex < path.length - 1) {
          const nextCell = path[blockIndex + 1];
          const rowDiff = nextCell.row - blockCell.row;
          const colDiff = nextCell.col - blockCell.col;

          if (rowDiff === 1) direction = 'south';
          else if (rowDiff === -1) direction = 'north';
          else if (colDiff === 1) direction = 'east';
          else if (colDiff === -1) direction = 'west';
        }
      }

      generator.addBlockage(blockCell.row, blockCell.col, direction);
    }

    const walls = generator.getWalls();

    if (blockageInjected) {
      if (direction === 'east' || direction === 'west') {
        const targetCol = direction === 'east' ? blockCell.col + 1 : blockCell.col;
        const targetRow = blockCell.row;

        const wallSegment = walls.vertical.find(wall => {
          const [col, row1, , row2] = wall;
          return col === targetCol && row1 <= targetRow && row2 > targetRow;
        });

        if (wallSegment) {
          const [col, row1, , row2] = wallSegment;
          blockageWall = { type: 'vertical' as const, col, row1, row2 };
        }
      } else {
        const targetRow = direction === 'south' ? blockCell.row + 1 : blockCell.row;
        const targetCol = blockCell.col;

        const wallSegment = walls.horizontal.find(wall => {
          const [col1, row, col2] = wall;
          return row === targetRow && col1 <= targetCol && col2 > targetCol;
        });

        if (wallSegment) {
          const [col1, row, col2] = wallSegment;
          blockageWall = { type: 'horizontal' as const, row, col1, col2 };
        }
      }
    }

    Math.random = originalRandom;

    return {
      horizontalWalls: walls.horizontal,
      verticalWalls: walls.vertical,
      blockageWall,
      actualBlockageCol: blockCell.col,
      actualBlockageRow: blockCell.row,
    };
  }, [currentSeed, blockageInjected]);

  // Handlers
  const handleModeSelect = (selectedMode: 'no-agentic' | 'agentic') => {
    setMode(selectedMode);
  };

  const handleDeploy = () => {
    setDeployed(true);
    setTimeout(() => {
      setBlockageInjected(true);
      setStarted(true);
      setStartTime(Date.now());
    }, 3000);
  };

  const handleTryPrincipal = () => {
    setMode('principal');
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setTimeCost(0);
    setClickCost(0);
    setStartTime(null);
    setStarted(false);
    setDeployed(false);
    setBlockageInjected(false); // Principal mode still needs to deploy first
  };

  const handleTryAgain = () => {
    setRevealedCells([]);
    setDirectionHint("");
    setBlockageFound(false);
    setTimeCost(0);
    setClickCost(0);
    setStartTime(null);
    setStarted(false);
    setBlockageInjected(false);
    setDeployed(false);
    setMode('initial');
    setCurrentSeed(Math.floor(Math.random() * 10000));
  };

  const handleCellClick = (col: number, row: number) => {
    if (blockageFound || !started) return;

    // In principal mode, only allow clicking the blockage cell
    if (mode === 'principal') {
      const isBlockageCell = col === actualBlockageCol && row === actualBlockageRow;
      if (isBlockageCell) {
        setDirectionHint("Blockage Found!");
        setBlockageFound(true);
      }
      return;
    }

    const alreadyRevealed = revealedCells.some(
      cell => cell.col === col && cell.row === row
    );

    if (alreadyRevealed) return;

    setClickCost(prev => prev + 500);
    setRevealedCells([...revealedCells, { col, row }]);

    const isBlockageCell = col === actualBlockageCol && row === actualBlockageRow;

    if (isBlockageCell) {
      setDirectionHint("Blockage Found!");
      setBlockageFound(true);

      const cellsToReveal: RevealedCell[] = [...revealedCells];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const distance = Math.abs(actualBlockageCol - c) + Math.abs(actualBlockageRow - r);
          if (distance <= 3) {
            const alreadyInList = cellsToReveal.some(
              cell => cell.col === c && cell.row === r
            );
            if (!alreadyInList) {
              cellsToReveal.push({ col: c, row: r });
            }
          }
        }
      }
      setRevealedCells(cellsToReveal);
    } else {
      const colDiff = actualBlockageCol - col;
      const rowDiff = actualBlockageRow - row;

      let direction = "";
      if (Math.abs(rowDiff) > 1) {
        direction += rowDiff > 0 ? "South " : "North ";
      }
      if (Math.abs(colDiff) > 1) {
        direction += colDiff > 0 ? "East" : "West";
      }

      const distance = Math.abs(colDiff) + Math.abs(rowDiff);
      let proximity = "";
      if (distance <= 2) proximity = "Very close!";
      else if (distance <= 4) proximity = "Getting warmer...";
      else if (distance <= 6) proximity = "Still far...";
      else proximity = "Cold...";

      setDirectionHint(`${direction} ${proximity}`);
    }
  };

  // Render maze
  const renderMaze = (showBlockage: boolean, opacity: number = 1) => {
    const elements = [];

    elements.push(
      <rect
        key="background"
        x={mazeX}
        y={padding}
        width={mazeWidth}
        height={mazeHeight}
        fill="none"
        stroke={theme.primary}
        strokeWidth="3"
        opacity={0.3 * opacity}
      />
    );

    const isBlockageWall = (type: 'horizontal' | 'vertical', wall: number[]) => {
      if (!showBlockage || !blockageWall) return false;

      if (type === 'vertical') {
        const [x, y1, , y2] = wall;
        return (
          blockageWall.type === 'vertical' &&
          x === blockageWall.col &&
          y1 === blockageWall.row1 &&
          y2 === blockageWall.row2
        );
      } else if (type === 'horizontal') {
        const [x1, y, x2] = wall;
        return (
          blockageWall.type === 'horizontal' &&
          y === blockageWall.row &&
          x1 === blockageWall.col1 &&
          x2 === blockageWall.col2
        );
      }
      return false;
    };

    horizontalWalls.forEach((wall, idx) => {
      const [x1, y, x2] = wall;
      const isBlockage = isBlockageWall('horizontal', wall);

      elements.push(
        <line
          key={`h-wall-${idx}`}
          x1={mazeX + x1 * cellSize}
          y1={padding + y * cellSize}
          x2={mazeX + x2 * cellSize}
          y2={padding + y * cellSize}
          stroke={isBlockage ? theme.error : theme.primary}
          strokeWidth={isBlockage ? 4 : 2.5}
          strokeLinecap="round"
          opacity={opacity}
        >
          {isBlockage && showBlockage && (
            <animate
              attributeName="stroke-width"
              values="4;6;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </line>
      );
    });

    verticalWalls.forEach((wall, idx) => {
      const [x, y1, , y2] = wall;
      const isBlockage = isBlockageWall('vertical', wall);

      elements.push(
        <line
          key={`v-wall-${idx}`}
          x1={mazeX + x * cellSize}
          y1={padding + y1 * cellSize}
          x2={mazeX + x * cellSize}
          y2={padding + y2 * cellSize}
          stroke={isBlockage ? theme.error : theme.primary}
          strokeWidth={isBlockage ? 4 : 2.5}
          strokeLinecap="round"
          opacity={opacity}
        >
          {isBlockage && showBlockage && (
            <animate
              attributeName="stroke-width"
              values="4;6;4"
              dur="1.5s"
              repeatCount="indefinite"
            />
          )}
        </line>
      );
    });

    for (let row = 0; row <= gridSize; row++) {
      elements.push(
        <line
          key={`grid-h-${row}`}
          x1={mazeX}
          y1={padding + row * cellSize}
          x2={mazeX + mazeWidth}
          y2={padding + row * cellSize}
          stroke={theme.primary}
          strokeWidth="0.5"
          opacity={0.15 * opacity}
        />
      );
    }
    for (let col = 0; col <= gridSize; col++) {
      elements.push(
        <line
          key={`grid-v-${col}`}
          x1={mazeX + col * cellSize}
          y1={padding}
          x2={mazeX + col * cellSize}
          y2={padding + mazeHeight}
          stroke={theme.primary}
          strokeWidth="0.5"
          opacity={0.15 * opacity}
        />
      );
    }

    return elements;
  };

  const getTitle = () => {
    if (mode === 'principal') return "With Principal";
    if (mode === 'agentic') return "With Agentic Coding";
    if (mode === 'no-agentic') return "Without Agentic Coding";
    return "Choose Your Approach";
  };

  const getSubtitle = () => {
    if (mode === 'principal') return "Full visibility - See everything";
    if (started) return "Find the blockage";
    if (deployed) return "Running smoothly...";
    return "How will you handle production?";
  };

  const showCover = mode === 'agentic' || (deployed && mode === 'no-agentic');
  const coverOpacity = 1; // Always full opacity for the cover
  const mazeOpacity = 1; // Maze always at full opacity, cover handles visibility

  return (
    <svg width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {/* Title */}
      <text x={width / 2} y={25} textAnchor="middle" fill={theme.primary} fontSize="16" fontWeight="bold">
        {getTitle()}
      </text>
      <text x={width / 2} y={40} textAnchor="middle" fill={theme.primary} fontSize="11" opacity="0.6">
        {getSubtitle()}
      </text>

      {/* Maze - only show after mode is selected */}
      {mode !== 'initial' && (
        <>
          <g>{renderMaze(mode === 'principal' || blockageFound, mazeOpacity)}</g>

          {/* START markers */}
          <circle
            cx={mazeX + (startCol + 0.5) * cellSize}
            cy={padding + (startRow + 0.5) * cellSize}
            r="5"
            fill={theme.warning}
          />
          <text
            x={mazeX - 5}
            y={padding - 5}
            textAnchor="end"
            fontSize="10"
            fill={theme.warning}
            fontWeight="bold"
          >
            START
          </text>

          {/* DEST markers */}
          <g>
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="8"
              fill="none"
              stroke={theme.primary}
              strokeWidth="1.5"
              opacity="0.5"
            />
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="5"
              fill="none"
              stroke={theme.primary}
              strokeWidth="1.5"
              opacity="0.6"
            />
            <circle
              cx={mazeX + (destCol + 0.5) * cellSize}
              cy={padding + (destRow + 0.5) * cellSize}
              r="2"
              fill={theme.primary}
              opacity="0.7"
            />
          </g>
          <text
            x={mazeX + mazeWidth + 5}
            y={padding + mazeHeight + 15}
            textAnchor="start"
            fontSize="9"
            fill={theme.primary}
            fontWeight="bold"
          >
            DEST
          </text>
        </>
      )}

      {/* Cover overlay */}
      {showCover && (
        <>
          <defs>
            <mask id="mazeCoverMask">
              <rect
                x={mazeX}
                y={padding}
                width={mazeWidth}
                height={mazeHeight}
                fill="white"
              />
              {revealedCells.map((cell, idx) => (
                <rect
                  key={idx}
                  x={mazeX + cell.col * cellSize}
                  y={padding + cell.row * cellSize}
                  width={cellSize}
                  height={cellSize}
                  fill="black"
                />
              ))}
            </mask>
          </defs>

          <g>
            <rect
              x={mazeX}
              y={padding}
              width={mazeWidth}
              height={mazeHeight}
              fill={theme.background}
              opacity={coverOpacity}
              mask="url(#mazeCoverMask)"
            />
            <rect
              x={mazeX}
              y={padding}
              width={mazeWidth}
              height={mazeHeight}
              fill="none"
              stroke={theme.primary}
              strokeWidth="3"
              opacity="0.4"
            />

            {started && revealedCells.length === 0 && (
              <g>
                <rect
                  x={mazeX + mazeWidth / 2 - 130}
                  y={padding + mazeHeight / 2 - 40}
                  width={260}
                  height={80}
                  fill={theme.background}
                  opacity="0.7"
                  rx="8"
                  pointerEvents="none"
                />
                <text
                  x={mazeX + mazeWidth / 2}
                  y={padding + mazeHeight / 2 - 15}
                  textAnchor="middle"
                  fontSize="18"
                  fill={theme.error}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  INCIDENT ALERT
                </text>
                <text
                  x={mazeX + mazeWidth / 2}
                  y={padding + mazeHeight / 2 + 10}
                  textAnchor="middle"
                  fontSize="13"
                  fill={theme.text}
                  fontWeight="normal"
                  pointerEvents="none"
                >
                  It's 3:00 AM - Find the blockage!
                </text>
              </g>
            )}

            {started && revealedCells.length > 0 && directionHint && (
              <g>
                <rect
                  x={mazeX + mazeWidth / 2 - 100}
                  y={padding + mazeHeight / 2 - 25}
                  width={200}
                  height={40}
                  fill={theme.background}
                  opacity="0.7"
                  rx="6"
                  pointerEvents="none"
                />
                <text
                  x={mazeX + mazeWidth / 2}
                  y={padding + mazeHeight / 2}
                  textAnchor="middle"
                  fontSize="16"
                  fill={theme.text}
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {directionHint}
                </text>
              </g>
            )}
          </g>
        </>
      )}

      {/* Interactive cells */}
      {started && (
        <g>
          {Array.from({ length: gridSize }).map((_, row) =>
            Array.from({ length: gridSize }).map((_, col) => (
              <rect
                key={`cell-${row}-${col}`}
                x={mazeX + col * cellSize}
                y={padding + row * cellSize}
                width={cellSize}
                height={cellSize}
                fill="transparent"
                stroke="none"
                style={{ cursor: 'pointer' }}
                onClick={() => handleCellClick(col, row)}
                onMouseEnter={(e) => {
                  e.currentTarget.setAttribute('fill', theme.warning);
                  e.currentTarget.setAttribute('opacity', '0.1');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.setAttribute('fill', 'transparent');
                  e.currentTarget.setAttribute('opacity', '1');
                }}
              />
            ))
          )}
        </g>
      )}

      {/* Initial mode selection */}
      {mode === 'initial' && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={() => handleModeSelect('no-agentic')}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 130}
              y={padding + mazeHeight + 25}
              width={120}
              height={40}
              fill={theme.warning}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 - 70}
              y={padding + mazeHeight + 52}
              textAnchor="middle"
              fontSize="12"
              fill={theme.text}
              fontWeight="bold"
              pointerEvents="none"
            >
              No Agentic
            </text>
          </g>

          <g
            style={{ cursor: 'pointer' }}
            onClick={() => handleModeSelect('agentic')}
          >
            <rect
              x={mazeX + mazeWidth / 2 + 10}
              y={padding + mazeHeight + 25}
              width={120}
              height={40}
              fill={theme.primary}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2 + 70}
              y={padding + mazeHeight + 52}
              textAnchor="middle"
              fontSize="12"
              fill={theme.text}
              fontWeight="bold"
              pointerEvents="none"
            >
              Agentic Coding
            </text>
          </g>
        </g>
      )}

      {/* Deploy button */}
      {(mode === 'no-agentic' || mode === 'agentic' || mode === 'principal') && !deployed && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={handleDeploy}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 60}
              y={padding + mazeHeight + 25}
              width={120}
              height={40}
              fill={theme.warning}
              rx="6"
            />
            <text
              x={mazeX + mazeWidth / 2}
              y={padding + mazeHeight + 52}
              textAnchor="middle"
              fontSize="16"
              fill={theme.text}
              fontWeight="bold"
              pointerEvents="none"
            >
              DEPLOY
            </text>
          </g>
        </g>
      )}

      {/* Running fine message */}
      {deployed && !started && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={theme.success}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 35}
            textAnchor="middle"
            fontSize="11"
            fill={theme.text}
            fontWeight="normal"
          >
            Deployment Successful
          </text>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 50}
            textAnchor="middle"
            fontSize="14"
            fill={theme.text}
            fontWeight="bold"
          >
            All systems operational
          </text>
        </g>
      )}

      {/* Incident cost */}
      {started && (
        <g>
          <rect
            x={mazeX}
            y={padding + mazeHeight + 20}
            width={mazeWidth}
            height={35}
            fill={blockageFound ? theme.success : theme.error}
            opacity="0.9"
            rx="4"
          />
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 35}
            textAnchor="middle"
            fontSize="11"
            fill={theme.text}
            fontWeight="normal"
          >
            {blockageFound ? "Incident Resolved!" : "Incident Cost"}
          </text>
          <text
            x={mazeX + mazeWidth / 2}
            y={padding + mazeHeight + 50}
            textAnchor="middle"
            fontSize="18"
            fill={theme.text}
            fontWeight="bold"
          >
            ${incidentCost.toLocaleString()}
          </text>
        </g>
      )}

      {/* Try Again / Try with Principal buttons */}
      {started && blockageFound && mode !== 'principal' && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTryAgain}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 130}
              y={padding + mazeHeight + 65}
              width={120}
              height={25}
              fill={theme.primary}
              opacity="0.2"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2 - 70}
              y={padding + mazeHeight + 82}
              textAnchor="middle"
              fontSize="10"
              fill={theme.primary}
              fontWeight="bold"
              pointerEvents="none"
            >
              Try Again
            </text>
          </g>

          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTryPrincipal}
          >
            <rect
              x={mazeX + mazeWidth / 2 + 10}
              y={padding + mazeHeight + 65}
              width={120}
              height={25}
              fill={theme.success}
              opacity="0.8"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2 + 70}
              y={padding + mazeHeight + 82}
              textAnchor="middle"
              fontSize="10"
              fill={theme.text}
              fontWeight="bold"
              pointerEvents="none"
            >
              Try with Principal
            </text>
          </g>
        </g>
      )}

      {/* Principal mode - Try Again button (after blockage found) */}
      {mode === 'principal' && blockageFound && (
        <g>
          <g
            style={{ cursor: 'pointer' }}
            onClick={handleTryAgain}
          >
            <rect
              x={mazeX + mazeWidth / 2 - 60}
              y={padding + mazeHeight + 65}
              width={120}
              height={25}
              fill={theme.primary}
              opacity="0.3"
              rx="4"
            />
            <text
              x={mazeX + mazeWidth / 2}
              y={padding + mazeHeight + 82}
              textAnchor="middle"
              fontSize="10"
              fill={theme.primary}
              fontWeight="bold"
              pointerEvents="none"
            >
              Try Again
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};
