/**
 * Zip Game - Main Game Logic
 */

class ZipGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // Game state
    this.puzzle = null;
    this.nodes = [];
    this.connections = []; // Array of [nodeIndex1, nodeIndex2]
    this.history = []; // For undo
    this.startTime = null;
    this.isComplete = false;
    
    // Visual settings
    this.cellSize = 60;
    this.nodeRadius = 12;
    this.lineWidth = 4;
    this.padding = 40;
    
    // Colors
    this.colors = {
      background: '#fafafa',
      node: '#888',
      nodeHover: '#666',
      nodeFilled: '#4a90d9',
      arrow: '#666',
      line: '#aaa',
      lineComplete: '#4a90d9',
      error: '#e74c3c'
    };
    
    // Interaction state
    this.isDragging = false;
    this.dragStartNode = null;
    this.currentPos = null;
    this.hoveredNode = null;
    
    // Bind methods
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleResize = this.handleResize.bind(this);
    
    // Setup
    this.setupEventListeners();
    this.setupControls();
    this.updateDateDisplay();
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
    document.getElementById('resetBtn').addEventListener('click', () => this.reset());
    document.getElementById('playAgainBtn').addEventListener('click', () => {
      this.hideCompletion();
      this.reset();
    });
  }
  
  updateDateDisplay() {
    const date = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    document.getElementById('dateDisplay').textContent = date.toLocaleDateString('en-US', options);
  }
  
  loadPuzzle(puzzle) {
    this.puzzle = puzzle;
    this.nodes = puzzle.nodes.map((n, i) => ({
      ...n,
      index: i,
      x: 0,
      y: 0,
      connections: []
    }));
    this.connections = [];
    this.history = [];
    this.isComplete = false;
    this.startTime = Date.now();
    
    this.handleResize();
  }
  
  handleResize() {
    const container = this.canvas.parentElement;
    const maxSize = Math.min(container.clientWidth - 40, 500);
    
    this.cellSize = Math.floor((maxSize - this.padding * 2) / this.puzzle.gridSize);
    const canvasSize = this.cellSize * this.puzzle.gridSize + this.padding * 2;
    
    this.canvas.width = canvasSize;
    this.canvas.height = canvasSize;
    this.canvas.style.width = canvasSize + 'px';
    this.canvas.style.height = canvasSize + 'px';
    
    // Update node positions
    this.nodes.forEach(node => {
      node.x = this.padding + node.col * this.cellSize + this.cellSize / 2;
      node.y = this.padding + node.row * this.cellSize + this.cellSize / 2;
    });
    
    this.render();
  }
  
  getNodeAtPosition(x, y) {
    const hitRadius = this.cellSize / 2;
    for (const node of this.nodes) {
      const dx = x - node.x;
      const dy = y - node.y;
      if (dx * dx + dy * dy < hitRadius * hitRadius) {
        return node;
      }
    }
    return null;
  }
  
  getPointerPos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }
  
  handlePointerDown(e) {
    if (this.isComplete) return;
    
    const pos = this.getPointerPos(e);
    const node = this.getNodeAtPosition(pos.x, pos.y);
    
    if (node) {
      // Check if clicking on an existing connection to remove it
      const connectionIndex = this.findConnectionAtNode(node);
      if (connectionIndex !== -1 && node.connections.length > 0) {
        // Start dragging from this node
        this.isDragging = true;
        this.dragStartNode = node;
        this.currentPos = pos;
        this.canvas.setPointerCapture(e.pointerId);
      } else {
        this.isDragging = true;
        this.dragStartNode = node;
        this.currentPos = pos;
        this.canvas.setPointerCapture(e.pointerId);
      }
    }
    
    this.render();
  }
  
  handlePointerMove(e) {
    const pos = this.getPointerPos(e);
    
    if (this.isDragging) {
      this.currentPos = pos;
      this.hoveredNode = this.getNodeAtPosition(pos.x, pos.y);
      this.render();
    } else {
      const node = this.getNodeAtPosition(pos.x, pos.y);
      if (node !== this.hoveredNode) {
        this.hoveredNode = node;
        this.render();
      }
    }
  }
  
  handlePointerUp(e) {
    if (this.isDragging && this.dragStartNode) {
      const pos = this.getPointerPos(e);
      const endNode = this.getNodeAtPosition(pos.x, pos.y);
      
      if (endNode && endNode !== this.dragStartNode) {
        this.tryConnect(this.dragStartNode, endNode);
      }
    }
    
    this.isDragging = false;
    this.dragStartNode = null;
    this.currentPos = null;
    this.render();
  }
  
  tryConnect(node1, node2) {
    // Check if already connected
    const existingConnection = this.connections.findIndex(
      c => (c[0] === node1.index && c[1] === node2.index) ||
           (c[0] === node2.index && c[1] === node1.index)
    );
    
    if (existingConnection !== -1) {
      // Remove connection
      this.removeConnection(existingConnection);
      return;
    }
    
    // Check if connection is valid
    if (!this.isValidConnection(node1, node2)) {
      this.shakeNode(node2);
      return;
    }
    
    // Add connection
    this.addConnection(node1.index, node2.index);
    
    // Check for completion
    if (this.checkCompletion()) {
      this.onComplete();
    }
  }
  
  isValidConnection(node1, node2) {
    // Must be adjacent (not diagonal)
    const rowDiff = Math.abs(node1.row - node2.row);
    const colDiff = Math.abs(node1.col - node2.col);
    
    if (!((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1))) {
      return false;
    }
    
    // Check node connection limits (max 2)
    if (node1.connections.length >= 2 || node2.connections.length >= 2) {
      return false;
    }
    
    // Check directional constraints
    const direction1to2 = this.getDirection(node1, node2);
    const direction2to1 = this.getDirection(node2, node1);
    
    if (!this.canConnectInDirection(node1, direction1to2)) {
      return false;
    }
    if (!this.canConnectInDirection(node2, direction2to1)) {
      return false;
    }
    
    return true;
  }
  
  getDirection(from, to) {
    if (to.row < from.row) return 'up';
    if (to.row > from.row) return 'down';
    if (to.col < from.col) return 'left';
    if (to.col > from.col) return 'right';
    return null;
  }
  
  canConnectInDirection(node, direction) {
    // Neutral nodes (empty directions array) can connect in any direction
    if (node.directions.length === 0) return true;
    return node.directions.includes(direction);
  }
  
  addConnection(index1, index2) {
    this.history.push([...this.connections.map(c => [...c])]);
    this.connections.push([index1, index2]);
    this.nodes[index1].connections.push(index2);
    this.nodes[index2].connections.push(index1);
  }
  
  removeConnection(connectionIndex) {
    this.history.push([...this.connections.map(c => [...c])]);
    const [index1, index2] = this.connections[connectionIndex];
    this.connections.splice(connectionIndex, 1);
    this.nodes[index1].connections = this.nodes[index1].connections.filter(i => i !== index2);
    this.nodes[index2].connections = this.nodes[index2].connections.filter(i => i !== index1);
  }
  
  findConnectionAtNode(node) {
    return this.connections.findIndex(
      c => c[0] === node.index || c[1] === node.index
    );
  }
  
  undo() {
    if (this.history.length === 0) return;
    
    const previousState = this.history.pop();
    this.connections = previousState;
    
    // Rebuild node connections
    this.nodes.forEach(node => node.connections = []);
    this.connections.forEach(([i1, i2]) => {
      this.nodes[i1].connections.push(i2);
      this.nodes[i2].connections.push(i1);
    });
    
    this.render();
  }
  
  reset() {
    this.connections = [];
    this.history = [];
    this.nodes.forEach(node => node.connections = []);
    this.isComplete = false;
    this.startTime = Date.now();
    this.render();
  }
  
  checkCompletion() {
    // All nodes must have exactly 2 connections, except 2 endpoints with 1
    const endpoints = this.nodes.filter(n => n.connections.length === 1);
    const midpoints = this.nodes.filter(n => n.connections.length === 2);
    const unconnected = this.nodes.filter(n => n.connections.length === 0);
    
    if (unconnected.length > 0) return false;
    if (endpoints.length !== 2) return false;
    if (midpoints.length !== this.nodes.length - 2) return false;
    
    // Check path is continuous (all nodes connected in one path)
    const visited = new Set();
    const queue = [endpoints[0].index];
    
    while (queue.length > 0) {
      const current = queue.shift();
      if (visited.has(current)) continue;
      visited.add(current);
      
      for (const neighbor of this.nodes[current].connections) {
        if (!visited.has(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    
    return visited.size === this.nodes.length;
  }
  
  onComplete() {
    this.isComplete = true;
    const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
    
    document.getElementById('completionStats').textContent = `Time: ${timeStr} • Moves: ${this.connections.length}`;
    
    setTimeout(() => {
      document.getElementById('completionOverlay').classList.add('visible');
    }, 500);
    
    this.render();
  }
  
  hideCompletion() {
    document.getElementById('completionOverlay').classList.remove('visible');
  }
  
  shakeNode(node) {
    // Visual feedback for invalid move
    const originalX = node.x;
    let shakeCount = 0;
    const shake = () => {
      shakeCount++;
      node.x = originalX + (shakeCount % 2 === 0 ? 3 : -3);
      this.render();
      if (shakeCount < 6) {
        requestAnimationFrame(shake);
      } else {
        node.x = originalX;
        this.render();
      }
    };
    shake();
  }
  
  render() {
    const ctx = this.ctx;
    
    // Clear
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw connections
    ctx.strokeStyle = this.isComplete ? this.colors.lineComplete : this.colors.line;
    ctx.lineWidth = this.lineWidth;
    ctx.lineCap = 'round';
    
    for (const [i1, i2] of this.connections) {
      const n1 = this.nodes[i1];
      const n2 = this.nodes[i2];
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    }
    
    // Draw drag line
    if (this.isDragging && this.dragStartNode && this.currentPos) {
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
      ctx.beginPath();
      ctx.moveTo(this.dragStartNode.x, this.dragStartNode.y);
      ctx.lineTo(this.currentPos.x, this.currentPos.y);
      ctx.stroke();
    }
    
    // Draw nodes
    for (const node of this.nodes) {
      const isFilled = node.connections.length > 0;
      const isHovered = node === this.hoveredNode;
      const isEndpoint = node.connections.length === 1;
      
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
      
      if (isFilled) {
        ctx.fillStyle = this.isComplete ? this.colors.lineComplete : this.colors.nodeFilled;
        ctx.fill();
      } else {
        ctx.fillStyle = this.colors.background;
        ctx.fill();
        ctx.strokeStyle = isHovered ? this.colors.nodeHover : this.colors.node;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Draw direction arrows if not filled
      if (!isFilled && node.directions.length > 0) {
        this.drawDirectionArrows(node);
      }
    }
  }
  
  drawDirectionArrows(node) {
    const ctx = this.ctx;
    const arrowSize = 6;
    const offset = this.nodeRadius - 4;
    
    ctx.fillStyle = this.colors.arrow;
    ctx.strokeStyle = this.colors.arrow;
    ctx.lineWidth = 1.5;
    
    for (const dir of node.directions) {
      ctx.save();
      ctx.translate(node.x, node.y);
      
      let angle = 0;
      switch (dir) {
        case 'up': angle = -Math.PI / 2; break;
        case 'down': angle = Math.PI / 2; break;
        case 'left': angle = Math.PI; break;
        case 'right': angle = 0; break;
      }
      
      ctx.rotate(angle);
      
      // Draw small arrow pointing outward
      ctx.beginPath();
      ctx.moveTo(offset - arrowSize, -arrowSize / 2);
      ctx.lineTo(offset, 0);
      ctx.lineTo(offset - arrowSize, arrowSize / 2);
      ctx.stroke();
      
      ctx.restore();
    }
  }
}

// Initialize game
const game = new ZipGame('gameCanvas');
const puzzle = getPuzzleForDate();
game.loadPuzzle(puzzle);
