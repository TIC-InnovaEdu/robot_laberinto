// gamepad-bluetooth.js
class BluetoothGamepad {
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
        
        this.SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
        this.CHARACTERISTIC_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
        
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

            ::part(cancel-button) {
                background: #424242 !important;
            }

            ::part(cancel-button):hover {
                background: #616161 !important;
            }

            ::part(device-label) {
                color: #e0e0e0 !important;
                font-family: 'Poppins', sans-serif !important;
                font-size: 14px !important;
                padding: 10px !important;
                border-radius: 6px !important;
                background: rgba(255, 255, 255, 0.1) !important;
                margin: 5px 0 !important;
                transition: all 0.3s !important;
            }

            ::part(device-label):hover {
                background: rgba(255, 255, 255, 0.15) !important;
            }
        `;
    }

    async connect() {
        try {
            if (this.isConnected) {
                console.warn('Ya existe una conexión activa');
                return;
            }

            // Agregar los estilos personalizados
            const style = document.createElement('style');
            style.textContent = this.bluetoothStyles;
            document.head.appendChild(style);

            // Solicitar dispositivo Bluetooth
            this.device = await navigator.bluetooth.requestDevice({
                filters: [{
                    services: [this.SERVICE_UUID]
                }]
            });

            const server = await this.device.gatt.connect();
            const service = await server.getPrimaryService(this.SERVICE_UUID);
            this.characteristic = await service.getCharacteristic(this.CHARACTERISTIC_UUID);
            
            await this.characteristic.startNotifications();
            this.characteristic.addEventListener('characteristicvaluechanged', 
                (event) => {
                    const value = this.decoder.decode(event.target.value);
                    try {
                        const data = JSON.parse(value);
                        this.handleGamepadInput(data);
                    } catch (e) {
                        console.error('Error parsing gamepad data:', e);
                    }
                }
            );
            
            this.isConnected = true;
            this.updateStatus(true);
            
            this.device.addEventListener('gattserverdisconnected', () => {
                this.handleDisconnection();
            });

            // Limpiar los estilos después de la conexión
            document.head.removeChild(style);

        } catch (error) {
            console.error('Error al conectar:', error);
            if (document.head.contains(style)) {
                document.head.removeChild(style);
            }
            this.updateStatus(false, error.message);
        }
    }

    handleGamepadInput(data) {
        const keyCodeMap = {
            'U': 38, // Arriba
            'R': 39, // Derecha
            'D': 40, // Abajo
            'L': 37  // Izquierda
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

        const questionButtons = document.querySelectorAll('.option-button');
        if (questionButtons.length > 0) {
            if (data.btnA) questionButtons[0]?.click();
            if (data.btnB) questionButtons[1]?.click();
            if (data.btnX) questionButtons[2]?.click();
            if (data.btnY) questionButtons[3]?.click();
        }
    }

    startMovement(keyCode) {
        if (this.isMoving) return;
        
        this.isMoving = true;
        
        const sendKeyEvent = () => {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                keyCode: keyCode,
                bubbles: true,
                cancelable: true
            }));
        };

        sendKeyEvent();
        this.moveInterval = setInterval(sendKeyEvent, this.moveSpeed);
    }

    stopMovement() {
        if (!this.isMoving) return;
        
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
            this.moveInterval = null;
        }

        if (this.currentDirection) {
            const keyCodeMap = {
                'U': 38, 'R': 39, 'D': 40, 'L': 37
            };
            const keyCode = keyCodeMap[this.currentDirection];
            
            document.dispatchEvent(new KeyboardEvent('keyup', {
                keyCode: keyCode,
                bubbles: true,
                cancelable: true
            }));
        }

        this.currentDirection = null;
        this.isMoving = false;
    }

    async handleDisconnection() {
        this.stopMovement();
        this.isConnected = false;
        this.characteristic = null;
        this.updateStatus(false, 'Dispositivo desconectado');
        
        try {
            if (this.device) {
                await this.device.gatt.connect();
                this.isConnected = true;
                this.updateStatus(true);
            }
        } catch (error) {
            console.error('Error en reconexión:', error);
        }
    }

    async disconnect() {
        this.stopMovement();
        
        if (this.device && this.device.gatt.connected) {
            await this.device.gatt.disconnect();
        }
        this.device = null;
        this.characteristic = null;
        this.isConnected = false;
        this.updateStatus(false);
    }

    initializeUI() {
        if (!navigator.bluetooth) {
            console.error('Web Bluetooth no está soportado en este navegador');
            return;
        }

        // Crear el ícono del gamepad
        const gamepadIcon = document.createElement('div');
        gamepadIcon.className = 'gamepad-icon disconnected';
        gamepadIcon.innerHTML = `
            <span class="icon">🎮</span>
            <span class="gamepad-tooltip">Conectar Mando</span>
        `;

        gamepadIcon.addEventListener('click', async () => {
            if (this.isConnected) {
                await this.disconnect();
                gamepadIcon.classList.remove('connected');
                gamepadIcon.classList.add('disconnected');
                gamepadIcon.querySelector('.gamepad-tooltip').textContent = 'Conectar Mando';
            } else {
                try {
                    await this.connect();
                    gamepadIcon.classList.remove('disconnected');
                    gamepadIcon.classList.add('connected');
                    gamepadIcon.querySelector('.gamepad-tooltip').textContent = 'Desconectar Mando';
                } catch (error) {
                    console.error('Error al conectar:', error);
                }
            }
        });

        document.body.appendChild(gamepadIcon);
        this.connectButton = gamepadIcon;
        
        this.statusElement = document.createElement('div');
        this.statusElement.id = 'controller-status';
        this.statusElement.className = 'status-pill disconnected';
        document.body.appendChild(this.statusElement);
    }

    updateButtonState(connected) {
        if (this.connectButton) {
            this.connectButton.className = `gamepad-icon ${connected ? 'connected' : 'disconnected'}`;
            this.connectButton.querySelector('.gamepad-tooltip').textContent = 
                connected ? 'Desconectar Mando' : 'Conectar Mando';
        }
    }

    updateStatus(connected, errorMessage = null) {
        if (this.statusElement) {
            const statusClass = connected ? 'connected' : 'disconnected';
            const statusText = connected ? 'Mando Conectado' : 'Mando Desconectado';
            
            this.statusElement.className = `status-pill ${statusClass} show`;
            this.statusElement.innerHTML = `
                <span class="status-icon"></span>
                <span class="status-text">${statusText}</span>
                ${errorMessage ? `<div class="error-text">${errorMessage}</div>` : ''}
            `;
            
            this.updateButtonState(connected);
            
            setTimeout(() => {
                this.statusElement.classList.remove('show');
            }, 3000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    if (!navigator.bluetooth) {
        console.log('Web Bluetooth no está soportado');
        return;
    }

    const gamepad = new BluetoothGamepad();
    gamepad.initializeUI();

    window.addEventListener('focus', async () => {
        if (gamepad.device && !gamepad.isConnected) {
            try {
                await gamepad.device.gatt.connect();
                gamepad.isConnected = true;
                gamepad.updateStatus(true);
            } catch (error) {
                console.error('Error en reconexión automática:', error);
            }
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && gamepad.isConnected) {
            gamepad.disconnect();
        }
    });
});