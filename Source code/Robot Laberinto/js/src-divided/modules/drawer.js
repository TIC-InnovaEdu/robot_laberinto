export class DrawMaze {
    constructor(Maze, ctx, cellsize, endSprite = null) {
        this.maze = Maze;
        this.ctx = ctx;
        this.cellSize = cellsize;
        this.endSprite = endSprite;
        // Importante: Obtener el mapa usando el método map() del objeto Maze
        this.map = Maze.map;
        this.ctx.lineWidth = this.cellSize / 40;
        this.drawEndMethod = this.endSprite != null ? this.drawEndSprite.bind(this) : this.drawEndFlag.bind(this);

        this.clear();
        this.drawMap();
        this.drawEndMethod();
    }

    redrawMaze(size) {
        this.cellSize = size;
        this.ctx.lineWidth = this.cellSize / 50;
        this.clear();
        this.drawMap();
        this.drawEndMethod();
    }

    drawCell(xCord, yCord, cell) {
        const x = xCord * this.cellSize;
        const y = yCord * this.cellSize;

        if (cell.n == false) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x + this.cellSize, y);
            this.ctx.stroke();
        }
        if (cell.s === false) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + this.cellSize);
            this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
            this.ctx.stroke();
        }
        if (cell.e === false) {
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.cellSize, y);
            this.ctx.lineTo(x + this.cellSize, y + this.cellSize);
            this.ctx.stroke();
        }
        if (cell.w === false) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            this.ctx.lineTo(x, y + this.cellSize);
            this.ctx.stroke();
        }
    }

    drawMap() {
        for (let x = 0; x < this.map.length; x++) {
            for (let y = 0; y < this.map[x].length; y++) {
                this.drawCell(x, y, this.map[x][y]);
            }
        }
    }

    drawEndFlag() {
        // Importante: Obtener las coordenadas finales usando las propiedades del objeto maze
        const coord = this.maze.endCoord;
        const gridSize = 4;
        const fraction = this.cellSize / gridSize - 2;
        let colorSwap = true;
        
        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0) {
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++) {
                this.ctx.beginPath();
                this.ctx.rect(
                    coord.x * this.cellSize + x * fraction + 4.5,
                    coord.y * this.cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                this.ctx.fillStyle = colorSwap ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)";
                this.ctx.fill();
                colorSwap = !colorSwap;
            }
        }
    }

    drawEndSprite() {
        const coord = this.maze.endCoord;
        const offsetLeft = this.cellSize / 50;
        const offsetRight = this.cellSize / 25;
        
        this.ctx.drawImage(
            this.endSprite,
            2,
            2,
            this.endSprite.width,
            this.endSprite.height,
            coord.x * this.cellSize + offsetLeft,
            coord.y * this.cellSize + offsetLeft,
            this.cellSize - offsetRight,
            this.cellSize - offsetRight
        );
    }

    clear() {
        const canvasSize = this.cellSize * this.map.length;
        this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
}