export function rand(max) {
    return Math.floor(Math.random() * max);
}

export function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export function displayVictoryMess(playerNumber, moves) {
    document.getElementById("winner").innerHTML = `¡Jugador ${playerNumber} ha ganado!`;
    document.getElementById("moves").innerHTML = `Con ${moves} movimientos`;
    toggleVisablity("Message-Container");
}

export function toggleVisablity(id) {
    const element = document.getElementById(id);
    if (element.style.visibility === "visible") {
        element.style.visibility = "hidden";
    } else {
        element.style.visibility = "visible";
    }
}