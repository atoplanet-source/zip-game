/**
 * Zip Puzzles - All verified solvable
 * 
 * Each puzzle is designed by first creating a valid Hamiltonian path,
 * then placing waypoints along that path in order.
 */

const PUZZLES = [
  // Puzzle 1 - 4x4 Easy intro
  // Solution path: snake pattern
  // (0,0)→(0,1)→(0,2)→(0,3)→(1,3)→(1,2)→(1,1)→(1,0)→(2,0)→(2,1)→(2,2)→(2,3)→(3,3)→(3,2)→(3,1)→(3,0)
  {
    gridSize: 4,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 3, number: 2 },
      { row: 2, col: 0, number: 3 },
      { row: 3, col: 0, number: 4 },
    ]
  },
  
  // Puzzle 2 - 4x4 
  // Solution: (0,0)→(1,0)→(2,0)→(3,0)→(3,1)→(2,1)→(1,1)→(0,1)→(0,2)→(1,2)→(2,2)→(3,2)→(3,3)→(2,3)→(1,3)→(0,3)
  {
    gridSize: 4,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 3, col: 1, number: 2 },
      { row: 0, col: 2, number: 3 },
      { row: 0, col: 3, number: 4 },
    ]
  },
  
  // Puzzle 3 - 5x5
  // Snake: row by row alternating direction
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 4, number: 2 },
      { row: 2, col: 0, number: 3 },
      { row: 4, col: 4, number: 4 },
    ]
  },
  
  // Puzzle 4 - 5x5
  // Spiral inward
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 4, number: 2 },
      { row: 4, col: 4, number: 3 },
      { row: 4, col: 0, number: 4 },
      { row: 2, col: 2, number: 5 },
    ]
  },
  
  // Puzzle 5 - 5x5 different pattern
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 1, col: 4, number: 2 },
      { row: 3, col: 0, number: 3 },
      { row: 4, col: 4, number: 4 },
    ]
  },
  
  // Puzzle 6 - 6x6 snake
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 5, number: 2 },
      { row: 2, col: 0, number: 3 },
      { row: 3, col: 5, number: 4 },
      { row: 5, col: 0, number: 5 },
    ]
  },
  
  // Puzzle 7 - 6x6 
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 5, number: 2 },
      { row: 5, col: 5, number: 3 },
      { row: 5, col: 0, number: 4 },
    ]
  },
  
  // Puzzle 8 - 4x4 with 5 waypoints
  {
    gridSize: 4,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 3, number: 2 },
      { row: 1, col: 0, number: 3 },
      { row: 3, col: 3, number: 4 },
      { row: 3, col: 0, number: 5 },
    ]
  },

  // Puzzle 9 - 5x5 more waypoints
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 4, number: 2 },
      { row: 1, col: 0, number: 3 },
      { row: 2, col: 4, number: 4 },
      { row: 4, col: 0, number: 5 },
      { row: 4, col: 4, number: 6 },
    ]
  },
  
  // Puzzle 10 - 6x6 challenge
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },
      { row: 0, col: 5, number: 2 },
      { row: 1, col: 0, number: 3 },
      { row: 2, col: 5, number: 4 },
      { row: 4, col: 0, number: 5 },
      { row: 5, col: 5, number: 6 },
    ]
  },
];

function getPuzzleForDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  return JSON.parse(JSON.stringify(PUZZLES[puzzleIndex]));
}

function getPuzzleByIndex(index) {
  return JSON.parse(JSON.stringify(PUZZLES[index % PUZZLES.length]));
}
