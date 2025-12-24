interface ControlPanelProps {
  currentTool: string;
  setCurrentTool: (tool: string) => void;
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
  rows: number;
  cols: number;
  setRows: (rows: number) => void;
  setCols: (cols: number) => void;
  onRunVisualization: () => void;
  onClearGrid: () => void;
  onReset: () => void;
  isRunning: boolean;
}

export function ControlPanel({
  currentTool,
  setCurrentTool,
  algorithm,
  setAlgorithm,
  rows,
  cols,
  setRows,
  setCols,
  onRunVisualization,
  onClearGrid,
  onReset,
  isRunning
}: ControlPanelProps) {
  const tools = [
    { id: 'obstacle', label: 'Add Obstacle', color: 'bg-gray-600' },
    { id: 'start', label: 'Set Start Point', color: 'bg-purple-500' },
    { id: 'end', label: 'Set End Point', color: 'bg-pink-500' },
    { id: 'charging', label: 'Add Charging Station', color: 'bg-yellow-400' },
    { id: 'pickup', label: 'Add Pickup Zone', color: 'bg-green-500' },
    { id: 'dropoff', label: 'Add Dropoff Zone', color: 'bg-blue-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col gap-6">
      <div>
        <h2 className="mb-4">Grid Tools</h2>
        <div className="flex flex-col gap-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setCurrentTool(tool.id)}
              className={`px-4 py-2 rounded transition-all ${
                currentTool === tool.id
                  ? 'bg-gray-800 text-white ring-2 ring-[#FF9900]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${tool.color}`} />
                {tool.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2">Algorithm</label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded bg-white"
          disabled={isRunning}
        >
          <option value="astar">A* (A-Star)</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="bfs">BFS (Breadth-First)</option>
        </select>
      </div>

      <div>
        <label className="block mb-2">Grid Size</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={rows}
            onChange={(e) => setRows(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Rows"
            min="5"
            max="50"
            disabled={isRunning}
          />
          <span className="flex items-center">×</span>
          <input
            type="number"
            value={cols}
            onChange={(e) => setCols(Math.max(5, Math.min(50, parseInt(e.target.value) || 20)))}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Cols"
            min="5"
            max="50"
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="flex-1" />

      <div className="flex flex-col gap-2">
        <button
          onClick={onRunVisualization}
          disabled={isRunning}
          className="w-full px-6 py-3 bg-[#FF9900] text-white rounded hover:bg-[#e68a00] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isRunning ? 'Running...' : 'Run Visualization'}
        </button>
        <button
          onClick={onClearGrid}
          disabled={isRunning}
          className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Clear Grid
        </button>
        <button
          onClick={onReset}
          disabled={isRunning}
          className="w-full px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
