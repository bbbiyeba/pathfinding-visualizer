interface StatsBarProps {
  pathLength: number;
  nodesExplored: number;
  computationTime: number;
  algorithm: string;
  speed: number;
  setSpeed: (speed: number) => void;
}

export function StatsBar({
  pathLength,
  nodesExplored,
  computationTime,
  algorithm,
  speed,
  setSpeed
}: StatsBarProps) {
  const algorithmNames: Record<string, string> = {
    astar: 'A* (A-Star)',
    dijkstra: 'Dijkstra',
    bfs: 'BFS (Breadth-First Search)'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Algorithm</span>
            <span className="text-lg">{algorithmNames[algorithm]}</span>
          </div>
          
          <div className="h-10 w-px bg-gray-300" />
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Path Length</span>
            <span className="text-lg">{pathLength} cells</span>
          </div>
          
          <div className="h-10 w-px bg-gray-300" />
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Nodes Explored</span>
            <span className="text-lg">{nodesExplored}</span>
          </div>
          
          <div className="h-10 w-px bg-gray-300" />
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Computation Time</span>
            <span className="text-lg">{computationTime.toFixed(2)} ms</span>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-[250px]">
          <span className="text-sm text-gray-600 whitespace-nowrap">Visualization Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-8">{speed}</span>
        </div>
      </div>
    </div>
  );
}
