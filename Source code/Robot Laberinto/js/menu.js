document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el usuario está logueado
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }
});

function startGame(mode) {
    // Guardar el modo de juego en localStorage
    localStorage.setItem('gameMode', mode);
    // Redirigir al juego
    window.location.href = 'game.html';
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('gameMode');
    window.location.href = 'index.html';
}