/**
 * Zip Game - Main Logic
 * Path connects numbered waypoints in order through a grid
 */

class ZipGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Game state
    this.puzzle = null;
    this.path = []; // Array of {row, col}
    this.history = [];
    this.startTime = null;
    this.isComplete = false;
    
    // Grid data
    this.grid = []; // 2D array: 'blocked', 'empty', or waypoint number
    this.waypointPositions = new Map(); // number -> {row, col}
    
    // Visual settings
    this.cellSize = 50;
    this.padding = 8;
    this.pathWidth = 0.7; // Relative to cell size
    
    // Colors (matching screenshot)
    this.colors = {
      background: '#f5f0e8',
      cellPlayable: '#f8d7d0', // Light pink
      cellBlocked: '#faf6f0', // Off-white/cream
      path: '#e85d3b', // Orange-red
      waypoint: '#1a1a1a', // Black circles
      waypointText: '#ffffff',
      gridLine: 'rgba(0,0,0,0.06)'
    };
    
    // Interaction
    this.isDragging = false;
    
    // Bind methods
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    this.setupEventListeners();
    this.setupControls();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointerleave', this.handlePointerUp);
    window.addEventListener('resize', this.handleResize);
  }
  
  setupControls() {
    document.getElementById('undoBtn').addEventListener('click', () => this.undo());
    document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      this.hideCompletion();
      this.reset();
    });
  }
  
  loadPuzzle(puzzle) {
    this.puzzle = puzzle;
    this.path = [];
    this.history = [];
    this.isComplete = false;
    this.startTime = Date.now();
    
    // Build grid
    const size = puzzle.gridSize;
    this.grid = [];
    this.waypointPositions.clear();
    
    for (let r = 0; r < size; r++) {
      this.grid[r] = [];
      for (let c = 0; c < size; c++) {
        this.grid[r][c] = 'empty';
      }
    }
    
    // Mark blocked cells
    for (const b of puzzle.blocked) {
      this.grid[b.row][b.col] = 'blocked';
    }
    
    // Mark waypoints
    for (const w of puzzle.waypoints) {
      this.grid[w.row][w.col] = w.number;
      this.waypointPositions.set(w.number, { row: w.row, col: w.col });
    }
    
    // Start path at waypoint 1
    const start = this.waypointPositions.get(1);
    if (start) {
      this.path = [{ row: start.row, col: start.col }];
    }
    
    this.handleResize();
  }
  
  handleResize() {
    if (!this.puzzle) return;
    
    const container = this.canvas.parentElement;
    const maxSize = Math.min(container.clientWidth - 24, 450);
    
    this.cellSize = Math.floor(maxSize / this.puzzle.gridSize);
    const canvasSize = this.cellSize * this.puzzle.gridSize;
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = canvasSize + 'px';
    this.canvas.style.height = canvasSize + 'px';
    
    this.render();
  }
  
  getCellFromPos(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    
    if (row < 0 || row >= this.puzzle.gridSize || col < 0 || col >= this.puzzle.gridSize) {
      return null;
    }
    
    return { row, col };
  }
  
  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    const scaleX = this.canvas.width / rect.width;
    const scaleY = this.canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }
  
  handlePointerDown(e) {
    if (this.isComplete) return;
    
    const pos = this.getPointerPos(e);
    const cell = this.getCellFromPos(pos.x, pos.y);
    
    if (cell) {
      this.isDragging = true;
      this.canvas.setPointerCapture(e.pointerId);
      this.tryExtendPath(cell);
    }
  }
  
  handlePointerMove(e) {
    if (!this.isDragging || this.isComplete) return;
    
    const pos = this.getPointerPos(e);
    const cell = this.getCellFromPos(pos.x, pos.y);
    
    if (cell) {
      this.tryExtendPath(cell);
    }
  }
  
  handlePointerUp(e) {
    this.isDragging = false;
  }
  
  tryExtendPath(cell) {
    if (this.path.length === 0) return;
    
    const last = this.path[this.path.length - 1];
    
    // Same cell - ignore
    if (cell.row === last.row && cell.col === last.col) return;
    
    // Check if going backwards (undo last move)
    if (this.path.length >= 2) {
      const prev = this.path[this.path.length - 2];
      if (cell.row === prev.row && cell.col === prev.col) {
        this.saveHistory();
        this.path.pop();
        this.render();
        return;
      }
    }
    
    // Must be adjacent (not diagonal)
    const rowDiff = Math.abs(cell.row - last.row);
    const colDiff = Math.abs(cell.col - last.col);
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      return;
    }
    
    // Can't go to blocked cell
    if (this.grid[cell.row][cell.col] === 'blocked') {
      return;
    }
    
    // Can't revisit a cell already in path
    if (this.path.some(p => p.row === cell.row && p.col === cell.col)) {
      return;
    }
    
    // Check waypoint order constraint
    const cellValue = this.grid[cell.row][cell.col];
    if (typeof cellValue === 'number') {
      // This is a waypoint - check if it's the next one we need
      const nextWaypoint = this.getNextRequiredWaypoint();
      if (cellValue !== nextWaypoint) {
        // Can only visit waypoints in order
        return;
      }
    }
    
    // Valid move - extend path
    this.saveHistory();
    this.path.push({ row: cell.row, col: cell.col });
    this.render();
    
    // Check completion
    if (this.checkCompletion()) {
      this.onComplete();
    }
  }
  
  getNextRequiredWaypoint() {
    // Find highest waypoint number in current path
    let highest = 1; // We always start at 1
    for (const p of this.path) {
      const val = this.grid[p.row][p.col];
      if (typeof val === 'number' && val > highest) {
        highest = val;
      }
    }
    return highest + 1;
  }
  
  getVisitedWaypoints() {
    const visited = new Set();
    for (const p of this.path) {
      const val = this.grid[p.row][p.col];
      if (typeof val === 'number') {
        visited.add(val);
      }
    }
    return visited;
  }
  
  saveHistory() {
    this.history.push([...this.path.map(p => ({ ...p }))]);
    // Limit history size
    if (this.history.length > 100) {
      this.history.shift();
    }
  }
  
  undo() {
    if (this.history.length === 0) return;
    this.path = this.history.pop();
    this.render();
  }
  
  reset() {
    const start = this.waypointPositions.get(1);
    if (start) {
      this.path = [{ row: start.row, col: start.col }];
    } else {
      this.path = [];
    }
    this.history = [];
    this.isComplete = false;
    this.startTime = Date.now();
    this.render();
  }
  
  showHint() {
    // Simple hint: highlight next waypoint
    const next = this.getNextRequiredWaypoint();
    const pos = this.waypointPositions.get(next);
    if (pos) {
      // Flash the waypoint
      this.flashCell(pos.row, pos.col);
    }
  }
  
  flashCell(row, col) {
    let flashes = 0;
    const flash = () => {
      flashes++;
      this.render();
      // Draw highlight
      const ctx = this.ctx;
      const x = col * this.cellSize;
      const y = row * this.cellSize;
      ctx.fillStyle = flashes % 2 === 1 ? 'rgba(232, 93, 59, 0.3)' : 'transparent';
      ctx.fillRect(x, y, this.cellSize, this.cellSize);
      
      if (flashes < 6) {
        setTimeout(flash, 150);
      }
    };
    flash();
  }
  
  checkCompletion() {
    // Must have visited all waypoints in order
    const totalWaypoints = this.puzzle.waypoints.length;
    const visited = this.getVisitedWaypoints();
    
    if (visited.size !== totalWaypoints) return false;
    
    // Check all numbers 1 to totalWaypoints are visited
    for (let i = 1; i <= totalWaypoints; i++) {
      if (!visited.has(i)) return false;
    }
    
    // Path must end at last waypoint
    const lastPos = this.path[this.path.length - 1];
    const lastWaypointPos = this.waypointPositions.get(totalWaypoints);
    if (lastPos.row !== lastWaypointPos.row || lastPos.col !== lastWaypointPos.col) {
      return false;
    }
    
    return true;
  }
  
  onComplete() {
    this.isComplete = true;
    
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    document.getElementById('completionStats').textContent = `Time: ${timeStr}`;
    
    // Animate then show overlay
    this.render();
    setTimeout(() => {
      document.getElementById('completionOverlay').classList.add('visible');
    }, 600);
  }
  
  hideCompletion() {
    document.getElementById('completionOverlay').classList.remove('visible');
  }
  
  render() {
    const ctx = this.ctx;
    const size = this.puzzle.gridSize;
    
    // Clear with background
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw cells
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const x = c * this.cellSize;
        const y = r * this.cellSize;
        const val = this.grid[r][c];
        
        // Cell background
        if (val === 'blocked') {
          ctx.fillStyle = this.colors.cellBlocked;
        } else {
          ctx.fillStyle = this.colors.cellPlayable;
        }
        
        // Draw with slight gap for grid effect
        const gap = 1;
        ctx.fillRect(x + gap, y + gap, this.cellSize - gap * 2, this.cellSize - gap * 2);
      }
    }
    
    // Draw path
    if (this.path.length > 0) {
      this.drawPath();
    }
    
    // Draw waypoints on top
    for (const w of this.puzzle.waypoints) {
      this.drawWaypoint(w.row, w.col, w.number);
    }
  }
  
  drawPath() {
    const ctx = this.ctx;
    const pathWidth = this.cellSize * this.pathWidth;
    
    ctx.strokeStyle = this.colors.path;
    ctx.fillStyle = this.colors.path;
    ctx.lineWidth = pathWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    if (this.path.length === 1) {
      // Single cell - draw filled rounded rect
      const p = this.path[0];
      const x = p.col * this.cellSize + this.cellSize / 2;
      const y = p.row * this.cellSize + this.cellSize / 2;
      ctx.beginPath();
      ctx.arc(x, y, pathWidth / 2, 0, Math.PI * 2);
      ctx.fill();
      return;
    }
    
    // Draw path as thick line through cell centers
    ctx.beginPath();
    for (let i = 0; i < this.path.length; i++) {
      const p = this.path[i];
      const x = p.col * this.cellSize + this.cellSize / 2;
      const y = p.row * this.cellSize + this.cellSize / 2;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
    
    // Draw rounded caps at start and end
    const first = this.path[0];
    const last = this.path[this.path.length - 1];
    
    ctx.beginPath();
    ctx.arc(
      first.col * this.cellSize + this.cellSize / 2,
      first.row * this.cellSize + this.cellSize / 2,
      pathWidth / 2, 0, Math.PI * 2
    );
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(
      last.col * this.cellSize + this.cellSize / 2,
      last.row * this.cellSize + this.cellSize / 2,
      pathWidth / 2, 0, Math.PI * 2
    );
    ctx.fill();
  }
  
  drawWaypoint(row, col, number) {
    const ctx = this.ctx;
    const x = col * this.cellSize + this.cellSize / 2;
    const y = row * this.cellSize + this.cellSize / 2;
    const radius = this.cellSize * 0.32;
    
    // Black circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.waypoint;
    ctx.fill();
    
    // Number
    ctx.fillStyle = this.colors.waypointText;
    ctx.font = `bold ${Math.floor(this.cellSize * 0.35)}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x, y + 1);
  }
}

// Initialize game
const game = new ZipGame('gameCanvas');
const puzzle = getPuzzleForDate();
game.loadPuzzle(puzzle);
