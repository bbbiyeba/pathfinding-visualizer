import { useRef, useEffect } from 'react';

export type CellType = 'empty' | 'obstacle' | 'pickup' | 'dropoff' | 'charging' | 'start' | 'end' | 'path' | 'visited' | 'current';

export interface GridCell {
  type: CellType;
  robotId?: number;
  pathColor?: string;
}

export interface Robot {
  id: number;
  position: { row: number; col: number };
  direction: number; // 0-360 degrees
  battery: number;
  color: string;
  task: string;
}

interface GridCanvasProps {
  grid: GridCell[][];
  rows: number;
  cols: number;
  robots: Robot[];
  onCellClick: (row: number, col: number) => void;
  cellSize?: number;
}

export function GridCanvas({ grid, rows, cols, robots, onCellClick, cellSize = 30 }: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check if grid is properly initialized
    if (!grid || grid.length === 0 || !grid[0] || rows <= 0 || cols <= 0) return;

    // Additional safety check
    if (grid.length !== rows) {
      console.warn('Grid length mismatch');
      return;
    }

    try {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid cells
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Safety check for grid cell
          if (!grid[row] || !grid[row][col]) continue;
          
          const cell = grid[row][col];
          const x = col * cellSize;
          const y = row * cellSize;

          // Fill cell based on type
          switch (cell.type) {
            case 'empty':
              ctx.fillStyle = '#ffffff';
              break;
            case 'obstacle':
              ctx.fillStyle = '#4a5568';
              break;
            case 'pickup':
              ctx.fillStyle = '#48bb78';
              break;
            case 'dropoff':
              ctx.fillStyle = '#4299e1';
              break;
            case 'charging':
              ctx.fillStyle = '#f6e05e';
              break;
            case 'start':
              ctx.fillStyle = '#9f7aea';
              break;
            case 'end':
              ctx.fillStyle = '#ed64a6';
              break;
            case 'path':
              ctx.fillStyle = cell.pathColor || '#FF9900';
              break;
            case 'visited':
              ctx.fillStyle = '#bee3f8';
              break;
            case 'current':
              ctx.fillStyle = '#90cdf4';
              break;
          }

          ctx.fillRect(x, y, cellSize, cellSize);

          // Draw cell border
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }

      // Draw robots
      robots.forEach(robot => {
        const x = robot.position.col * cellSize + cellSize / 2;
        const y = robot.position.row * cellSize + cellSize / 2;
        const radius = cellSize * 0.4;

        // Draw robot circle
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = robot.color;
        ctx.fill();
        ctx.strokeStyle = '#2d3748';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw direction indicator
        const dirRad = (robot.direction * Math.PI) / 180;
        const indicatorLength = radius * 0.7;
        const endX = x + Math.cos(dirRad) * indicatorLength;
        const endY = y + Math.sin(dirRad) * indicatorLength;

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw robot ID
        ctx.fillStyle = '#ffffff';
        ctx.font = `${cellSize * 0.25}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`R${robot.id}`, x, y);
      });
    } catch (error) {
      console.error('Error drawing grid:', error);
    }
  }, [grid, rows, cols, robots, cellSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      onCellClick(row, col);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={cols * cellSize}
      height={rows * cellSize}
      onClick={handleCanvasClick}
      className="border border-gray-300 cursor-pointer shadow-sm"
    />
  );
}