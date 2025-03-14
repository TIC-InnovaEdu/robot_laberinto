import { rand } from './utils.js';

/**
 * Clase que representa un laberinto
 */
export class Maze {
    // Constantes privadas estáticas
    static #CORNER_POSITIONS = Object.freeze({
        TOP_LEFT: { x: 0, y: 0 },
        TOP_RIGHT: { x: 1, y: 0 },
        BOTTOM_LEFT: { x: 0, y: 1 },
        BOTTOM_RIGHT: { x: 1, y: 1 }
    });

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

    // Propiedades privadas
    #width;
    #height;
    #startCoord;
    #endCoord;
    #mazeMap;
    #directions;

    /**
     * Constructor del laberinto
     * @param {number} width - Ancho del laberinto
     * @param {number} height - Alto del laberinto
     */
    constructor(width, height) {
        this.#validateDimensions(width, height);
        
        this.#width = width;
        this.#height = height;
        this.#directions = Object.values(Maze.#DIRECTIONS);
        this.#mazeMap = [];
        
        this.#initializeMaze();
    }

    /**
     * Valida las dimensiones del laberinto
     * @private
     * @throws {Error} Si las dimensiones son inválidas
     */
    #validateDimensions(width, height) {
        if (!Number.isInteger(width) || !Number.isInteger(height) ||
            width < 5 || height < 5) {
            throw new Error('Las dimensiones del laberinto deben ser números enteros mayores o iguales a 5');
        }
    }

    /**
     * Inicializa el laberinto
     * @private
     */
    #initializeMaze() {
        this.#generateMap();
        this.#setStartAndEndPositions();
        this.#createMaze();
    }

    /**
     * Genera la estructura inicial del mapa
     * @private
     */
    #generateMap() {
        this.#mazeMap = Array.from({ length: this.#height }, () =>
            Array.from({ length: this.#width }, () => ({
                n: false, s: false, e: false, w: false,
                visited: false
            }))
        );
    }

    /**
     * Establece las posiciones de inicio y fin asegurando que no coincidan
     * @private
     */
    #setStartAndEndPositions() {
        const corners = this.#getCornerPositions();
        const availableCorners = [...corners];
        
        // Seleccionar posición inicial aleatoria
        const startIndex = rand(availableCorners.length);
        this.#startCoord = availableCorners[startIndex];
        availableCorners.splice(startIndex, 1);
        
        // Seleccionar posición final de las restantes
        const endIndex = rand(availableCorners.length);
        this.#endCoord = availableCorners[endIndex];
    }

    /**
     * Obtiene las posiciones de las esquinas ajustadas al tamaño del laberinto
     * @private
     * @returns {Array<{x: number, y: number}>}
     */
    #getCornerPositions() {
        return [
            { x: 0, y: 0 },
            { x: 0, y: this.#height - 1 },
            { x: this.#width - 1, y: 0 },
            { x: this.#width - 1, y: this.#height - 1 }
        ];
    }

    /**
     * Crea el laberinto usando el algoritmo de backtracking
     * @private
     */
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

    /**
     * Obtiene los vecinos no visitados de una celda
     * @private
     * @param {{x: number, y: number}} position
     * @returns {Array<{coord: {x: number, y: number}, direction: string}>}
     */
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

    /**
     * Verifica si un movimiento es válido
     * @private
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    #isValidMove(x, y) {
        return x >= 0 && x < this.#width && 
               y >= 0 && y < this.#height && 
               !this.#mazeMap[x][y].visited;
    }

    /**
     * Conecta dos celdas del laberinto
     * @private
     * @param {{x: number, y: number}} current
     * @param {{x: number, y: number}} next
     * @param {string} direction
     */
    #connectCells(current, next, direction) {
        this.#mazeMap[current.x][current.y][direction] = true;
        this.#mazeMap[next.x][next.y][Maze.#DIRECTION_MODIFIERS[direction].opposite] = true;
    }

    // Getters públicos
    get map() {
        return this.#mazeMap;
    }

    get startCoord() {
        return { ...this.#startCoord };
    }

    get endCoord() {
        return { ...this.#endCoord };
    }
}