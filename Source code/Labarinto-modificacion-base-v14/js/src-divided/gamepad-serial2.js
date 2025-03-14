// gamepad-bluetooth2.js
class BluetoothGamepad2 {
    constructor() {
        this.device = null;
        this.characteristic = null;
        this.isConnected = false;
        this.decoder = new TextDecoder();
        this.lastMove = 0;
        this.moveDelay = 100;
        this.connectButton = null;
        this.statusElement = null;
        
        this.moveInterval = null;
        this.currentDirection = null;
        this.isMoving = false;
        this.moveSpeed = 100;
        
        // UUIDs diferentes para el segundo mando
        this.SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331915b";
        this.CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a9";
        
        this.connect = this.connect.bind(this);
        this.disconnect = this.disconnect.bind(this);
        this.handleGamepadInput = this.handleGamepadInput.bind(this);
        this.updateButtonState = this.updateButtonState.bind(this);

        // Estilos personalizados para la ventana de Bluetooth
        this.bluetoothStyles = `
            ::part(dialog) {
                background: #1a1a1a !important;
                border-radius: 12px !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                color: white !important;
                max-width: 400px !important;
                padding: 20px !important;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3) !important;
            }

            ::part(heading) {
                color: white !important;
                font-family: 'Poppins', sans-serif !important;
                font-size: 18px !important;
                margin-bottom: 15px !important;
            }

            ::part(button) {
                background: #2196F3 !important;
                border: none !important;
                border-radius: 6px !important;
                color: white !important;
                padding: 8px 16px !important;
                font-family: 'Poppins', sans-serif !important;
                font-size: 14px !important;
                transition: all 0.3s !important;
            }

            ::part(button):hover {
                background: #1976D2 !important;
                transform: translateY(-1px) !important;
            }
        `;
    }

    handleGamepadInput(data) {
        // Mapeo de teclas WASD
        const keyCodeMap = {
            'U': 87, // W
            'R': 68, // D
            'D': 83, // S
            'L': 65  // A
        };

        if (data.dir && data.dir !== 'N') {
            const keyCode = keyCodeMap[data.dir];
            if (this.currentDirection !== data.dir) {
                this.stopMovement();
                this.currentDirection = data.dir;
                this.startMovement(keyCode);
            }
        } else if (this.currentDirection) {
            this.stopMovement();
        }

        const questionButtons = document.querySelectorAll('.option-button2');
        if (questionButtons.length > 0) {
            if (data.btnA) questionButtons[0]?.click();
            if (data.btnB) questionButtons[1]?.click();
            if (data.btnX) questionButtons[2]?.click();
            if (data.btnY) questionButtons[3]?.click();
        }
    }

    initializeUI() {
        if (!navigator.bluetooth) {
            console.error('Web Bluetooth no está soportado en este navegador');
            return;
        }

        // Crear el ícono del gamepad con las nuevas clases
        const gamepadIcon = document.createElement('div');
        gamepadIcon.className = 'gamepad-icon2 disconnected';
        gamepadIcon.innerHTML = `
            <span class="icon">🎮</span>
            <span class="gamepad-tooltip2">Conectar Mando 2</span>
        `;

        gamepadIcon.addEventListener('click', async () => {
            if (this.isConnected) {
                await this.disconnect();
                gamepadIcon.classList.remove('connected');
                gamepadIcon.classList.add('disconnected');
                gamepadIcon.querySelector('.gamepad-tooltip2').textContent = 'Conectar Mando 2';
            } else {
                try {
                    await this.connect();
                    gamepadIcon.classList.remove('disconnected');
                    gamepadIcon.classList.add('connected');
                    gamepadIcon.querySelector('.gamepad-tooltip2').textContent = 'Desconectar Mando 2';
                } catch (error) {
                    console.error('Error al conectar:', error);
                }
            }
        });

        document.body.appendChild(gamepadIcon);
        this.connectButton = gamepadIcon;
        
        this.statusElement = document.createElement('div');
        this.statusElement.id = 'controller-status2';
        this.statusElement.className = 'status-pill2 disconnected';
        document.body.appendChild(this.statusElement);
    }

    updateButtonState(connected) {
        if (this.connectButton) {
            this.connectButton.className = `gamepad-icon2 ${connected ? 'connected' : 'disconnected'}`;
            this.connectButton.querySelector('.gamepad-tooltip2').textContent = 
                connected ? 'Desconectar Mando 2' : 'Conectar Mando 2';
        }
    }

    updateStatus(connected, errorMessage = null) {
        if (this.statusElement) {
            const statusClass = connected ? 'connected' : 'disconnected';
            const statusText = connected ? 'Mando 2 Conectado' : 'Mando 2 Desconectado';
            
            this.statusElement.className = `status-pill2 ${statusClass} show`;
            this.statusElement.innerHTML = `
                <span class="status-icon"></span>
                <span class="status-text">${statusText}</span>
                ${errorMessage ? `<div class="error-text2">${errorMessage}</div>` : ''}
            `;
            
            this.updateButtonState(connected);
            
            setTimeout(() => {
                this.statusElement.classList.remove('show');
            }, 3000);
        }
    }

    // ... [El resto de los métodos como connect, disconnect, startMovement, stopMovement
    //     y handleDisconnection permanecen iguales, solo cambiando las referencias 
    //     de las clases CSS donde sea necesario]
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth no está soportado');
        return;
    }

    const gamepad2 = new BluetoothGamepad2();
    gamepad2.initializeUI();

    window.addEventListener('focus', async () => {
        if (gamepad2.device && !gamepad2.isConnected) {
            try {
                await gamepad2.device.gatt.connect();
                gamepad2.isConnected = true;
                gamepad2.updateStatus(true);
            } catch (error) {
                console.error('Error en reconexión automática:', error);
            }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gamepad2.isConnected) {
            gamepad2.disconnect();
        }
    });
});