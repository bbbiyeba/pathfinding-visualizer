import { useState, useCallback, useEffect } from 'react';
import { GridCanvas, GridCell, Robot } from './components/GridCanvas';
import { ControlPanel } from './components/ControlPanel';
import { StatsBar } from './components/StatsBar';
import { InfoPanel } from './components/InfoPanel';
import { aStar, dijkstra, bfs } from './utils/pathfinding';

export default function App() {
  const [rows, setRows] = useState(20);
  const [cols, setCols] = useState(30);
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [currentTool, setCurrentTool] = useState('obstacle');
  const [algorithm, setAlgorithm] = useState('astar');
  const [startPoint, setStartPoint] = useState<{ row: number; col: number } | null>(null);
  const [endPoint, setEndPoint] = useState<{ row: number; col: number } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [pathLength, setPathLength] = useState(0);
  const [nodesExplored, setNodesExplored] = useState(0);
  const [computationTime, setComputationTime] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [algorithmLog, setAlgorithmLog] = useState<string[]>([]);
  const [robots, setRobots] = useState<Robot[]>([
    {
      id: 1,
      position: { row: 2, col: 2 },
      direction: 45,
      battery: 85,
      color: '#FF9900',
      task: 'Idle'
    },
    {
      id: 2,
      position: { row: 15, col: 25 },
      direction: 180,
      battery: 62,
      color: '#9333EA',
      task: 'Idle'
    }
  ]);

  // Initialize grid
  useEffect(() => {
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        newGrid[row][col] = { type: 'empty' };
      }
    }
    setGrid(newGrid);
    setStartPoint(null);
    setEndPoint(null);
  }, [rows, cols]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      
      if (currentTool === 'start') {
        // Clear previous start point
        if (startPoint) {
          newGrid[startPoint.row][startPoint.col] = { type: 'empty' };
        }
        newGrid[row][col] = { type: 'start' };
        setStartPoint({ row, col });
      } else if (currentTool === 'end') {
        // Clear previous end point
        if (endPoint) {
          newGrid[endPoint.row][endPoint.col] = { type: 'empty' };
        }
        newGrid[row][col] = { type: 'end' };
        setEndPoint({ row, col });
      } else {
        newGrid[row][col] = { type: currentTool as any };
      }
      
      return newGrid;
    });
  }, [currentTool, isRunning, startPoint, endPoint]);

  const clearGrid = useCallback(() => {
    const newGrid: GridCell[][] = [];
    for (let row = 0; row < rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        newGrid[row][col] = { type: 'empty' };
      }
    }
    setGrid(newGrid);
    setStartPoint(null);
    setEndPoint(null);
    setPathLength(0);
    setNodesExplored(0);
    setComputationTime(0);
    setAlgorithmLog([]);
  }, [rows, cols]);

  const resetVisualization = useCallback(() => {
    if (!startPoint || !endPoint) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(r => [...r]);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (newGrid[row][col].type === 'path' || newGrid[row][col].type === 'visited') {
            newGrid[row][col] = { type: 'empty' };
          }
        }
      }
      if (startPoint) newGrid[startPoint.row][startPoint.col] = { type: 'start' };
      if (endPoint) newGrid[endPoint.row][endPoint.col] = { type: 'end' };
      return newGrid;
    });

    setPathLength(0);
    setNodesExplored(0);
    setComputationTime(0);
    setAlgorithmLog([]);
  }, [startPoint, endPoint, rows, cols]);

  const runVisualization = useCallback(async () => {
    if (!startPoint || !endPoint) {
      alert('Please set both start and end points');
      return;
    }

    setIsRunning(true);
    setAlgorithmLog([]);
    resetVisualization();

    const startTime = performance.now();

    let result;
    switch (algorithm) {
      case 'astar':
        result = aStar(grid, startPoint, endPoint, rows, cols);
        break;
      case 'dijkstra':
        result = dijkstra(grid, startPoint, endPoint, rows, cols);
        break;
      case 'bfs':
        result = bfs(grid, startPoint, endPoint, rows, cols);
        break;
      default:
        result = aStar(grid, startPoint, endPoint, rows, cols);
    }

    const endTime = performance.now();
    setComputationTime(endTime - startTime);

    // Animate visited nodes
    for (let i = 0; i < result.visited.length; i++) {
      const node = result.visited[i];
      
      setGrid(prevGrid => {
        const newGrid = prevGrid.map(r => [...r]);
        if (newGrid[node.row][node.col].type === 'empty') {
          newGrid[node.row][node.col] = { type: 'visited' };
        }
        return newGrid;
      });

      if (result.steps[i]) {
        setAlgorithmLog(prev => [...prev, result.steps[i].message]);
      }

      await new Promise(resolve => setTimeout(resolve, 100 - speed));
    }

    // Animate path
    if (result.path.length > 0) {
      for (let i = 1; i < result.path.length - 1; i++) {
        const node = result.path[i];
        
        setGrid(prevGrid => {
          const newGrid = prevGrid.map(r => [...r]);
          newGrid[node.row][node.col] = { type: 'path', pathColor: '#FF9900' };
          return newGrid;
        });

        await new Promise(resolve => setTimeout(resolve, 50 - speed / 2));
      }

      // Update robot position
      setRobots(prevRobots => {
        const newRobots = [...prevRobots];
        if (newRobots[0]) {
          newRobots[0].position = endPoint;
          newRobots[0].task = 'Completed';
          newRobots[0].battery = Math.max(0, newRobots[0].battery - result.path.length);
        }
        return newRobots;
      });
    }

    setPathLength(result.path.length);
    setNodesExplored(result.visited.length);
    setIsRunning(false);
  }, [startPoint, endPoint, grid, algorithm, rows, cols, speed, resetVisualization]);

  // Calculate cell size with safety checks
  const calculateCellSize = () => {
    if (typeof window === 'undefined' || cols === 0) return 25;
    const maxWidth = Math.max(800, window.innerWidth * 0.7 - 48);
    return Math.max(15, Math.min(30, Math.floor(maxWidth / cols)));
  };

  const cellSize = calculateCellSize();

  // Don't render until grid is initialized
  if (!grid || grid.length === 0 || grid.length !== rows) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Initializing grid...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-6 px-8 shadow-lg">
        <h1 className="mb-1">Warehouse Robot Pathfinding Visualizer</h1>
        <p className="text-gray-300">Amazon Fulfillment Center Operations Dashboard</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 gap-6 grid grid-cols-1 xl:grid-cols-[280px_1fr_280px] lg:grid-cols-[250px_1fr_250px]">
        {/* Left Sidebar */}
        <ControlPanel
          currentTool={currentTool}
          setCurrentTool={setCurrentTool}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          rows={rows}
          cols={cols}
          setRows={setRows}
          setCols={setCols}
          onRunVisualization={runVisualization}
          onClearGrid={clearGrid}
          onReset={resetVisualization}
          isRunning={isRunning}
        />

        {/* Center Content */}
        <div className="flex flex-col gap-6">
          {/* Stats Bar */}
          <StatsBar
            pathLength={pathLength}
            nodesExplored={nodesExplored}
            computationTime={computationTime}
            algorithm={algorithm}
            speed={speed}
            setSpeed={setSpeed}
          />

          {/* Grid Canvas */}
          <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center overflow-auto">
            <GridCanvas
              grid={grid}
              rows={rows}
              cols={cols}
              robots={robots}
              onCellClick={handleCellClick}
              cellSize={cellSize}
            />
          </div>
        </div>

        {/* Right Panel */}
        <InfoPanel robots={robots} algorithmLog={algorithmLog} />
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-4">By: Bryce Biyeba</p>
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/bbbiyeba"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/bryce-biyeba/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}