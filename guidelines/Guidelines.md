# Warehouse Robot Pathfinding Dashboard - Development Guidelines

## General Guidelines

### Code Quality
* Keep components small and focused - each component should have a single responsibility
* Extract complex logic into utility functions in `/src/app/utils/`
* Use TypeScript types for all props and function parameters
* Maintain consistent naming conventions: PascalCase for components, camelCase for functions/variables
* Comment complex algorithms thoroughly, especially in pathfinding logic

### Performance
* Memoize expensive calculations using `useMemo` and `useCallback`
* Avoid unnecessary re-renders by optimizing state management
* Keep grid animation frame rate smooth (target 60fps)
* Debounce rapid user interactions (like obstacle placement during drag)

### File Structure
* Components go in `/src/app/components/`
* Utilities and algorithms go in `/src/app/utils/`
* Keep related files together (e.g., component + its styles)
* Maximum 300 lines per file - split larger files into smaller modules

---

## Design System Guidelines

### Colors & Theme
* **Primary Blue** (#3B82F6): Start point, primary buttons, active states
* **Red** (#EF4444): End point, error states, obstacles
* **Yellow** (#FDE047): Explored nodes during pathfinding
* **Green** (#10B981): Final path, success states
* **Gray Scale**: Use Tailwind's gray-100 to gray-900 for UI elements
* **Background**: White (#FFFFFF) for grid cells, gray-50 for app background

### Typography
* **Headings**: Use font-semibold or font-bold
* **Body Text**: font-normal, text-sm to text-base
* **Code/Stats**: Use monospace font (font-mono) for numbers and metrics
* **Always maintain readability** - minimum 14px font size for body text

### Spacing
* Use Tailwind spacing scale consistently (p-4, m-2, gap-3, etc.)
* Grid cells: Maintain consistent padding and margins
* Control panel: Use p-6 for main padding, gap-4 between sections
* Mobile: Reduce padding to p-4 on smaller screens

### Responsive Design
* **Mobile First**: Design for mobile, enhance for desktop
* **Breakpoints**: Use Tailwind's responsive prefixes (sm:, md:, lg:, xl:)
* **Grid**: Adjust grid size based on screen size (smaller on mobile)
* **Touch Targets**: Minimum 44px × 44px for buttons on mobile

---

## Component Guidelines

### GridCanvas Component
* Grid cells should be square and responsive
* Use CSS Grid for layout (not flexbox)
* Each cell must have clear visual states:
  * Empty: white background, gray border
  * Start: blue background
  * End: red background
  * Obstacle: black background
  * Explored: yellow background with subtle animation
  * Path: green background with slight glow
* Support both click and drag interactions for obstacle placement
* Animate pathfinding visualization smoothly (100-200ms delay between steps)

### ControlPanel Component
* Group related controls together with clear visual separation
* Algorithm selector should be prominent and easy to switch
* Buttons should have clear labels and hover states
* Disable "Find Path" button if start or end is not set
* Show loading state during pathfinding calculation
* Use consistent button sizing (h-10 or h-12)

### StatsBar Component
* Display metrics in real-time during algorithm execution
* Format numbers with proper separators (e.g., "1,234 nodes")
* Use monospace font for numeric values
* Color-code metrics for quick scanning:
  * Path length: green
  * Nodes explored: yellow
  * Execution time: blue
* Update stats only when algorithm completes or resets

### InfoPanel Component
* Use accordion or collapsible sections for algorithm explanations
* Include visual diagrams or examples where helpful
* Keep explanations concise (2-3 paragraphs max per algorithm)
* Use code snippets for pseudocode
* Highlight time/space complexity clearly

---

## Algorithm Implementation Guidelines

### Pathfinding Utilities (`/src/app/utils/pathfinding.ts`)

#### General Rules
* Each algorithm should return the same data structure:
```typescript
  {
    path: Node[],           // Final path from start to end
    explored: Node[],       // All nodes visited during search
    success: boolean,       // Whether a path was found
    nodesExplored: number,  // Count of explored nodes
    pathLength: number,     // Length of final path
    executionTime: number   // Time in milliseconds
  }
```
* Use performance.now() for accurate timing
* Validate input (start, end, obstacles) before running
* Handle edge cases: no path exists, start === end, invalid grid

#### A* Algorithm
* Use Manhattan distance as heuristic for grid-based navigation
* Implement proper priority queue (min-heap) for efficiency
* Track f(n) = g(n) + h(n) scores accurately
* Reconstruct path by backtracking through parent nodes

#### Dijkstra's Algorithm
* Similar to A* but without heuristic (h(n) = 0)
* Use priority queue based on g(n) cost alone
* Should explore more nodes than A* but guarantee optimal path

#### BFS (Breadth-First Search)
* Use queue (FIFO) data structure
* Explore all neighbors at current depth before moving deeper
* Guarantees shortest path in unweighted graphs
* Stop immediately when end node is found

#### DFS (Depth-First Search)
* Use stack (LIFO) data structure
* Explore as deep as possible before backtracking
* Does NOT guarantee shortest path
* May find path quickly but it might be suboptimal

---

## Animation & Visualization Guidelines

### Pathfinding Animation
* Visualize explored nodes with 100-200ms delay between each step
* Use CSS transitions for smooth cell color changes
* Final path should animate separately after exploration completes
* Allow users to skip/speed up animation
* Clear previous animations before starting new pathfinding

### User Interactions
* Provide immediate visual feedback for all interactions:
  * Hover states on buttons and grid cells
  * Active states when clicking
  * Disabled states with reduced opacity
* Show loading spinner during pathfinding calculation
* Animate state changes smoothly (200-300ms transitions)

---

## Accessibility Guidelines

### Keyboard Navigation
* All interactive elements must be keyboard accessible (tab navigation)
* Grid cells should be focusable and selectable with Enter/Space
* Provide keyboard shortcuts for common actions:
  * `S` - Set start point
  * `E` - Set end point
  * `O` - Add obstacles
  * `R` - Run algorithm
  * `C` - Clear grid

### Screen Readers
* Use proper ARIA labels for all controls
* Announce state changes (e.g., "Path found: 24 steps")
* Provide text alternatives for visual-only information
* Use semantic HTML (buttons, not divs with onClick)

### Visual Accessibility
* Ensure sufficient color contrast (WCAG AA minimum)
* Don't rely solely on color - use patterns/icons too
* Support high contrast mode
* Allow users to adjust animation speed

---

## Testing Guidelines

### Before Each Commit
* Test all four algorithms on the same scenario
* Verify pathfinding works with various obstacle patterns
* Test edge cases:
  * No possible path (fully blocked)
  * Start equals end
  * Empty grid (no obstacles)
  * Grid filled with obstacles except path
* Check responsive design on mobile/tablet/desktop
* Verify all buttons and controls work as expected

### Performance Testing
* Grid should render smoothly even with 20×20+ cells
* Animations should maintain 60fps
* Algorithm execution should complete in <1 second for typical grids
* Memory usage should remain stable during repeated runs

---

## Git Commit Guidelines

### Commit Message Format
```
<type>: <short description>

[optional longer description]
```

### Types
* `feat`: New feature (e.g., "feat: add DFS algorithm")
* `fix`: Bug fix (e.g., "fix: correct path highlighting on mobile")
* `style`: UI/styling changes (e.g., "style: improve button hover effects")
* `refactor`: Code refactoring (e.g., "refactor: extract pathfinding logic")
* `perf`: Performance improvements (e.g., "perf: optimize grid rendering")
* `docs`: Documentation (e.g., "docs: add algorithm explanations")
* `test`: Testing (e.g., "test: add BFS edge case tests")

### Examples
```bash
git commit -m "feat: add animation speed control"
git commit -m "fix: resolve path not clearing on reset"
git commit -m "style: improve mobile responsive grid layout"
git commit -m "refactor: separate grid logic into custom hook"
```

---

## Deployment Checklist

Before deploying to production:
- [ ] All algorithms tested and working
- [ ] Responsive design verified on multiple devices
- [ ] No console errors or warnings
- [ ] README.md is up to date
- [ ] Performance is optimized (fast load time, smooth animations)
- [ ] Accessibility features implemented
- [ ] Code is properly commented
- [ ] Build command succeeds (`npm run build`)

---

## Notes

* **Priority**: User experience over feature richness - keep it simple and intuitive
* **Maintainability**: Write code that's easy to understand and modify later
* **Documentation**: Comment WHY, not WHAT - the code shows what, comments explain why
* **Collaboration**: Keep code consistent with existing patterns in the project