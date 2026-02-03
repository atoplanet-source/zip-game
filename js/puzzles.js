/**
 * Zip Puzzle Definitions
 * 
 * Each puzzle has:
 * - gridSize: number (typically 7-9)
 * - waypoints: array of {row, col, number} - numbered stops (1, 2, 3, etc.)
 * - blocked: array of {row, col} - cells that can't be used
 * 
 * All other cells are playable (pink). Path must go through
 * waypoints in numerical order (1→2→3→...) and can use any
 * playable cell to connect them.
 */

const PUZZLES = [
  // Puzzle 1 - Simple introduction (like the screenshot)
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 6, col: 6, number: 2 },
      { row: 5, col: 1, number: 3 },
      { row: 3, col: 1, number: 4 },
      { row: 4, col: 4, number: 5 },
      { row: 3, col: 2, number: 6 },
      { row: 1, col: 5, number: 7 },
      { row: 2, col: 3, number: 8 },
    ],
    blocked: [
      { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 },
      { row: 2, col: 1 }, { row: 2, col: 2 },
      { row: 3, col: 3 }, { row: 3, col: 4 }, { row: 3, col: 5 },
      { row: 4, col: 2 }, { row: 4, col: 3 },
      { row: 5, col: 3 }, { row: 5, col: 4 }, { row: 5, col: 5 },
    ]
  },
  
  // Puzzle 2 - Medium
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 6, number: 2 },
      { row: 3, col: 3, number: 3 },
      { row: 6, col: 0, number: 4 },
      { row: 6, col: 6, number: 5 },
    ],
    blocked: [
      { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 },
      { row: 2, col: 1 }, { row: 2, col: 5 },
      { row: 4, col: 1 }, { row: 4, col: 5 },
      { row: 5, col: 2 }, { row: 5, col: 3 }, { row: 5, col: 4 },
    ]
  },
  
  // Puzzle 3 - Spiral pattern
  {
    gridSize: 7,
    waypoints: [
      { row: 3, col: 3, number: 1 },
      { row: 0, col: 0, number: 2 },
      { row: 0, col: 6, number: 3 },
      { row: 6, col: 6, number: 4 },
      { row: 6, col: 0, number: 5 },
    ],
    blocked: [
      { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 },
      { row: 3, col: 2 }, { row: 3, col: 4 },
      { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 4, col: 4 },
    ]
  },
  
  // Puzzle 4 - Longer path
  {
    gridSize: 8,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 7, number: 2 },
      { row: 4, col: 4, number: 3 },
      { row: 7, col: 0, number: 4 },
      { row: 7, col: 7, number: 5 },
      { row: 3, col: 3, number: 6 },
    ],
    blocked: [
      { row: 1, col: 3 }, { row: 1, col: 4 },
      { row: 2, col: 2 }, { row: 2, col: 5 },
      { row: 3, col: 1 }, { row: 3, col: 6 },
      { row: 4, col: 1 }, { row: 4, col: 6 },
      { row: 5, col: 2 }, { row: 5, col: 5 },
      { row: 6, col: 3 }, { row: 6, col: 4 },
    ]
  },
  
  // Puzzle 5 - Maze-like
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 2, col: 6, number: 2 },
      { row: 4, col: 0, number: 3 },
      { row: 6, col: 6, number: 4 },
    ],
    blocked: [
      { row: 0, col: 3 },
      { row: 1, col: 1 }, { row: 1, col: 3 }, { row: 1, col: 5 },
      { row: 2, col: 3 },
      { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 4 }, { row: 3, col: 5 },
      { row: 4, col: 3 },
      { row: 5, col: 1 }, { row: 5, col: 3 }, { row: 5, col: 5 },
      { row: 6, col: 3 },
    ]
  },
  
  // Puzzle 6 - Figure 8
  {
    gridSize: 7,
    waypoints: [
      { row: 1, col: 1, number: 1 },
      { row: 1, col: 5, number: 2 },
      { row: 5, col: 5, number: 3 },
      { row: 5, col: 1, number: 4 },
      { row: 3, col: 3, number: 5 },
    ],
    blocked: [
      { row: 0, col: 0 }, { row: 0, col: 6 },
      { row: 2, col: 2 }, { row: 2, col: 4 },
      { row: 4, col: 2 }, { row: 4, col: 4 },
      { row: 6, col: 0 }, { row: 6, col: 6 },
    ]
  },
  
  // Puzzle 7 - Many waypoints
  {
    gridSize: 8,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 4, number: 2 },
      { row: 2, col: 7, number: 3 },
      { row: 4, col: 3, number: 4 },
      { row: 5, col: 0, number: 5 },
      { row: 7, col: 4, number: 6 },
      { row: 7, col: 7, number: 7 },
    ],
    blocked: [
      { row: 1, col: 2 }, { row: 1, col: 5 },
      { row: 2, col: 1 }, { row: 2, col: 4 },
      { row: 3, col: 3 }, { row: 3, col: 6 },
      { row: 4, col: 0 }, { row: 4, col: 5 },
      { row: 5, col: 2 }, { row: 5, col: 7 },
      { row: 6, col: 1 }, { row: 6, col: 4 },
    ]
  },
];

/**
 * Get puzzle for today (deterministic based on date)
 */
function getPuzzleForDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  return JSON.parse(JSON.stringify(PUZZLES[puzzleIndex])); // Deep clone
}

/**
 * Get puzzle by index (for testing)
 */
function getPuzzleByIndex(index) {
  return JSON.parse(JSON.stringify(PUZZLES[index % PUZZLES.length]));
}
