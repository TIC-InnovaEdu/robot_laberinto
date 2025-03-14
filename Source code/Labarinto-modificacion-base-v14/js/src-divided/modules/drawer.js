export class DrawMaze {
    constructor(Maze, ctx, cellsize, endSprite = null) {
        this.maze = Maze;
        this.ctx = ctx;
        this.cellSize = cellsize;
        this.endSprite = endSprite;
        this.map = Maze.map;
        this.ctx.lineWidth = this.cellSize / 40;
        this.collectibleSprite = new Image();
        this.collectibleSprite.src = '../images/TUERCA.png';

        this.drawEndMethod = this.endSprite != null ? 
            this.drawEndSprite.bind(this) : 
            this.drawEndFlag.bind(this);

        this.clear();
        this.drawMap();
        this.drawCollectibles();
        this.drawEndMethod();
    }

    redrawMaze(size) {
        this.cellSize = size;
        this.ctx.lineWidth = this.cellSize / 50;
        this.clear();
        this.drawMap(); // Primero dibujar el mapa
        this.drawEndMethod(); // Luego dibujar el objetivo
        this.drawCollectibles(); // Finalmente, dibujar los coleccionables
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
        this.drawEndSprite(); // 🔥 Asegura que la meta se dibuja al final, sobre todo lo demás
    }
    

    drawCollectibles() {
         // No dibujar los coleccionables hasta que se haya presionado el botón "Comenzar"
        if (!this.maze.collectibles || this.maze.collectibles.size === 0) {
            console.log("❌ No hay coleccionables para dibujar.");
            return; // Si no hay coleccionables, no se dibujan
        }

        console.log("✅ Dibujando coleccionables:", this.maze.collectibles); // 💡 Verificamos si los coleccionables están aquí

        this.clear(); // Limpiar el canvas antes de dibujar los coleccionables
        this.drawMap(); // Redibujar el mapa para evitar superposiciones
    
        this.maze.collectibles.forEach(posKey => {
            const [x, y] = posKey.split(',').map(Number);
            if (this.collectibleSprite.complete) {
                this.ctx.drawImage(
                    this.collectibleSprite,
                    x * this.cellSize + this.cellSize * 0.1,
                    y * this.cellSize + this.cellSize * 0.1,
                    this.cellSize * 0.8,
                    this.cellSize * 0.8
                );
            } else {
                this.collectibleSprite.onload = () => {
                    this.ctx.drawImage(
                        this.collectibleSprite,
                        x * this.cellSize + this.cellSize * 0.1,
                        y * this.cellSize + this.cellSize * 0.1,
                        this.cellSize * 0.8,
                        this.cellSize * 0.8
                    );
                };
            }
        });
    }
    

    removeCollectible(coord) {
        const x = coord.x * this.cellSize;
        const y = coord.y * this.cellSize;
        this.ctx.clearRect(
            x + this.cellSize * 0.1,
            y + this.cellSize * 0.1,
            this.cellSize * 0.8,
            this.cellSize * 0.8
        );
        this.drawCell(coord.x, coord.y, this.map[coord.x][coord.y]);
    }

    drawEndSprite() {
        if (!this.endSprite || !this.endSprite.complete) {
            console.error("❌ Imagen de la meta no se cargó correctamente.");
            return;
        }
        if (!this.maze.endCoord) {
            console.error("❌ No hay coordenada final en el laberinto.");
            return;
        }
    
        const coord = this.maze.endCoord;
        console.log(`✅ Dibujando la meta en (${coord.x}, ${coord.y})`, this.endSprite);
    
        const offsetLeft = this.cellSize / 50;
        const offsetRight = this.cellSize / 25;
    
        this.ctx.drawImage(
            this.endSprite,
            coord.x * this.cellSize + offsetLeft,
            coord.y * this.cellSize + offsetLeft,
            this.cellSize - offsetRight,
            this.cellSize - offsetRight
        );
    
        console.log("✅ Imagen de la meta dibujada correctamente en el canvas.");
    }
    
    

    

    drawEndFlag() {
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

    clear() {
        const canvasSize = this.cellSize * this.map.length;
        this.ctx.clearRect(0, 0, canvasSize, canvasSize);
    }
}