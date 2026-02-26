<<<<<<< HEAD
//Archivo para la logica del juego
class Tetris{
    constructor(canvasid){
        this.canvas = document.getElementById(canvasid);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20; //Tamaño de cada cuadro

        this.width = 10;
        this.height = 20;
        this.board = Array(this.height).fill(0);

        this.score = 0;
        this.gameOver = false;

        this.pieces = [
            // I piece
            [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
        [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
        
        ]
    }
}
=======
/**
 * Tetris - Versión Corregida (Ajuste de bordes y escalado dinámico)
 */
class Tetris {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 1. AJUSTE DINÁMICO: Se adapta a cualquier tamaño de canvas en el HTML
        this.width = 10;
        this.height = 20;
        this.gridSize = this.canvas.width / this.width; 
        
        this.board = Array(this.height).fill(0);
        this.score = 0;
        this.gameOver = false;

        this.colors = [
            null,
            '#00f2ff', // I
            '#fffc00', // O
            '#a000ff', // T
            '#00ff00', // S
            '#ff0000', // Z
            '#0033ff', // J
            '#ff8000'  // L
        ];

        this.pieces = [
            // I piece
            [[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]], [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]], [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
            // O piece
            [[[2,2],[2,2]], [[2,2],[2,2]], [[2,2],[2,2]], [[2,2],[2,2]]],
            // T piece
            [[[0,3,0],[3,3,3],[0,0,0]], [[0,3,0],[0,3,3],[0,3,0]], [[0,0,0],[3,3,3],[0,3,0]], [[0,3,0],[3,3,0],[0,3,0]]],
            // S piece
            [[[0,4,4],[4,4,0],[0,0,0]], [[0,4,0],[0,4,4],[0,0,4]], [[0,0,0],[0,4,4],[4,4,0]], [[4,0,0],[4,4,0],[0,4,0]]],
            // Z piece
            [[[5,5,0],[0,5,5],[0,0,0]], [[0,0,5],[0,5,5],[0,5,0]], [[0,0,0],[5,5,0],[0,5,5]], [[0,5,0],[5,5,0],[5,0,0]]],
            // J piece
            [[[6,0,0],[6,6,6],[0,0,0]], [[0,6,6],[0,6,0],[0,6,0]], [[0,0,0],[6,6,6],[0,0,6]], [[0,6,0],[0,6,0],[6,6,0]]],
            // L piece
            [[[0,0,7],[7,7,7],[0,0,0]], [[0,7,0],[0,7,0],[0,7,7]], [[0,0,0],[7,7,7],[7,0,0]], [[7,7,0],[0,7,0],[0,7,0]]]
        ];

        this.spawnPiece();
    }

    spawnPiece() {
        this.pieceIndex = Math.floor(Math.random() * this.pieces.length);
        this.currentRotation = 0;
        this.currentPiece = this.pieces[this.pieceIndex][this.currentRotation];
        
        // Posición inicial centrada
        this.currentX = Math.floor((this.width - this.currentPiece[0].length) / 2);
        this.currentY = 0;

        if (!this.isValidPosition(this.currentPiece, this.currentX, this.currentY)) {
            this.gameOver = true;
        }
    }

    // CORRECCIÓN: Ahora ignora las celdas vacías (0) de la matriz de la pieza
    isValidPosition(piece, x, y) {
        for (let py = 0; py < piece.length; py++) {
            for (let px = 0; px < piece[py].length; px++) {
                if (!piece[py][px]) continue; 

                let boardX = x + px;
                let boardY = y + py;

                // Límites de las paredes y el suelo
                if (boardX < 0 || boardX >= this.width || boardY >= this.height) return false;
                
                // Colisión con bloques ya puestos
                if (boardY >= 0 && (this.board[boardY] & (1 << boardX))) return false;
            }
        }
        return true;
    }

    lockPiece() {
        for (let py = 0; py < this.currentPiece.length; py++) {
            for (let px = 0; px < this.currentPiece[py].length; px++) {
                if (!this.currentPiece[py][px]) continue;
                let boardY = this.currentY + py;
                if (boardY >= 0) {
                    this.board[boardY] |= (1 << (this.currentX + px));
                }
            }
        }
        this.clearLines();
        this.spawnPiece();
    }

    clearLines() {
        let fullLine = (1 << this.width) - 1;
        let linesCleared = 0;
        for (let y = this.height - 1; y >= 0; y--) {
            if (this.board[y] === fullLine) {
                this.board.splice(y, 1);
                this.board.unshift(0);
                linesCleared++;
                y++;
            }
        }
        const points = [0, 100, 300, 500, 800];
        this.score += points[Math.min(linesCleared, 4)];
        console.log("Score:", this.score);
    }

    rotate() {
        let nextRotation = (this.currentRotation + 1) % 4;
        let rotatedPiece = this.pieces[this.pieceIndex][nextRotation];
        const kicks = [0, -1, 1, -2, 2];
        
        for (let kick of kicks) {
            if (this.isValidPosition(rotatedPiece, this.currentX + kick, this.currentY)) {
                this.currentX += kick;
                this.currentRotation = nextRotation;
                this.currentPiece = rotatedPiece;
                return;
            }
        }
    }

    moveDown() {
        if (this.isValidPosition(this.currentPiece, this.currentX, this.currentY + 1)) {
            this.currentY++;
            return true;
        }
        this.lockPiece();
        return false;
    }

    render() {
        // Limpiar el canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dibujar bloques fijos (el tablero)
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.board[y] & (1 << x)) {
                    this.drawSquare(x, y, '#0ad'); // Color para bloques fijos
                }
            }
        }

        // Dibujar la pieza que está cayendo
        const pieceColor = this.colors[this.pieceIndex + 1];
        for (let py = 0; py < this.currentPiece.length; py++) {
            for (let px = 0; px < this.currentPiece[py].length; px++) {
                if (this.currentPiece[py][px]) {
                    this.drawSquare(this.currentX + px, this.currentY + py, pieceColor);
                }
            }
        }
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
            this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = "bold 24px Arial";
            this.ctx.textAlign = "center";
            this.ctx.fillText("GAME OVER", this.canvas.width/2, this.canvas.height/2);
        }
    }

    drawSquare(x, y, color) {
        this.ctx.fillStyle = color;
        // El cuadrado relleno
        this.ctx.fillRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
        // El borde para que se distingan los bloques
        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x * this.gridSize, y * this.gridSize, this.gridSize, this.gridSize);
    }
}

// --- Lógica de Control y Loop Principal ---
const game = new Tetris('tetris');
let lastTime = 0;
let dropCounter = 0;
let dropInterval = 1000;

function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if (dropCounter > dropInterval) {
        game.moveDown();
        dropCounter = 0;
    }

    game.render();
    if (!game.gameOver) requestAnimationFrame(update);
}

document.addEventListener('keydown', event => {
    if (game.gameOver) return;
    
    // CORRECCIÓN: Quitamos la validación extra que impedía tocar bordes
    if (event.key === 'ArrowLeft') {
        if (game.isValidPosition(game.currentPiece, game.currentX - 1, game.currentY)) {
            game.currentX--;
        }
    }
    if (event.key === 'ArrowRight') {
        if (game.isValidPosition(game.currentPiece, game.currentX + 1, game.currentY)) {
            game.currentX++;
        }
    }
    if (event.key === 'ArrowDown') {
        game.moveDown();
    }
    if (event.key === 'ArrowUp') {
        game.rotate();
    }
});

update();
>>>>>>> Feacture/Jozth
