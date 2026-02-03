/**
 * Puzzle definitions for Zip
 * Each puzzle defines:
 * - gridSize: number (6 or 7 typically)
 * - nodes: array of { row, col, directions }
 *   - directions: array of allowed directions ['up', 'down', 'left', 'right']
 *   - empty array = neutral node (all directions allowed)
 */

const PUZZLES = [
  // Puzzle 1 - Easy 5x5
  {
    gridSize: 5,
    nodes: [
      { row: 0, col: 0, directions: ['right', 'down'] },
      { row: 0, col: 1, directions: ['left', 'right'] },
      { row: 0, col: 2, directions: ['left', 'down'] },
      { row: 1, col: 2, directions: ['up', 'down'] },
      { row: 2, col: 2, directions: ['up', 'right'] },
      { row: 2, col: 3, directions: ['left', 'down'] },
      { row: 3, col: 3, directions: ['up', 'down'] },
      { row: 4, col: 3, directions: ['up', 'left'] },
      { row: 4, col: 2, directions: ['right', 'left'] },
      { row: 4, col: 1, directions: ['right', 'up'] },
      { row: 3, col: 1, directions: ['down', 'left'] },
      { row: 3, col: 0, directions: ['right', 'up'] },
      { row: 2, col: 0, directions: ['down', 'up'] },
      { row: 1, col: 0, directions: ['down', 'right'] },
      { row: 1, col: 1, directions: ['left', 'down'] },
      { row: 2, col: 1, directions: ['up', 'down'] },
    ]
  },
  
  // Puzzle 2 - Medium 6x6
  {
    gridSize: 6,
    nodes: [
      { row: 0, col: 0, directions: ['right', 'down'] },
      { row: 0, col: 1, directions: ['left', 'right'] },
      { row: 0, col: 2, directions: ['left', 'right'] },
      { row: 0, col: 3, directions: ['left', 'down'] },
      { row: 1, col: 3, directions: ['up', 'right'] },
      { row: 1, col: 4, directions: ['left', 'down'] },
      { row: 2, col: 4, directions: ['up', 'down'] },
      { row: 3, col: 4, directions: ['up', 'down'] },
      { row: 4, col: 4, directions: ['up', 'left'] },
      { row: 4, col: 3, directions: ['right', 'down'] },
      { row: 5, col: 3, directions: ['up', 'left'] },
      { row: 5, col: 2, directions: ['right', 'left'] },
      { row: 5, col: 1, directions: ['right', 'up'] },
      { row: 4, col: 1, directions: ['down', 'left'] },
      { row: 4, col: 0, directions: ['right', 'up'] },
      { row: 3, col: 0, directions: ['down', 'up'] },
      { row: 2, col: 0, directions: ['down', 'right'] },
      { row: 2, col: 1, directions: ['left', 'up'] },
      { row: 1, col: 1, directions: ['down', 'right'] },
      { row: 1, col: 2, directions: ['left', 'down'] },
      { row: 2, col: 2, directions: ['up', 'right'] },
      { row: 2, col: 3, directions: ['left', 'down'] },
      { row: 3, col: 3, directions: ['up', 'left'] },
      { row: 3, col: 2, directions: ['right', 'down'] },
      { row: 4, col: 2, directions: ['up', 'up'] },
      { row: 1, col: 0, directions: ['down', 'up'] },
    ]
  },
  
  // Puzzle 3 - 6x6 different pattern
  {
    gridSize: 6,
    nodes: [
      { row: 0, col: 1, directions: ['right', 'down'] },
      { row: 0, col: 2, directions: ['left', 'right'] },
      { row: 0, col: 3, directions: ['left', 'right'] },
      { row: 0, col: 4, directions: ['left', 'down'] },
      { row: 1, col: 4, directions: ['up', 'down'] },
      { row: 2, col: 4, directions: ['up', 'left'] },
      { row: 2, col: 3, directions: ['right', 'down'] },
      { row: 3, col: 3, directions: ['up', 'right'] },
      { row: 3, col: 4, directions: ['left', 'down'] },
      { row: 4, col: 4, directions: ['up', 'down'] },
      { row: 5, col: 4, directions: ['up', 'left'] },
      { row: 5, col: 3, directions: ['right', 'left'] },
      { row: 5, col: 2, directions: ['right', 'left'] },
      { row: 5, col: 1, directions: ['right', 'up'] },
      { row: 4, col: 1, directions: ['down', 'up'] },
      { row: 3, col: 1, directions: ['down', 'right'] },
      { row: 3, col: 2, directions: ['left', 'up'] },
      { row: 2, col: 2, directions: ['down', 'left'] },
      { row: 2, col: 1, directions: ['right', 'up'] },
      { row: 1, col: 1, directions: ['down', 'up'] },
    ]
  },
  
  // Puzzle 4 - 5x5 serpentine
  {
    gridSize: 5,
    nodes: [
      { row: 0, col: 0, directions: ['right', 'down'] },
      { row: 0, col: 1, directions: ['left', 'right'] },
      { row: 0, col: 2, directions: ['left', 'right'] },
      { row: 0, col: 3, directions: ['left', 'right'] },
      { row: 0, col: 4, directions: ['left', 'down'] },
      { row: 1, col: 4, directions: ['up', 'down'] },
      { row: 2, col: 4, directions: ['up', 'left'] },
      { row: 2, col: 3, directions: ['right', 'left'] },
      { row: 2, col: 2, directions: ['right', 'left'] },
      { row: 2, col: 1, directions: ['right', 'left'] },
      { row: 2, col: 0, directions: ['right', 'down'] },
      { row: 3, col: 0, directions: ['up', 'down'] },
      { row: 4, col: 0, directions: ['up', 'right'] },
      { row: 4, col: 1, directions: ['left', 'right'] },
      { row: 4, col: 2, directions: ['left', 'right'] },
      { row: 4, col: 3, directions: ['left', 'right'] },
      { row: 4, col: 4, directions: ['left', 'up'] },
      { row: 3, col: 4, directions: ['down', 'left'] },
      { row: 3, col: 3, directions: ['right', 'left'] },
      { row: 3, col: 2, directions: ['right', 'left'] },
      { row: 3, col: 1, directions: ['right', 'up'] },
      { row: 1, col: 1, directions: ['down', 'right'] },
      { row: 1, col: 2, directions: ['left', 'right'] },
      { row: 1, col: 3, directions: ['left', 'up'] },
      { row: 1, col: 0, directions: ['down', 'up'] },
    ]
  },
  
  // Puzzle 5 - 6x6 complex
  {
    gridSize: 6,
    nodes: [
      { row: 0, col: 0, directions: ['down', 'right'] },
      { row: 0, col: 1, directions: ['left', 'down'] },
      { row: 1, col: 1, directions: ['up', 'right'] },
      { row: 1, col: 2, directions: ['left', 'down'] },
      { row: 2, col: 2, directions: ['up', 'right'] },
      { row: 2, col: 3, directions: ['left', 'up'] },
      { row: 1, col: 3, directions: ['down', 'right'] },
      { row: 1, col: 4, directions: ['left', 'down'] },
      { row: 2, col: 4, directions: ['up', 'down'] },
      { row: 3, col: 4, directions: ['up', 'down'] },
      { row: 4, col: 4, directions: ['up', 'down'] },
      { row: 5, col: 4, directions: ['up', 'left'] },
      { row: 5, col: 3, directions: ['right', 'up'] },
      { row: 4, col: 3, directions: ['down', 'left'] },
      { row: 4, col: 2, directions: ['right', 'up'] },
      { row: 3, col: 2, directions: ['down', 'left'] },
      { row: 3, col: 1, directions: ['right', 'down'] },
      { row: 4, col: 1, directions: ['up', 'down'] },
      { row: 5, col: 1, directions: ['up', 'left'] },
      { row: 5, col: 0, directions: ['right', 'up'] },
      { row: 4, col: 0, directions: ['down', 'up'] },
      { row: 3, col: 0, directions: ['down', 'up'] },
      { row: 2, col: 0, directions: ['down', 'up'] },
      { row: 1, col: 0, directions: ['down', 'up'] },
    ]
  },
  
  // Puzzle 6 - 7x7 larger grid
  {
    gridSize: 7,
    nodes: [
      { row: 0, col: 0, directions: ['right', 'down'] },
      { row: 0, col: 1, directions: ['left', 'right'] },
      { row: 0, col: 2, directions: ['left', 'down'] },
      { row: 1, col: 2, directions: ['up', 'right'] },
      { row: 1, col: 3, directions: ['left', 'right'] },
      { row: 1, col: 4, directions: ['left', 'down'] },
      { row: 2, col: 4, directions: ['up', 'right'] },
      { row: 2, col: 5, directions: ['left', 'down'] },
      { row: 3, col: 5, directions: ['up', 'down'] },
      { row: 4, col: 5, directions: ['up', 'down'] },
      { row: 5, col: 5, directions: ['up', 'down'] },
      { row: 6, col: 5, directions: ['up', 'left'] },
      { row: 6, col: 4, directions: ['right', 'left'] },
      { row: 6, col: 3, directions: ['right', 'left'] },
      { row: 6, col: 2, directions: ['right', 'up'] },
      { row: 5, col: 2, directions: ['down', 'left'] },
      { row: 5, col: 1, directions: ['right', 'up'] },
      { row: 4, col: 1, directions: ['down', 'up'] },
      { row: 3, col: 1, directions: ['down', 'right'] },
      { row: 3, col: 2, directions: ['left', 'down'] },
      { row: 4, col: 2, directions: ['up', 'right'] },
      { row: 4, col: 3, directions: ['left', 'up'] },
      { row: 3, col: 3, directions: ['down', 'right'] },
      { row: 3, col: 4, directions: ['left', 'up'] },
      { row: 2, col: 3, directions: ['down', 'up'] },
      { row: 1, col: 1, directions: ['down', 'up'] },
      { row: 2, col: 1, directions: ['up', 'right'] },
      { row: 2, col: 2, directions: ['left', 'down'] },
      { row: 1, col: 0, directions: ['down', 'up'] },
      { row: 2, col: 0, directions: ['up', 'down'] },
      { row: 3, col: 0, directions: ['up', 'down'] },
      { row: 4, col: 0, directions: ['up', 'down'] },
      { row: 5, col: 0, directions: ['up', 'down'] },
      { row: 6, col: 0, directions: ['up', 'right'] },
      { row: 6, col: 1, directions: ['left', 'up'] },
    ]
  },
  
  // Puzzle 7 - Medium with neutral nodes
  {
    gridSize: 5,
    nodes: [
      { row: 0, col: 2, directions: [] }, // neutral - start
      { row: 0, col: 3, directions: ['left', 'down'] },
      { row: 1, col: 3, directions: ['up', 'down'] },
      { row: 2, col: 3, directions: ['up', 'right'] },
      { row: 2, col: 4, directions: ['left', 'down'] },
      { row: 3, col: 4, directions: ['up', 'down'] },
      { row: 4, col: 4, directions: ['up', 'left'] },
      { row: 4, col: 3, directions: ['right', 'left'] },
      { row: 4, col: 2, directions: ['right', 'left'] },
      { row: 4, col: 1, directions: ['right', 'up'] },
      { row: 3, col: 1, directions: ['down', 'up'] },
      { row: 2, col: 1, directions: ['down', 'left'] },
      { row: 2, col: 0, directions: ['right', 'up'] },
      { row: 1, col: 0, directions: ['down', 'right'] },
      { row: 1, col: 1, directions: ['left', 'up'] },
      { row: 0, col: 1, directions: ['down', 'right'] },
    ]
  },
];

/**
 * Get puzzle for a specific day
 * Uses date to deterministically select puzzle
 */
function getPuzzleForDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  return PUZZLES[puzzleIndex];
}

/**
 * Get puzzle by index (for testing)
 */
function getPuzzleByIndex(index) {
  return PUZZLES[index % PUZZLES.length];
}
