/**
 * Zip Puzzle Definitions
 * 
 * Rules:
 * 1. ALL cells must be filled with the path
 * 2. Path must visit numbered waypoints in order (1→2→3→...)
 * 3. Path cannot cross itself
 * 
 * Each puzzle has:
 * - gridSize: number (typically 5-8)
 * - waypoints: array of {row, col, number}
 */

const PUZZLES = [
  // Puzzle 1 - 5x5 intro
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 4, col: 4, number: 2 },
      { row: 4, col: 0, number: 3 },
      { row: 0, col: 4, number: 4 },
    ]
  },
  
  // Puzzle 2 - 5x5 
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 2, col: 2, number: 2 },
      { row: 4, col: 4, number: 3 },
    ]
  },
  
  // Puzzle 3 - 6x6
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 5, number: 2 },
      { row: 5, col: 5, number: 3 },
      { row: 5, col: 0, number: 4 },
      { row: 2, col: 3, number: 5 },
    ]
  },
  
  // Puzzle 4 - 6x6 different
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 3, col: 3, number: 2 },
      { row: 0, col: 5, number: 3 },
      { row: 5, col: 2, number: 4 },
    ]
  },
  
  // Puzzle 5 - 7x7 (like screenshot)
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
    ]
  },
  
  // Puzzle 6 - 6x6 spiral
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 5, col: 5, number: 2 },
      { row: 2, col: 2, number: 3 },
    ]
  },
  
  // Puzzle 7 - 7x7
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 6, number: 2 },
      { row: 3, col: 3, number: 3 },
      { row: 6, col: 0, number: 4 },
      { row: 6, col: 6, number: 5 },
    ]
  },
  
  // Puzzle 8 - 5x5 many waypoints
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 4, number: 2 },
      { row: 2, col: 2, number: 3 },
      { row: 4, col: 0, number: 4 },
      { row: 4, col: 4, number: 5 },
    ]
  },
  
  // Puzzle 9 - 6x6 
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 2, number: 1 },
      { row: 2, col: 5, number: 2 },
      { row: 5, col: 3, number: 3 },
      { row: 3, col: 0, number: 4 },
    ]
  },
  
  // Puzzle 10 - 7x7 challenge
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 3, number: 1 },
      { row: 3, col: 6, number: 2 },
      { row: 6, col: 3, number: 3 },
      { row: 3, col: 0, number: 4 },
      { row: 3, col: 3, number: 5 },
    ]
  },
];

/**
 * Get puzzle for today
 */
function getPuzzleForDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  return JSON.parse(JSON.stringify(PUZZLES[puzzleIndex]));
}

/**
 * Get puzzle by index
 */
function getPuzzleByIndex(index) {
  return JSON.parse(JSON.stringify(PUZZLES[index % PUZZLES.length]));
}
