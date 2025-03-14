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
        console.log("⏳ Cargando imágenes...");
        sprite1 = await loadImage("./images/player1.png");
        sprite2 = await loadImage("./images/player2.png");
        finishSprite = await loadImage("./images/PORTAL.png"); // Asegurar que coincide el nombre
        
        console.log("✅ Imágenes cargadas correctamente:", { sprite1, sprite2, finishSprite });
        
        // Verificar si las imágenes realmente cargaron
        if (!sprite1 || !sprite2 || !finishSprite) {
            throw new Error("❌ Una o más imágenes no se cargaron correctamente");
        }
        
        makeMaze(); // Crear el laberinto una vez que todo esté cargado

        // 🔄 Redibujar la meta después de 2 segundos para asegurarse de que no desaparezca
        setTimeout(() => {
            console.log("🔄 Redibujando la meta después de 2 segundos...");
            draw1.drawEndSprite();
            draw2.drawEndSprite();
        }, 2000);

    } catch (error) {
        console.error('❌ Error al cargar imágenes:', error);
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
    const questionCount = parseInt(document.getElementById("questionSelect").value);

    adjustCanvasSize();

    maze1 = new Maze(difficulty, difficulty, questionCount);
    maze2 = new Maze(difficulty, difficulty, questionCount);

    draw1 = new DrawMaze(maze1, ctx1, cellSize, finishSprite);
    draw2 = new DrawMaze(maze2, ctx2, cellSize, finishSprite);

    // 🔄 Asignar `drawInstance` a cada laberinto
    maze1.drawInstance = draw1;
    maze2.drawInstance = draw2;

    player1 = new Player(maze1, mazeCanvas1, cellSize, onComplete, sprite1, 'wasd', 1);
    player2 = new Player(maze2, mazeCanvas2, cellSize, onComplete, sprite2, 'arrows', 2);

    // NO dibujar los coleccionables aún (Redibujar los coleccionables correctamente)
    draw1.drawCollectibles();
    draw2.drawCollectibles();

    // Inicializar contadores de progreso
    document.getElementById("progress1").textContent = `Preguntas: 0/${questionCount}`;
    document.getElementById("progress2").textContent = `Preguntas: 0/${questionCount}`;

    // 🔥 Dibujar los jugadores inmediatamente después de crearlos
    player1.drawSprite(player1.cellCoords);
    player2.drawSprite(player2.cellCoords);

    console.log("🎮 Jugadores dibujados en sus posiciones iniciales.");

    // Aquí después de hacer clic en "Comenzar", ahora dibujamos los coleccionables
    //console.log("🔄 Dibujando coleccionables...");
    //draw1.drawCollectibles();
    //draw2.drawCollectibles();

}

function onComplete(playerNum, moves) {
    displayVictoryMess(playerNum, moves);
}

window.addEventListener('load', () => {
    adjustCanvasSize();
    preloadAssets();
});

window.addEventListener('resize', adjustCanvasSize);

window.makeMaze = makeMaze;
window.toggleVisablity = toggleVisablity;