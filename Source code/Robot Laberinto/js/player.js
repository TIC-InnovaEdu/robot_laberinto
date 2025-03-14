class Player {
    constructor(maze, canvas, cellSize, onComplete, sprite = null) {
        const ctx = canvas.getContext("2d");
        let moves = 0;
        let isAnsweringQuestion = false;
        const map = maze.map();
        const cellCoords = {
            x: maze.startCoord().x,
            y: maze.startCoord().y
        };

        let halfCellSize = cellSize / 2;
        const offsetLeft = cellSize / 50;
        const offsetRight = cellSize / 25;

        function drawSprite(coord) {
            ctx.drawImage(
                sprite,
                0,
                0,
                sprite.width,
                sprite.height,
                coord.x * cellSize + offsetLeft,
                coord.y * cellSize + offsetLeft,
                cellSize - offsetRight,
                cellSize - offsetRight
            );
        }

        function removeSprite(coord) {
            ctx.clearRect(
                coord.x * cellSize + offsetLeft,
                coord.y * cellSize + offsetLeft,
                cellSize - offsetRight,
                cellSize - offsetRight
            );
        }

        function redrawWalls(xCord, yCord, cell) {
            const x = xCord * cellSize;
            const y = yCord * cellSize;

            ctx.lineWidth = cellSize / 40;
            ctx.strokeStyle = 'black';

            if (!cell.n) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y);
                ctx.stroke();
            }
            if (!cell.s) {
                ctx.beginPath();
                ctx.moveTo(x, y + cellSize);
                ctx.lineTo(x + cellSize, y + cellSize);
                ctx.stroke();
            }
            if (!cell.e) {
                ctx.beginPath();
                ctx.moveTo(x + cellSize, y);
                ctx.lineTo(x + cellSize, y + cellSize);
                ctx.stroke();
            }
            if (!cell.w) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + cellSize);
                ctx.stroke();
            }
        }

        function checkCompletion(coord) {
            if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y) {
                onComplete(moves);
                Player.unbindKeyDown();
            }
        }

        function executeMove(newCoords) {
            moves++;
            const oldCoords = { ...cellCoords };

            removeSprite(oldCoords);
            cellCoords.x = newCoords.x;
            cellCoords.y = newCoords.y;

            redrawWalls(oldCoords.x, oldCoords.y, map[oldCoords.x][oldCoords.y]);
            drawSprite(cellCoords);
            redrawWalls(cellCoords.x, cellCoords.y, map[cellCoords.x][cellCoords.y]);

            checkCompletion(cellCoords);
        }

        function showQuestionModal(questionIndex, callback) {
            const currentQuestion = questions[questionIndex];

            const modal = document.createElement('div');
            modal.className = 'question-modal';
            modal.innerHTML = `
            <div class="modal-content">
                <h2>Responde la pregunta</h2>
                <p class="question-text">${currentQuestion.question}</p>
                <div class="options-container">
                    ${currentQuestion.options.map((option, index) => `
                        <button class="option-button" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
            </div>
        `;

            document.body.appendChild(modal);

            const buttons = modal.querySelectorAll('.option-button');
            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const selectedAnswer = currentQuestion.options[button.dataset.index];
                    const isCorrect = selectedAnswer === currentQuestion.answer;

                    if (isCorrect) {
                        button.classList.add('correct');
                        setTimeout(() => {
                            document.body.removeChild(modal);
                            callback(true);
                        }, 1000);
                    } else {
                        button.classList.add('incorrect');
                        setTimeout(() => {
                            button.classList.remove('incorrect');
                        }, 1000);
                    }
                });
            });
        }

        function movePlayer(e) {
            if (isAnsweringQuestion) return;

            if ([37, 38, 39, 40, 65, 87, 68, 83].includes(e.keyCode)) {
                e.preventDefault();
                const cell = map[cellCoords.x][cellCoords.y];
                let newCoords = null;

                if ((e.keyCode === 37 || e.keyCode === 65) && cell.w) { // Izquierda
                    newCoords = { x: cellCoords.x - 1, y: cellCoords.y };
                } else if ((e.keyCode === 38 || e.keyCode === 87) && cell.n) { // Arriba
                    newCoords = { x: cellCoords.x, y: cellCoords.y - 1 };
                } else if ((e.keyCode === 39 || e.keyCode === 68) && cell.e) { // Derecha
                    newCoords = { x: cellCoords.x + 1, y: cellCoords.y };
                } else if ((e.keyCode === 40 || e.keyCode === 83) && cell.s) { // Abajo
                    newCoords = { x: cellCoords.x, y: cellCoords.y + 1 };
                }

                if (newCoords) {
                    const tuercaIndex = checkTuercaCollision(newCoords.x, newCoords.y);

                    if (tuercaIndex !== -1 && !answeredQuestions.includes(tuercaIndex)) {
                        isAnsweringQuestion = true;
                        showQuestionModal(tuercaIndex, (isCorrect) => {
                            isAnsweringQuestion = false;
                            if (isCorrect) {
                                answeredQuestions.push(tuercaIndex);
                                executeMove(newCoords);
                                draw.redrawMaze(cellSize);
                                drawSprite(cellCoords);
                            }
                        });
                    } else {
                        executeMove(newCoords);
                    }
                }
            }
        }

        this.bindKeyDown = function () {
            window.addEventListener("keydown", movePlayer, false);
        };

        this.unbindKeyDown = function () {
            window.removeEventListener("keydown", movePlayer, false);
        };

        this.redrawPlayer = function (newCellSize) {
            cellSize = newCellSize;
            halfCellSize = cellSize / 2;
            drawSprite(cellCoords);
        };

        // Inicializar jugador
        drawSprite(cellCoords);
        this.bindKeyDown();
    }
}