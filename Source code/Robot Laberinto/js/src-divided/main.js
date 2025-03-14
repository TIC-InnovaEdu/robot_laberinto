import { Maze } from './modules/maze.js';
import { DrawMaze } from './modules/drawer.js';
import { Player } from './modules/player.js';
import { displayVictoryMess, toggleVisablity } from './modules/utils.js';

const mazeCanvas1 = document.getElementById("mazeCanvas1");
const mazeCanvas2 = document.getElementById("mazeCanvas2");
const ctx1 = mazeCanvas1.getContext("2d");
const ctx2 = mazeCanvas2.getContext("2d");
let sprite1, sprite2, finishSprite, maze1, maze2, draw1, draw2, player1, player2, cellSize, difficulty;

async function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

async function preloadAssets() {
    try {
        [sprite1, sprite2, finishSprite] = await Promise.all([
            loadImage("./images/player1.png"),
            loadImage("./images/player2.png"),
            loadImage("./images/PORTAL.png")
        ]);
        makeMaze();
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}

function adjustCanvasSize() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    difficulty = difficulty || parseInt(document.getElementById("diffSelect").value);
    const maxSize = Math.min(
        (viewportWidth * 0.4),
        (viewportHeight - 150) * 0.9
    );
    
    const size = Math.floor(maxSize / difficulty) * difficulty;
    
    [mazeCanvas1, mazeCanvas2].forEach(canvas => {
        canvas.width = size;
        canvas.height = size;
    });
    
    cellSize = size / difficulty;
    
    if (draw1) {
        draw1.redrawMaze(cellSize);
        player1.redrawPlayer(cellSize);
    }
    if (draw2) {
        draw2.redrawMaze(cellSize);
        player2.redrawPlayer(cellSize);
    }
}

function makeMaze() {
    if (player1) player1.unbindKeyDown();
    if (player2) player2.unbindKeyDown();
    
    difficulty = parseInt(document.getElementById("diffSelect").value);
    adjustCanvasSize();
    
    maze1 = new Maze(difficulty, difficulty);
    maze2 = new Maze(difficulty, difficulty);
    
    draw1 = new DrawMaze(maze1, ctx1, cellSize, finishSprite);
    draw2 = new DrawMaze(maze2, ctx2, cellSize, finishSprite);
    
    player1 = new Player(maze1, mazeCanvas1, cellSize, (moves) => onComplete(1, moves), sprite1, 'wasd');
    player2 = new Player(maze2, mazeCanvas2, cellSize, (moves) => onComplete(2, moves), sprite2, 'arrows');

    // Connect maze drawers with players
    player1.setMazeDrawer(draw1);
    player2.setMazeDrawer(draw2);
}

function onComplete(playerNum, moves) {
    document.getElementById("winner").innerHTML = `Player ${playerNum} Won!`;
    document.getElementById("moves").innerHTML = `With ${moves} moves!`;
    toggleVisablity("Message-Container");
}

window.addEventListener('load', () => {
    adjustCanvasSize();
    preloadAssets();
});

window.addEventListener('resize', adjustCanvasSize);

window.makeMaze = makeMaze;
window.toggleVisablity = toggleVisablity;