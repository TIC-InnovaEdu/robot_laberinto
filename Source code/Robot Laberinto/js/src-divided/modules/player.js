export class Player {
    constructor(maze, canvas, cellSize, onComplete, sprite = null, controlType = 'wasd') {
        this.maze = maze;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.cellSize = cellSize;
        this.halfCellSize = cellSize / 2;
        this.sprite = sprite;
        this.controlType = controlType;
        this.onComplete = onComplete;
        this.moves = 0;
        this.cellCoords = {
            x: maze.startCoord.x,
            y: maze.startCoord.y
        };
        this.map = maze.map;
        this.mazeDrawer = null;

        this.drawSprite(this.cellCoords);
        this.bindKeyDown();
    }

    setMazeDrawer(drawer) {
        this.mazeDrawer = drawer;
    }

    redrawPlayer(cellSize) {
        this.cellSize = cellSize;
        this.halfCellSize = cellSize / 2;
        this.drawSprite(this.cellCoords);
    }

    drawSprite(coord) {
        if (this.sprite) {
            this.drawSpriteImg(coord);
        } else {
            this.drawSpriteCircle(coord);
        }
    }

    drawSpriteCircle(coord) {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.controlType === 'wasd' ? "blue" : "red";
        this.ctx.arc(
            (coord.x + 1) * this.cellSize - this.halfCellSize,
            (coord.y + 1) * this.cellSize - this.halfCellSize,
            this.halfCellSize - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        this.checkVictory(coord);
    }

    drawSpriteImg(coord) {
        const offset = this.cellSize / 50;
        this.ctx.drawImage(
            this.sprite,
            coord.x * this.cellSize + offset,
            coord.y * this.cellSize + offset,
            this.cellSize - offset * 2,
            this.cellSize - offset * 2
        );
        this.checkVictory(coord);
    }

    checkVictory(coord) {
        if (coord.x === this.maze.endCoord.x && coord.y === this.maze.endCoord.y) {
            this.onComplete(this.moves);
            this.unbindKeyDown();
        }
    }

    removeSprite(coord) {
        // Clear only the cell where the sprite was
        const offset = this.cellSize / 50;
        this.ctx.clearRect(
            coord.x * this.cellSize + offset,
            coord.y * this.cellSize + offset,
            this.cellSize - offset * 2,
            this.cellSize - offset * 2
        );
        
        // Redraw the maze walls for this cell
        if (this.mazeDrawer) {
            this.mazeDrawer.drawCell(coord.x, coord.y, this.map[coord.x][coord.y]);
        }
    }

    check(e) {
        const cell = this.map[this.cellCoords.x][this.cellCoords.y];
        const controls = {
            wasd: {
                87: 'n', // W
                83: 's', // S
                65: 'w', // A
                68: 'e'  // D
            },
            arrows: {
                38: 'n', // Up
                40: 's', // Down
                37: 'w', // Left
                39: 'e'  // Right
            }
        };

        const direction = controls[this.controlType][e.keyCode];
        if (direction && cell[direction]) {
            this.moves++;
            this.removeSprite(this.cellCoords);
            const move = {
                n: {x: 0, y: -1},
                s: {x: 0, y: 1},
                w: {x: -1, y: 0},
                e: {x: 1, y: 0}
            }[direction];

            this.cellCoords = {
                x: this.cellCoords.x + move.x,
                y: this.cellCoords.y + move.y
            };
            this.drawSprite(this.cellCoords);
        }
    }

    bindKeyDown() {
        this.check = this.check.bind(this);
        window.addEventListener("keydown", this.check);
    }

    unbindKeyDown() {
        window.removeEventListener("keydown", this.check);
    }
}