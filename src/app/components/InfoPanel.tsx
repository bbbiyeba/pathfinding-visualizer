import { Robot } from './GridCanvas';

interface InfoPanelProps {
  robots: Robot[];
  algorithmLog: string[];
}

export function InfoPanel({ robots, algorithmLog }: InfoPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col gap-6">
      <div>
        <h3 className="mb-4">Legend</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-300 rounded" />
            <span className="text-sm">Empty Space</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gray-600 rounded" />
            <span className="text-sm">Obstacle/Shelving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded" />
            <span className="text-sm">Pickup Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded" />
            <span className="text-sm">Dropoff Zone</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400 rounded" />
            <span className="text-sm">Charging Station</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-500 rounded" />
            <span className="text-sm">Start Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-pink-500 rounded" />
            <span className="text-sm">End Point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#FF9900] rounded" />
            <span className="text-sm">Path</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4">Robot Status</h3>
        <div className="flex flex-col gap-3">
          {robots.length === 0 ? (
            <p className="text-sm text-gray-500">No robots active</p>
          ) : (
            robots.map(robot => (
              <div key={robot.id} className="bg-gray-50 rounded p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: robot.color }}
                  />
                  <span>Robot {robot.id}</span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Battery:</span>
                    <span className={robot.battery < 30 ? 'text-red-600' : ''}>{robot.battery}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Task:</span>
                    <span>{robot.task}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Position:</span>
                    <span>({robot.position.row}, {robot.position.col})</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="mb-4">Algorithm Log</h3>
        <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-3 border border-gray-200">
          {algorithmLog.length === 0 ? (
            <p className="text-sm text-gray-500">No activity yet</p>
          ) : (
            <div className="text-xs font-mono space-y-1">
              {algorithmLog.map((log, index) => (
                <div key={index} className="text-gray-700">{log}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
