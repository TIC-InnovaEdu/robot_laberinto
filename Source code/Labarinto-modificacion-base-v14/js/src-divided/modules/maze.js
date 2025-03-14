import { rand } from './utils.js';

export class Maze {
    static #DIRECTIONS = Object.freeze({
        NORTH: 'n',
        SOUTH: 's',
        EAST: 'e',
        WEST: 'w'
    });

    static #DIRECTION_MODIFIERS = Object.freeze({
        n: { y: -1, x: 0, opposite: 's' },
        s: { y: 1, x: 0, opposite: 'n' },
        e: { y: 0, x: 1, opposite: 'w' },
        w: { y: 0, x: -1, opposite: 'e' }
    });

    #width;
    #height;
    #startCoord;
    #endCoord;
    #mazeMap;
    #directions;
    #collectibles;
    #numCollectibles;

    constructor(width, height, numCollectibles = 3) {
        this.#validateDimensions(width, height);
        this.#width = width;
        this.#height = height;
        this.#directions = Object.values(Maze.#DIRECTIONS);
        this.#mazeMap = [];
        this.#numCollectibles = numCollectibles;
        this.#collectibles = new Set();
        
        this.#initializeMaze();
    }

    #validateDimensions(width, height) {
        if (!Number.isInteger(width) || !Number.isInteger(height) ||
            width < 5 || height < 5) {
            throw new Error('Las dimensiones del laberinto deben ser números enteros mayores o iguales a 5');
        }
    }

    #initializeMaze() {
        this.#generateMap();
        this.#setStartAndEndPositions();
        this.#createMaze();
        this.#placeCollectibles();
    }

    #generateMap() {
        this.#mazeMap = Array.from({ length: this.#height }, () =>
            Array.from({ length: this.#width }, () => ({
                n: false, s: false, e: false, w: false,
                visited: false
            }))
        );
    }

    #setStartAndEndPositions() {
        const corners = this.#getCornerPositions();
        const availableCorners = [...corners];
    
        if (availableCorners.length < 2) {
            console.error("Error: No hay suficientes esquinas para establecer inicio y fin.");
            return;
        }
    
        const startIndex = rand(availableCorners.length);
        this.#startCoord = availableCorners[startIndex];
        availableCorners.splice(startIndex, 1);
    
        const endIndex = rand(availableCorners.length);
        this.#endCoord = availableCorners[endIndex];
    
        console.log(`Inicio del laberinto en (${this.#startCoord.x}, ${this.#startCoord.y})`);
        console.log(`Final del laberinto en (${this.#endCoord.x}, ${this.#endCoord.y})`);
    }
    
    #getCornerPositions() {
        return [
            { x: 0, y: 0 },
            { x: 0, y: this.#height - 1 },
            { x: this.#width - 1, y: 0 },
            { x: this.#width - 1, y: this.#height - 1 }
        ];
    }

    #createMaze() {
        const stack = [this.#startCoord];
        let cellsVisited = 1;
        const totalCells = this.#width * this.#height;

        this.#mazeMap[this.#startCoord.x][this.#startCoord.y].visited = true;

        while (cellsVisited < totalCells) {
            const currentPosition = stack[stack.length - 1];
            const neighbors = this.#getUnvisitedNeighbors(currentPosition);

            if (neighbors.length > 0) {
                const next = neighbors[rand(neighbors.length)];
                this.#connectCells(currentPosition, next.coord, next.direction);
                stack.push(next.coord);
                this.#mazeMap[next.coord.x][next.coord.y].visited = true;
                cellsVisited++;
            } else {
                stack.pop();
            }
        }
    }

    #placeCollectibles() {
        this.#collectibles.clear(); // Limpiar coleccionables previos
        const positions = new Set();
    
        while (positions.size < this.#numCollectibles) {
            const x = Math.floor(Math.random() * this.#width);
            const y = Math.floor(Math.random() * this.#height);
            const posKey = `${x},${y}`;
    
            // Validar que la celda tenga al menos un camino abierto
            const cell = this.#mazeMap[x][y];
            const hasOpenPath = cell.n || cell.s || cell.e || cell.w;
    
            if (hasOpenPath &&
                (x !== this.#startCoord.x || y !== this.#startCoord.y) &&
                (x !== this.#endCoord.x || y !== this.#endCoord.y)) {
                positions.add(posKey);
            }
        }
    
        this.#collectibles = positions;
        // 💡 Agregar un log para ver si las tuercas se están generando
        console.log("✅ Tuercas generadas:", this.#collectibles);
    }
    
    

    #getUnvisitedNeighbors({ x, y }) {
        return this.#directions
            .map(dir => {
                const nx = x + Maze.#DIRECTION_MODIFIERS[dir].x;
                const ny = y + Maze.#DIRECTION_MODIFIERS[dir].y;
                return this.#isValidMove(nx, ny) ? 
                    { coord: { x: nx, y: ny }, direction: dir } : null;
            })
            .filter(Boolean);
    }

    #isValidMove(x, y) {
        return x >= 0 && x < this.#width && 
               y >= 0 && y < this.#height && 
               !this.#mazeMap[x][y].visited;
    }

    #connectCells(current, next, direction) {
        this.#mazeMap[current.x][current.y][direction] = true;
        this.#mazeMap[next.x][next.y][Maze.#DIRECTION_MODIFIERS[direction].opposite] = true;
    }

    get map() {
        return this.#mazeMap;
    }

    get startCoord() {
        return { ...this.#startCoord };
    }

    get endCoord() {
        return { ...this.#endCoord };
    }

    get collectibles() {
        return this.#collectibles;
    }
}