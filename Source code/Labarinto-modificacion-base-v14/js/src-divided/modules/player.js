export class Player {
    constructor(maze, canvas, cellSize, onComplete, sprite = null, controlType = 'wasd', playerNumber = 1) {
        this.maze = maze;
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.cellSize = cellSize;
        this.sprite = sprite;
        this.controlType = controlType;
        this.onComplete = onComplete;
        this.playerNumber = playerNumber;
        this.moves = 0;
        this.cellCoords = {
            x: maze.startCoord.x,
            y: maze.startCoord.y
        };
        this.map = maze.map;
        this.answeredQuestions = new Set();
        this.requiredQuestions = this.maze.collectibles.size;

        this.drawSprite(this.cellCoords);
        this.bindKeyDown();
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
            (coord.x + 0.5) * this.cellSize,
            (coord.y + 0.5) * this.cellSize,
            this.cellSize * 0.4,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
    }

    drawSpriteImg(coord) {
        if (!this.sprite || !this.sprite.complete) {
            console.error(`❌ Imagen del jugador ${this.playerNumber} no se cargó correctamente.`);
            return;
        }
        
        const offset = this.cellSize / 50;
        this.ctx.drawImage(
            this.sprite,
            coord.x * this.cellSize + offset,
            coord.y * this.cellSize + offset,
            this.cellSize - offset * 2,
            this.cellSize - offset * 2
        );
    }
    

    removeSprite(coord) {
        const offset = this.cellSize / 50;
        this.ctx.clearRect(
            coord.x * this.cellSize + offset,
            coord.y * this.cellSize + offset,
            this.cellSize - offset * 2,
            this.cellSize - offset * 2
        );
    }

    async checkPosition(coord) {
        const posKey = `${coord.x},${coord.y}`;
    
        // Verificar si hay un coleccionable y no ha sido respondido
        if (this.maze.collectibles.has(posKey) && !this.answeredQuestions.has(posKey)) {
            const questionResult = await this.showQuestion();
            if (questionResult) {
                this.answeredQuestions.add(posKey);
                // Actualizar el contador de preguntas
                document.getElementById(`progress${this.playerNumber}`).textContent = 
                    `Preguntas: ${this.answeredQuestions.size}/${this.requiredQuestions}`;
                return true;
            }
            return false;
        }
    
        // Verificar si el jugador ha llegado al portal
        if (coord.x === this.maze.endCoord.x && coord.y === this.maze.endCoord.y) {
            console.log(`🎯 Jugador ${this.playerNumber} tocó el portal en (${coord.x}, ${coord.y})`);
    
            // 🔄 Volver a dibujar el portal para que no desaparezca
            this.maze.drawInstance.drawEndSprite(); 
    
            // Verificar victoria
            console.log(`Jugador ${this.playerNumber} llegó al final en (${coord.x}, ${coord.y})`);
            console.log(`Preguntas contestadas: ${this.answeredQuestions.size}/${this.requiredQuestions}`);
    
            if (this.hasCompletedAllQuestions()) {
                console.log(`🏆 Jugador ${this.playerNumber} ha completado todas las preguntas.`);
                this.onComplete(this.playerNumber, this.moves);
                this.unbindKeyDown();
            } else {
                console.log(`⏳ Jugador ${this.playerNumber} aún no ha completado todas las preguntas.`);
            }
        }  else {
            // 🔄 Si el jugador se mueve fuera del portal, volver a dibujarlo
            console.log(`🚶 Jugador ${this.playerNumber} se movió fuera del portal.`);
            this.maze.drawInstance.drawEndSprite();      
        }
        
        return false;
    }
    
    hasCompletedAllQuestions() {
        return this.answeredQuestions.size >= this.requiredQuestions;
    }

    async showQuestion() {
        const currentQuestion = questions[Math.floor(Math.random() * questions.length)];
        const modalId = `questionModal${this.playerNumber}`;
        const modal = document.getElementById(modalId);
        
        return new Promise((resolve) => {
            document.getElementById(`questionText${this.playerNumber}`).textContent = currentQuestion.question;
            const optionsContainer = document.getElementById(`options${this.playerNumber}`);
            optionsContainer.innerHTML = '';
            
            currentQuestion.options.forEach((option) => {
                const button = document.createElement('button');
                button.className = 'option-button';
                button.textContent = option;
                button.onclick = () => this.handleAnswer(option, currentQuestion.answer, modal, resolve);
                optionsContainer.appendChild(button);
            });

            modal.style.display = 'flex';
        });
    }

    handleAnswer(selected, correct, modal, resolve) {
        const feedback = document.getElementById(`feedback${this.playerNumber}`);
        const isCorrect = selected === correct;

        feedback.textContent = isCorrect ? 
            '¡Correcto!' : 
            `Incorrecto. La respuesta correcta era: ${correct}`;
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;

        setTimeout(() => {
            modal.style.display = 'none';
            feedback.textContent = '';
            resolve(isCorrect);
        }, 1500);
    }

    async check(e) {
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

            const newCoords = {
                x: this.cellCoords.x + move.x,
                y: this.cellCoords.y + move.y
            };

            this.cellCoords = newCoords;
            this.drawSprite(this.cellCoords);
            await this.checkPosition(this.cellCoords);
        }
    }

    redrawPlayer(cellSize) {
        this.cellSize = cellSize;
        this.drawSprite(this.cellCoords);
    }

    bindKeyDown() {
        this.boundCheck = this.check.bind(this);
        window.addEventListener("keydown", this.boundCheck);
    }

    unbindKeyDown() {
        window.removeEventListener("keydown", this.boundCheck);
    }
}