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