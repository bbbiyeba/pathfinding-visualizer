import { GridCell } from '../components/GridCanvas';

export interface PathfindingResult {
  path: { row: number; col: number }[];
  visited: { row: number; col: number }[];
  steps: PathfindingStep[];
}

export interface PathfindingStep {
  current: { row: number; col: number };
  visited: { row: number; col: number }[];
  message: string;
}

class PriorityQueue<T> {
  private items: { element: T; priority: number }[] = [];

  enqueue(element: T, priority: number) {
    this.items.push({ element, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.element;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

function heuristic(a: { row: number; col: number }, b: { row: number; col: number }): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function getNeighbors(
  pos: { row: number; col: number },
  rows: number,
  cols: number,
  grid: GridCell[][]
): { row: number; col: number }[] {
  const neighbors: { row: number; col: number }[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];

  for (const dir of directions) {
    const newRow = pos.row + dir.row;
    const newCol = pos.col + dir.col;

    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      grid[newRow][newCol].type !== 'obstacle'
    ) {
      neighbors.push({ row: newRow, col: newCol });
    }
  }

  return neighbors;
}

function reconstructPath(
  cameFrom: Map<string, { row: number; col: number }>,
  current: { row: number; col: number }
): { row: number; col: number }[] {
  const path: { row: number; col: number }[] = [current];
  let curr = current;

  while (cameFrom.has(`${curr.row},${curr.col}`)) {
    curr = cameFrom.get(`${curr.row},${curr.col}`)!;
    path.unshift(curr);
  }

  return path;
}

export function aStar(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
  rows: number,
  cols: number
): PathfindingResult {
  const openSet = new PriorityQueue<{ row: number; col: number }>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const visited: { row: number; col: number }[] = [];
  const steps: PathfindingStep[] = [];

  const startKey = `${start.row},${start.col}`;
  gScore.set(startKey, 0);
  fScore.set(startKey, heuristic(start, end));
  openSet.enqueue(start, fScore.get(startKey)!);

  steps.push({
    current: start,
    visited: [],
    message: `Starting A* algorithm at (${start.row}, ${start.col})`
  });

  while (!openSet.isEmpty()) {
    const current = openSet.dequeue()!;
    const currentKey = `${current.row},${current.col}`;
    visited.push(current);

    steps.push({
      current,
      visited: [...visited],
      message: `Exploring node (${current.row}, ${current.col}), f-score: ${fScore.get(currentKey)?.toFixed(2)}`
    });

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(cameFrom, current);
      steps.push({
        current,
        visited: [...visited],
        message: `Path found! Length: ${path.length}`
      });
      return { path, visited, steps };
    }

    const neighbors = getNeighbors(current, rows, cols, grid);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      const tentativeGScore = (gScore.get(currentKey) || Infinity) + 1;

      if (tentativeGScore < (gScore.get(neighborKey) || Infinity)) {
        cameFrom.set(neighborKey, current);
        gScore.set(neighborKey, tentativeGScore);
        fScore.set(neighborKey, tentativeGScore + heuristic(neighbor, end));
        openSet.enqueue(neighbor, fScore.get(neighborKey)!);
      }
    }
  }

  steps.push({
    current: start,
    visited: [...visited],
    message: 'No path found'
  });

  return { path: [], visited, steps };
}

export function dijkstra(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
  rows: number,
  cols: number
): PathfindingResult {
  const pq = new PriorityQueue<{ row: number; col: number }>();
  const distances = new Map<string, number>();
  const cameFrom = new Map<string, { row: number; col: number }>();
  const visited: { row: number; col: number }[] = [];
  const steps: PathfindingStep[] = [];

  const startKey = `${start.row},${start.col}`;
  distances.set(startKey, 0);
  pq.enqueue(start, 0);

  steps.push({
    current: start,
    visited: [],
    message: `Starting Dijkstra's algorithm at (${start.row}, ${start.col})`
  });

  while (!pq.isEmpty()) {
    const current = pq.dequeue()!;
    const currentKey = `${current.row},${current.col}`;
    visited.push(current);

    steps.push({
      current,
      visited: [...visited],
      message: `Exploring node (${current.row}, ${current.col}), distance: ${distances.get(currentKey)}`
    });

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(cameFrom, current);
      steps.push({
        current,
        visited: [...visited],
        message: `Path found! Length: ${path.length}`
      });
      return { path, visited, steps };
    }

    const neighbors = getNeighbors(current, rows, cols, grid);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      const alt = (distances.get(currentKey) || Infinity) + 1;

      if (alt < (distances.get(neighborKey) || Infinity)) {
        distances.set(neighborKey, alt);
        cameFrom.set(neighborKey, current);
        pq.enqueue(neighbor, alt);
      }
    }
  }

  steps.push({
    current: start,
    visited: [...visited],
    message: 'No path found'
  });

  return { path: [], visited, steps };
}

export function bfs(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number },
  rows: number,
  cols: number
): PathfindingResult {
  const queue: { row: number; col: number }[] = [start];
  const cameFrom = new Map<string, { row: number; col: number }>();
  const visited: { row: number; col: number }[] = [];
  const visitedSet = new Set<string>();
  const steps: PathfindingStep[] = [];

  visitedSet.add(`${start.row},${start.col}`);

  steps.push({
    current: start,
    visited: [],
    message: `Starting BFS algorithm at (${start.row}, ${start.col})`
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    visited.push(current);

    steps.push({
      current,
      visited: [...visited],
      message: `Exploring node (${current.row}, ${current.col})`
    });

    if (current.row === end.row && current.col === end.col) {
      const path = reconstructPath(cameFrom, current);
      steps.push({
        current,
        visited: [...visited],
        message: `Path found! Length: ${path.length}`
      });
      return { path, visited, steps };
    }

    const neighbors = getNeighbors(current, rows, cols, grid);

    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.row},${neighbor.col}`;
      if (!visitedSet.has(neighborKey)) {
        visitedSet.add(neighborKey);
        cameFrom.set(neighborKey, current);
        queue.push(neighbor);
      }
    }
  }

  steps.push({
    current: start,
    visited: [...visited],
    message: 'No path found'
  });

  return { path: [], visited, steps };
}
