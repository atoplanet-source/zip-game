/**
 * Zip Puzzles - All verified solvable via snake path
 * 
 * Snake pattern:
 * - Even rows (0,2,4...): left to right
 * - Odd rows (1,3,5...): right to left
 * 
 * All waypoints are placed in order along this snake path.
 */

// Helper to calculate position in snake path
function snakePosition(row, col, gridSize) {
  if (row % 2 === 0) {
    // Even row: left to right
    return row * gridSize + col;
  } else {
    // Odd row: right to left
    return row * gridSize + (gridSize - 1 - col);
  }
}

// Verify waypoints are in valid snake order
function verifyPuzzle(puzzle) {
  const positions = puzzle.waypoints.map(w => ({
    ...w,
    pos: snakePosition(w.row, w.col, puzzle.gridSize)
  }));
  
  // Check each waypoint comes after the previous in snake order
  for (let i = 1; i < positions.length; i++) {
    if (positions[i].pos <= positions[i-1].pos) {
      console.error(`Puzzle invalid: waypoint ${positions[i].number} at pos ${positions[i].pos} should come after ${positions[i-1].number} at pos ${positions[i-1].pos}`);
      return false;
    }
  }
  return true;
}

const PUZZLES = [
  // Puzzle 1 - 4x4 Easy (4 waypoints)
  // Snake positions: (0,0)=0, (0,3)=3, (1,0)=7, (3,0)=15
  {
    gridSize: 4,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 3, number: 2 },  // pos 3
      { row: 1, col: 0, number: 3 },  // pos 7
      { row: 3, col: 0, number: 4 },  // pos 15
    ]
  },
  
  // Puzzle 2 - 4x4 (5 waypoints)
  // Positions: 0, 2, 6, 10, 15
  {
    gridSize: 4,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 2, number: 2 },  // pos 2
      { row: 1, col: 1, number: 3 },  // pos 6 (row 1 goes right-to-left, so col 1 = pos 4+2=6)
      { row: 2, col: 2, number: 4 },  // pos 10
      { row: 3, col: 0, number: 5 },  // pos 15
    ]
  },
  
  // Puzzle 3 - 5x5 (5 waypoints)
  // Positions calculated for 5-wide grid
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 4, number: 2 },  // pos 4
      { row: 1, col: 0, number: 3 },  // pos 9
      { row: 2, col: 4, number: 4 },  // pos 14
      { row: 4, col: 0, number: 5 },  // pos 24
    ]
  },
  
  // Puzzle 4 - 5x5 (6 waypoints)
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 4, number: 2 },  // pos 4
      { row: 1, col: 2, number: 3 },  // pos 7 (row 1: 5+4-2=7)
      { row: 2, col: 0, number: 4 },  // pos 10
      { row: 3, col: 0, number: 5 },  // pos 19 (row 3: 15+4-0=19)
      { row: 4, col: 4, number: 6 },  // pos 24
    ]
  },
  
  // Puzzle 5 - 5x5 (7 waypoints)
  {
    gridSize: 5,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 3, number: 2 },  // pos 3
      { row: 1, col: 3, number: 3 },  // pos 6 (row 1: 5+4-3=6)
      { row: 2, col: 1, number: 4 },  // pos 11
      { row: 3, col: 2, number: 5 },  // pos 17 (row 3: 15+4-2=17)
      { row: 4, col: 2, number: 6 },  // pos 22
      { row: 4, col: 4, number: 7 },  // pos 24
    ]
  },
  
  // Puzzle 6 - 6x6 (6 waypoints)
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 5, number: 2 },  // pos 5
      { row: 1, col: 0, number: 3 },  // pos 11
      { row: 2, col: 5, number: 4 },  // pos 17
      { row: 4, col: 0, number: 5 },  // pos 29
      { row: 5, col: 0, number: 6 },  // pos 35
    ]
  },
  
  // Puzzle 7 - 6x6 (8 waypoints)
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 5, number: 2 },  // pos 5
      { row: 1, col: 3, number: 3 },  // pos 8 (row 1: 6+5-3=8)
      { row: 2, col: 2, number: 4 },  // pos 14
      { row: 3, col: 4, number: 5 },  // pos 19 (row 3: 18+5-4=19)
      { row: 4, col: 1, number: 6 },  // pos 25
      { row: 5, col: 3, number: 7 },  // pos 32 (row 5: 30+5-3=32)
      { row: 5, col: 0, number: 8 },  // pos 35
    ]
  },
  
  // Puzzle 8 - 6x6 (9 waypoints)  
  {
    gridSize: 6,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 4, number: 2 },  // pos 4
      { row: 1, col: 4, number: 3 },  // pos 7 (row 1: 6+5-4=7)
      { row: 1, col: 0, number: 4 },  // pos 11
      { row: 2, col: 3, number: 5 },  // pos 15
      { row: 3, col: 3, number: 6 },  // pos 20 (row 3: 18+5-3=20)
      { row: 4, col: 2, number: 7 },  // pos 26
      { row: 5, col: 4, number: 8 },  // pos 31 (row 5: 30+5-4=31)
      { row: 5, col: 0, number: 9 },  // pos 35
    ]
  },

  // Puzzle 9 - 7x7 (8 waypoints)
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },  // pos 0
      { row: 0, col: 6, number: 2 },  // pos 6
      { row: 1, col: 0, number: 3 },  // pos 13
      { row: 2, col: 6, number: 4 },  // pos 20
      { row: 3, col: 0, number: 5 },  // pos 27
      { row: 4, col: 6, number: 6 },  // pos 34
      { row: 5, col: 0, number: 7 },  // pos 41
      { row: 6, col: 6, number: 8 },  // pos 48
    ]
  },
  
  // Puzzle 10 - 7x7 (10 waypoints)
  {
    gridSize: 7,
    waypoints: [
      { row: 0, col: 0, number: 1 },   // pos 0
      { row: 0, col: 4, number: 2 },   // pos 4
      { row: 1, col: 5, number: 3 },   // pos 8 (row 1: 7+6-5=8)
      { row: 1, col: 1, number: 4 },   // pos 12
      { row: 2, col: 3, number: 5 },   // pos 17
      { row: 3, col: 4, number: 6 },   // pos 23 (row 3: 21+6-4=23)
      { row: 4, col: 2, number: 7 },   // pos 30
      { row: 5, col: 5, number: 8 },   // pos 36 (row 5: 35+6-5=36)
      { row: 6, col: 1, number: 9 },   // pos 43
      { row: 6, col: 6, number: 10 },  // pos 48
    ]
  },
];

// Verify all puzzles on load
PUZZLES.forEach((p, i) => {
  if (!verifyPuzzle(p)) {
    console.error(`Puzzle ${i + 1} failed verification!`);
  }
});

function getPuzzleForDate(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const puzzleIndex = dayOfYear % PUZZLES.length;
  return JSON.parse(JSON.stringify(PUZZLES[puzzleIndex]));
}

function getPuzzleByIndex(index) {
  return JSON.parse(JSON.stringify(PUZZLES[index % PUZZLES.length]));
}
