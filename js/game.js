/**
 * Zip Game - Main Logic
 * 
 * Rules:
 * 1. Fill ALL cells with one continuous path
 * 2. Visit numbered waypoints in order (1→2→3→...)
 * 3. Path cannot cross itself
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
    this.gridSize = 0;
    this.waypointPositions = new Map(); // number -> {row, col}
    this.waypointAt = new Map(); // "row,col" -> number
    this.totalCells = 0;
    
    // Visual settings
    this.cellSize = 50;
    this.pathWidth = 0.7;
    
    // Colors
    this.colors = {
      background: '#f5f0e8',
      cellEmpty: '#f8d7d0', // Light pink - unfilled
      cellFilled: '#e85d3b', // Orange - filled by path
      waypoint: '#1a1a1a',
      waypointText: '#ffffff',
      border: '#f5f0e8'
    };
    
    // Interaction
    this.isDragging = false;
    
    this.setupEventListeners();
    this.setupControls();
  }
  
  setupEventListeners() {
    this.canvas.addEventListener('pointerdown', this.handlePointerDown.bind(this));
    this.canvas.addEventListener('pointermove', this.handlePointerMove.bind(this));
    this.canvas.addEventListener('pointerup', this.handlePointerUp.bind(this));
    this.canvas.addEventListener('pointerleave', this.handlePointerUp.bind(this));
    window.addEventListener('resize', this.handleResize.bind(this));
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
    this.gridSize = puzzle.gridSize;
    this.totalCells = this.gridSize * this.gridSize;
    this.path = [];
    this.history = [];
    this.isComplete = false;
    this.startTime = Date.now();
    
    // Build waypoint maps
    this.waypointPositions.clear();
    this.waypointAt.clear();
    
    for (const w of puzzle.waypoints) {
      this.waypointPositions.set(w.number, { row: w.row, col: w.col });
      this.waypointAt.set(`${w.row},${w.col}`, w.number);
    }
    
    // Start at waypoint 1
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
    
    this.cellSize = Math.floor(maxSize / this.gridSize);
    const canvasSize = this.cellSize * this.gridSize;
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = canvasSize + 'px';
    this.canvas.style.height = canvasSize + 'px';
    
    this.render();
  }
  
  getCellFromPos(x, y) {
    const col = Math.floor(x / this.cellSize);
    const row = Math.floor(y / this.cellSize);
    
    if (row < 0 || row >= this.gridSize || col < 0 || col >= this.gridSize) {
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
  
  handlePointerUp() {
    this.isDragging = false;
  }
  
  tryExtendPath(cell) {
    if (this.path.length === 0) return;
    
    const last = this.path[this.path.length - 1];
    
    // Same cell - ignore
    if (cell.row === last.row && cell.col === last.col) return;
    
    // Check if going backwards (undo)
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
    
    // Can't revisit a cell already in path
    if (this.path.some(p => p.row === cell.row && p.col === cell.col)) {
      return;
    }
    
    // Check waypoint order constraint
    const waypointNum = this.waypointAt.get(`${cell.row},${cell.col}`);
    if (waypointNum !== undefined) {
      const nextRequired = this.getNextRequiredWaypoint();
      if (waypointNum !== nextRequired) {
        // Can only visit waypoints in order
        return;
      }
    }
    
    // Valid move
    this.saveHistory();
    this.path.push({ row: cell.row, col: cell.col });
    this.render();
    
    if (this.checkCompletion()) {
      this.onComplete();
    }
  }
  
  getNextRequiredWaypoint() {
    let highest = 1;
    for (const p of this.path) {
      const num = this.waypointAt.get(`${p.row},${p.col}`);
      if (num !== undefined && num > highest) {
        highest = num;
      }
    }
    return highest + 1;
  }
  
  saveHistory() {
    this.history.push([...this.path.map(p => ({ ...p }))]);
    if (this.history.length > 200) this.history.shift();
  }
  
  undo() {
    if (this.history.length === 0) return;
    this.path = this.history.pop();
    this.render();
  }
  
  reset() {
    const start = this.waypointPositions.get(1);
    this.path = start ? [{ row: start.row, col: start.col }] : [];
    this.history = [];
    this.isComplete = false;
    this.startTime = Date.now();
    this.render();
  }
  
  showHint() {
    const next = this.getNextRequiredWaypoint();
    const pos = this.waypointPositions.get(next);
    if (pos) this.flashCell(pos.row, pos.col);
  }
  
  flashCell(row, col) {
    let flashes = 0;
    const flash = () => {
      flashes++;
      this.render();
      const ctx = this.ctx;
      const x = col * this.cellSize;
      const y = row * this.cellSize;
      ctx.fillStyle = flashes % 2 === 1 ? 'rgba(255,255,255,0.5)' : 'transparent';
      ctx.fillRect(x, y, this.cellSize, this.cellSize);
      if (flashes < 6) setTimeout(flash, 150);
    };
    flash();
  }
  
  checkCompletion() {
    // Must fill ALL cells
    if (this.path.length !== this.totalCells) return false;
    
    // Must have visited all waypoints
    const totalWaypoints = this.puzzle.waypoints.length;
    const visited = new Set();
    for (const p of this.path) {
      const num = this.waypointAt.get(`${p.row},${p.col}`);
      if (num !== undefined) visited.add(num);
    }
    
    for (let i = 1; i <= totalWaypoints; i++) {
      if (!visited.has(i)) return false;
    }
    
    // Must end at last waypoint
    const lastPos = this.path[this.path.length - 1];
    const lastWP = this.waypointPositions.get(totalWaypoints);
    if (lastPos.row !== lastWP.row || lastPos.col !== lastWP.col) {
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
    
    // Build set of filled cells
    const filled = new Set();
    for (const p of this.path) {
      filled.add(`${p.row},${p.col}`);
    }
    
    // Clear
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw cells
    const gap = 2;
    const radius = 6;
    
    for (let r = 0; r < this.gridSize; r++) {
      for (let c = 0; c < this.gridSize; c++) {
        const x = c * this.cellSize + gap;
        const y = r * this.cellSize + gap;
        const w = this.cellSize - gap * 2;
        const h = this.cellSize - gap * 2;
        
        const isFilled = filled.has(`${r},${c}`);
        ctx.fillStyle = isFilled ? this.colors.cellFilled : this.colors.cellEmpty;
        
        // Rounded rect
        this.roundRect(ctx, x, y, w, h, radius);
        ctx.fill();
      }
    }
    
    // Draw path connections (rounded corners between cells)
    if (this.path.length > 1) {
      this.drawPathConnections();
    }
    
    // Draw waypoints
    for (const w of this.puzzle.waypoints) {
      this.drawWaypoint(w.row, w.col, w.number);
    }
  }
  
  drawPathConnections() {
    const ctx = this.ctx;
    const gap = 2;
    
    ctx.fillStyle = this.colors.cellFilled;
    
    for (let i = 0; i < this.path.length - 1; i++) {
      const curr = this.path[i];
      const next = this.path[i + 1];
      
      // Fill the gap between adjacent cells
      if (curr.row === next.row) {
        // Horizontal connection
        const minCol = Math.min(curr.col, next.col);
        const x = minCol * this.cellSize + this.cellSize - gap;
        const y = curr.row * this.cellSize + gap;
        ctx.fillRect(x, y, gap * 2, this.cellSize - gap * 2);
      } else {
        // Vertical connection
        const minRow = Math.min(curr.row, next.row);
        const x = curr.col * this.cellSize + gap;
        const y = minRow * this.cellSize + this.cellSize - gap;
        ctx.fillRect(x, y, this.cellSize - gap * 2, gap * 2);
      }
    }
  }
  
  drawWaypoint(row, col, number) {
    const ctx = this.ctx;
    const x = col * this.cellSize + this.cellSize / 2;
    const y = row * this.cellSize + this.cellSize / 2;
    const radius = this.cellSize * 0.32;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.waypoint;
    ctx.fill();
    
    ctx.fillStyle = this.colors.waypointText;
    ctx.font = `bold ${Math.floor(this.cellSize * 0.38)}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(number.toString(), x, y + 1);
  }
  
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}

// Initialize
const game = new ZipGame('gameCanvas');
const puzzle = getPuzzleForDate();
game.loadPuzzle(puzzle);
