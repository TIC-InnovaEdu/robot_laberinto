// login.js
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const loginSpinner = document.getElementById('loginSpinner');
    const errorMessage = document.getElementById('error-message');
    const buttonText = loginButton.querySelector('span');

    // Verificar si ya hay una sesión activa
    if (localStorage.getItem('isLoggedIn')) {
        window.location.href = 'game.html';
    }

    // Credenciales de prueba
    const VALID_CREDENTIALS = {
        email: 'usuario@example.com',
        password: 'Game2025'
    };

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
    });

    function handleLogin() {
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        // Resetear estados previos
        resetErrorStates();
        
        // Mostrar estado de carga
        setLoadingState(true);

        // Simular verificación de credenciales
        setTimeout(() => {
            if (validateCredentials(email.value, password.value)) {
                loginSuccess();
            } else {
                loginError('Correo o contraseña incorrectos');
            }
            setLoadingState(false);
        }, 1500);
    }

    function validateCredentials(email, password) {
        return email === VALID_CREDENTIALS.email && 
               password === VALID_CREDENTIALS.password;
    }

    // Modificar la función loginSuccess en login.js
    function loginSuccess() {
    localStorage.setItem('isLoggedIn', 'true');
    window.location.href = 'menu.html'; // Cambiado de 'game.html' a 'menu.html'
    }

    function loginError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => input.classList.add('error'));
    }

    function setLoadingState(isLoading) {
        loginButton.disabled = isLoading;
        loginSpinner.style.display = isLoading ? 'block' : 'none';
        buttonText.style.opacity = isLoading ? '0' : '1';
    }

    function resetErrorStates() {
        errorMessage.style.display = 'none';
        document.querySelectorAll('.error').forEach(field => {
            field.classList.remove('error');
        });
    }

    // Limpiar errores cuando el usuario escribe
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
            errorMessage.style.display = 'none';
        });
    });
});