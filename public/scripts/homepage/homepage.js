function fetchProfile(){
    window.location.href = "/gamerProfile";
}

function logout(){
    userLogout();
}


function checkAndUnlockLevels(user) {
    // Nivel 1 siempre está desbloqueado, no es necesario verificar

    // Nivel 2
    const nivel2 = document.getElementById("nivel-2");
    const square2 = document.getElementById("nivel-2-square");
    const icon2 = document.getElementById("icon-nivel-2");

    if (user && user.moves_nivel_1 <= 10 && user.time_nivel_1 <= 0.5 && user.moves_nivel_1 !== 0 && user.time_nivel_1 !== 0) {
        nivel2.classList.remove("locked");
        nivel2.style.pointerEvents = "auto"; // Restaurar la interacción
        icon2.style.display = "none";
        square2.classList.remove("locked");
        square2.style.pointerEvents = "auto"; // Restaurar la interacción
    } else {
        nivel2.classList.add("locked");
        nivel2.style.pointerEvents = "none";
        square2.classList.add("locked");
        square2.style.pointerEvents = "none";
    }

    // Nivel 3
    const nivel3 = document.getElementById("nivel-3");
    const square3 = document.getElementById("nivel-3-square");
    const icon3 = document.getElementById("icon-nivel-3");

    if (user && user.moves_nivel_2 <= 6 && user.time_nivel_2 <= 0.5 && user.moves_nivel_2 !== 0 && user.time_nivel_2 !== 0) {
        nivel3.classList.remove("locked");
        nivel3.style.pointerEvents = "auto";
        icon3.style.display = "none";
        square3.classList.remove("locked");
        square3.style.pointerEvents = "auto";
    } else {
        nivel3.classList.add("locked");
        nivel3.style.pointerEvents = "none";
        square3.classList.add("locked");
        square3.style.pointerEvents = "none";
    }

    // Nivel 4
    const nivel4 = document.getElementById("nivel-4");
    const square4 = document.getElementById("nivel-4-square");
    const icon4 = document.getElementById("icon-nivel-4");

    if (user && user.moves_nivel_3 <= 15 && user.time_nivel_3 <= 1 && user.moves_nivel_3 !== 0 && user.time_nivel_3 !== 0) {
        nivel4.classList.remove("locked");
        nivel4.style.pointerEvents = "auto";
        icon4.style.display = "none";
        square4.classList.remove("locked");
        square4.style.pointerEvents = "auto";
    } else {
        nivel4.classList.add("locked");
        nivel4.style.pointerEvents = "none";
        square4.classList.add("locked");
        square4.style.pointerEvents = "none";
    }

    // Nivel 5
    const nivel5 = document.getElementById("nivel-5");
    const square5 = document.getElementById("nivel-5-square");
    const icon5 = document.getElementById("icon-nivel-5");
    if (user && user.moves_nivel_4 <= 10 && user.time_nivel_4 <= 1 && user.moves_nivel_4 !== 0 && user.time_nivel_4 !== 0) {
        nivel5.classList.remove("locked");
        nivel5.style.pointerEvents = "auto";
        icon5.style.display = "none";
        square5.classList.remove("locked");
        square5.style.pointerEvents = "auto";
    } else {
        nivel5.classList.add("locked");
        nivel5.style.pointerEvents = "none";
        square5.classList.add("locked");
        square5.style.pointerEvents = "none";
    }
}

function getAndSetData () {
    checkLoginStatus();
}