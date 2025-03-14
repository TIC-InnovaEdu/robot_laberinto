var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var sprite;
var finishSprite;
var tuercaSprite;
var maze, draw, player;
var cellSize;
var difficulty;
var redPoints = [];
var answeredQuestions = [];
var isGameInitialized = false;
var loadingComplete = false;

function hideCanvas() {
    if (mazeCanvas) {
        mazeCanvas.style.opacity = "0";
        mazeCanvas.style.transition = "opacity 0.3s ease-in";
    }
}

function showCanvas() {
    if (mazeCanvas) {
        mazeCanvas.style.opacity = "1";
    }
}

function loadImages() {
    hideCanvas();
    
    return new Promise((resolve, reject) => {
        let loadedImages = 0;
        const totalImages = 3;

        function imageLoaded() {
            loadedImages++;
            if (loadedImages === totalImages) {
                loadingComplete = true;
                resolve();
            }
        }

        sprite = new Image();
        sprite.onload = function() {
            sprite = changeBrightness(1.2, sprite);
            imageLoaded();
        };
        sprite.src = "./images/ROBOT.png";
        sprite.setAttribute("crossOrigin", " ");

        finishSprite = new Image();
        finishSprite.onload = function() {
            finishSprite = changeBrightness(1.1, finishSprite);
            imageLoaded();
        };
        finishSprite.src = "./images/PORTAL.png";
        finishSprite.setAttribute("crossOrigin", " ");

        tuercaSprite = new Image();
        tuercaSprite.onload = function() {
            imageLoaded();
        };
        tuercaSprite.src = "./images/TUERCA.png";
        tuercaSprite.setAttribute("crossOrigin", " ");
    });
}

function setupCanvas() {
    let view = document.getElementById("view");
    let viewWidth = view.offsetWidth;
    let viewHeight = view.offsetHeight;
    let size = Math.min(viewWidth, viewHeight) - 20;
    
    if (difficulty) {
        size = Math.floor(size / difficulty) * difficulty;
    }
    
    mazeCanvas.width = size;
    mazeCanvas.height = size;
    ctx.clearRect(0, 0, size, size);
}

function generateTuercas(numTuercas, mazeWidth, mazeHeight) {
    let points = [];
    while (points.length < numTuercas) {
        let point = {
            x: Math.floor(Math.random() * mazeWidth),
            y: Math.floor(Math.random() * mazeHeight),
            questionIndex: points.length
        };
        
        const isStart = point.x === maze.startCoord().x && point.y === maze.startCoord().y;
        const isEnd = point.x === maze.endCoord().x && point.y === maze.endCoord().y;
        const isDuplicate = points.some(p => p.x === point.x && p.y === point.y);
        
        if (!isStart && !isEnd && !isDuplicate) {
            points.push(point);
        }
    }
    return points;
}

function checkTuercaCollision(x, y) {
    for (let i = 0; i < redPoints.length; i++) {
        if (redPoints[i].x === x && redPoints[i].y === y && !answeredQuestions.includes(i)) {
            return i;
        }
    }
    return -1;
}

async function initializeMaze() {
    try {
        hideCanvas();
        if (!isGameInitialized) {
            await loadImages();
            isGameInitialized = true;
        }
        setupCanvas();
        await makeMaze();
        showCanvas();
    } catch (error) {
        console.error("Error initializing maze:", error);
    }
}

function cleanupMaze() {
    if (player) {
        player.unbindKeyDown();
        player = null;
    }
    
    redPoints = [];
    answeredQuestions = [];
    
    if (ctx && mazeCanvas) {
        ctx.clearRect(0, 0, mazeCanvas.width, mazeCanvas.height);
    }
    
    maze = null;
    draw = null;
}

async function makeMaze() {
    return new Promise((resolve) => {
        cleanupMaze();
        
        let e = document.getElementById("diffSelect");
        difficulty = parseInt(e.options[e.selectedIndex].value);
        
        let q = document.getElementById("questionSelect");
        let numQuestions = parseInt(q.options[q.selectedIndex].value);
        
        setupCanvas();
        cellSize = mazeCanvas.width / difficulty;
        
        maze = new Maze(difficulty, difficulty);
        redPoints = generateTuercas(numQuestions, difficulty, difficulty);
        
        draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
        player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
        
        setTimeout(() => {
            resolve();
        }, 50);
    });
}

function drawTuercas(ctx) {
    if (!tuercaSprite || !ctx) return;
    
    redPoints.forEach(point => {
        if (!answeredQuestions.includes(point.questionIndex)) {
            ctx.drawImage(
                tuercaSprite,
                point.x * cellSize + cellSize * 0.1,
                point.y * cellSize + cellSize * 0.1,
                cellSize * 0.8,
                cellSize * 0.8
            );
        }
    });
}

function toggleVisibility(id) {
    let element = document.getElementById(id);
    if (element.style.visibility === "visible") {
        element.style.visibility = "hidden";
        setTimeout(() => {
            makeMaze();
        }, 300);
    } else {
        element.style.visibility = "visible";
    }
}

function displayVictoryMess(moves) {
    document.getElementById("moves").innerHTML = "Has realizado " + moves + " movimientos";
    toggleVisibility("Message-Container");
}

document.addEventListener('DOMContentLoaded', () => {
    if (mazeCanvas) {
        mazeCanvas.style.transition = "opacity 0.3s ease-in";
        hideCanvas();
    }
});

window.onload = initializeMaze;

window.onresize = () => {
    if (isGameInitialized && loadingComplete) {
        hideCanvas();
        setupCanvas();
        if (maze && draw && player) {
            cellSize = mazeCanvas.width / difficulty;
            draw.redrawMaze(cellSize);
            player.redrawPlayer(cellSize);
        }
        showCanvas();
    }
};