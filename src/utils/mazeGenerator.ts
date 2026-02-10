/**
 * Maze Generator using Recursive Backtracking
 * Creates a perfect maze (exactly one path between any two cells)
 */

export interface MazeCell {
  row: number;
  col: number;
  visited: boolean;
  walls: {
    north: boolean;
    south: boolean;
    east: boolean;
    west: boolean;
  };
}

export interface MazeWalls {
  horizontal: number[][]; // [startCol, row, endCol, row]
  vertical: number[][];   // [col, startRow, col, endRow]
}

export class MazeGenerator {
  private grid: MazeCell[][];
  private rows: number;
  private cols: number;

  constructor(rows: number, cols: number) {
    this.rows = rows;
    this.cols = cols;
    this.grid = this.initializeGrid();
  }

  private initializeGrid(): MazeCell[][] {
    const grid: MazeCell[][] = [];
    for (let row = 0; row < this.rows; row++) {
      grid[row] = [];
      for (let col = 0; col < this.cols; col++) {
        grid[row][col] = {
          row,
          col,
          visited: false,
          walls: {
            north: true,
            south: true,
            east: true,
            west: true,
          },
        };
      }
    }
    return grid;
  }

  private getCell(row: number, col: number): MazeCell | null {
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      return null;
    }
    return this.grid[row][col];
  }

  private getUnvisitedNeighbors(cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = [];
    const { row, col } = cell;

    // North
    const north = this.getCell(row - 1, col);
    if (north && !north.visited) neighbors.push(north);

    // South
    const south = this.getCell(row + 1, col);
    if (south && !south.visited) neighbors.push(south);

    // East
    const east = this.getCell(row, col + 1);
    if (east && !east.visited) neighbors.push(east);

    // West
    const west = this.getCell(row, col - 1);
    if (west && !west.visited) neighbors.push(west);

    return neighbors;
  }

  private removeWallBetween(current: MazeCell, next: MazeCell): void {
    const rowDiff = current.row - next.row;
    const colDiff = current.col - next.col;

    // North
    if (rowDiff === 1) {
      current.walls.north = false;
      next.walls.south = false;
    }
    // South
    else if (rowDiff === -1) {
      current.walls.south = false;
      next.walls.north = false;
    }
    // East
    else if (colDiff === -1) {
      current.walls.east = false;
      next.walls.west = false;
    }
    // West
    else if (colDiff === 1) {
      current.walls.west = false;
      next.walls.east = false;
    }
  }

  private recursiveBacktrack(cell: MazeCell): void {
    cell.visited = true;

    const neighbors = this.getUnvisitedNeighbors(cell);

    // Shuffle neighbors for randomness
    this.shuffle(neighbors);

    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        this.removeWallBetween(cell, neighbor);
        this.recursiveBacktrack(neighbor);
      }
    }
  }

  private shuffle<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Generate the maze starting from a specific cell
   */
  public generate(startRow: number = 0, startCol: number = 0): void {
    const startCell = this.getCell(startRow, startCol);
    if (startCell) {
      this.recursiveBacktrack(startCell);
    }
  }

  /**
   * Convert the maze to wall segments for rendering
   */
  public getWalls(): MazeWalls {
    const horizontal: number[][] = [];
    const vertical: number[][] = [];

    // Convert cell walls to line segments
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.grid[row][col];

        // North wall
        if (cell.walls.north) {
          // Check if we can extend an existing horizontal wall
          const lastHWall = horizontal[horizontal.length - 1];
          if (lastHWall && lastHWall[1] === row && lastHWall[2] === col) {
            // Extend the wall
            lastHWall[2] = col + 1;
          } else {
            // Create new wall segment
            horizontal.push([col, row, col + 1, row]);
          }
        }

        // West wall
        if (cell.walls.west) {
          // Check if we can extend an existing vertical wall
          const lastVWall = vertical[vertical.length - 1];
          if (lastVWall && lastVWall[0] === col && lastVWall[3] === row) {
            // Extend the wall
            lastVWall[3] = row + 1;
          } else {
            // Create new wall segment
            vertical.push([col, row, col, row + 1]);
          }
        }

        // South wall (only for bottom row)
        if (row === this.rows - 1 && cell.walls.south) {
          const lastHWall = horizontal[horizontal.length - 1];
          if (lastHWall && lastHWall[1] === row + 1 && lastHWall[2] === col) {
            lastHWall[2] = col + 1;
          } else {
            horizontal.push([col, row + 1, col + 1, row + 1]);
          }
        }

        // East wall (only for rightmost column)
        if (col === this.cols - 1 && cell.walls.east) {
          const lastVWall = vertical[vertical.length - 1];
          if (lastVWall && lastVWall[0] === col + 1 && lastVWall[3] === row) {
            lastVWall[3] = row + 1;
          } else {
            vertical.push([col + 1, row, col + 1, row + 1]);
          }
        }
      }
    }

    return { horizontal, vertical };
  }

  /**
   * Get a copy of the grid for debugging or analysis
   */
  public getGrid(): MazeCell[][] {
    return this.grid;
  }

  /**
   * Find path from start to end using BFS
   * Returns array of cells representing the path
   */
  public findPath(startRow: number, startCol: number, endRow: number, endCol: number): MazeCell[] {
    const visited = new Set<string>();
    const queue: { cell: MazeCell; path: MazeCell[] }[] = [];

    const startCell = this.getCell(startRow, startCol);
    if (!startCell) return [];

    queue.push({ cell: startCell, path: [startCell] });
    visited.add(`${startRow},${startCol}`);

    while (queue.length > 0) {
      const { cell, path } = queue.shift()!;

      if (cell.row === endRow && cell.col === endCol) {
        return path;
      }

      // Check all four directions
      const neighbors = [
        { dir: 'north', dr: -1, dc: 0, wall: cell.walls.north },
        { dir: 'south', dr: 1, dc: 0, wall: cell.walls.south },
        { dir: 'east', dr: 0, dc: 1, wall: cell.walls.east },
        { dir: 'west', dr: 0, dc: -1, wall: cell.walls.west },
      ];

      for (const { dr, dc, wall } of neighbors) {
        if (wall) continue; // Can't go through wall

        const nextRow = cell.row + dr;
        const nextCol = cell.col + dc;
        const key = `${nextRow},${nextCol}`;

        if (visited.has(key)) continue;

        const nextCell = this.getCell(nextRow, nextCol);
        if (!nextCell) continue;

        visited.add(key);
        queue.push({
          cell: nextCell,
          path: [...path, nextCell]
        });
      }
    }

    return []; // No path found
  }

  /**
   * Add a blockage (wall) at a specific position
   */
  public addBlockage(row: number, col: number, direction: 'north' | 'south' | 'east' | 'west'): void {
    const cell = this.getCell(row, col);
    if (!cell) return;

    cell.walls[direction] = true;

    // Also add the wall to the adjacent cell
    if (direction === 'north') {
      const neighbor = this.getCell(row - 1, col);
      if (neighbor) neighbor.walls.south = true;
    } else if (direction === 'south') {
      const neighbor = this.getCell(row + 1, col);
      if (neighbor) neighbor.walls.north = true;
    } else if (direction === 'east') {
      const neighbor = this.getCell(row, col + 1);
      if (neighbor) neighbor.walls.west = true;
    } else if (direction === 'west') {
      const neighbor = this.getCell(row, col - 1);
      if (neighbor) neighbor.walls.east = true;
    }
  }
}

/**
 * Helper function to generate a maze with default settings
 */
export function generateMaze(rows: number, cols: number, seed?: number): MazeWalls {
  // Use seed for reproducible mazes (if provided)
  if (seed !== undefined) {
    // Simple seeded random (not cryptographically secure)
    let currentSeed = seed;
    Math.random = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  const generator = new MazeGenerator(rows, cols);
  generator.generate(0, 0);
  return generator.getWalls();
}
