var isLoggedIn = true;
var startTimeStamp;
var endTimeStamp;
const gameName = "nivel-1";

const moves = document.querySelector(".score-number");
const etime = document.querySelector(".elapsed-time");

const newGameBtn = document.querySelector(".btn-newGame");
const helpButton = document.querySelector(".btn-help");
const musicOnIcon = document.querySelector(".icon-music_note");
const musicOffIcon = document.querySelector(".icon-music_off");
const bgMusic = document.querySelector(".btn-bgm");
let backgroundMusicEnabled;
let backgroundMusic = document.getElementById("player");
var dialogLong = document.getElementById('dialog-long');
var dialogError = document.getElementById('dialog-error');
var dialogShort = document.getElementById('dialog-short');
var dialogDisplayedOneTime;
var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");


var sides = ["sx", "dx"];
var names = ["cabra", "lobo", "col"];
var space, lspace, turn = 0, timer, PC = true, PL = true, ZE = true; 

var conta = 0;
let timerInterval;

// const gameWidth = 1536/2;
// const gameHeight = 730/2;
// Obtiene el ancho de pantalla inicial y lo almacena si no existe en el almacenamiento local
var storeScreenWidth = localStorage.getItem('screenWidth');
if (!storeScreenWidth) {
    storeScreenWidth = window.innerWidth;
    localStorage.setItem('screenWidth', storeScreenWidth);
}

function screenValues() {
    const currentScreenWidth = window.innerWidth;
    // console.log(currentScreenWidth);

    var factorScreen;
    if (currentScreenWidth <= 650) {
        factorScreen = 4;
    } else if (currentScreenWidth <= 1250 && currentScreenWidth > 650) {
        factorScreen = 2;
    } else {
        factorScreen = 1;
    }

    // Recalcula los valores usando el nuevo factorScreen
    space = 405.5 / factorScreen;
    lspace = space - (150 / factorScreen);

    if (currentScreenWidth !== parseInt(storeScreenWidth)) {
        // El tamaño de la pantalla ha cambiado
        storeScreenWidth = currentScreenWidth;
        localStorage.setItem('screenWidth', storeScreenWidth);

        location.reload();
    }
}

var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

const open = document.getElementById("open");
const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");

////////////////// Event Listeners //////////////////
window.addEventListener('resize', screenValues);

google.load("jquery", "1");

open.addEventListener("click",() => {
    modal_Container.classList.add("show");
});
close.addEventListener("click",() => {
    modal_Container.classList.remove("show");
});

bgMusic.addEventListener("click", toggleMusic);

newGameBtn.addEventListener('click', _ => {
    location.reload();
})

helpButton.addEventListener('click', toggleHelpDialog);

////////////////// Time and moves /////////////////
// Función para iniciar el temporizador
function startTimer() {
    startTimeStamp = new Date();
    timerInterval = setInterval(updateTimer, 1000); // Actualiza el temporizador cada segundo
}

function stopTimer() {
    clearInterval(timerInterval);
    endTimeStamp = new Date();
}

// Función para actualizar el temporizador en la interfaz de usuario
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTimeStamp) / 1000);
    
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    etime.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// Función para actualizar los movimientos en la interfaz de usuario
function updateMoves() {
    moves.textContent = conta; // Actualiza el número de movimientos en la interfaz de usuario
}

//////////////// Lógica del juego ////////////////////
function errore(t, tm) {
    window.clearTimeout(timer);
    dialogError.style.color = "rgb(202, 14, 14)";
    dialogError.style.textAlign = "center";
    $("#dialog-error").html(t).slideDown("fast", 
    function() {
        timer = window.setTimeout(function() {
            $("#dialog-error").slideUp("fast");
        }, tm * 1000);
    });
}

function vitoria(t, tm) {
    window.clearTimeout(timer);
    dialogShort.style.color = "#063555";
    $("#dialog-short").html(t).slideDown("fast", 
    function() {
        timer = window.setTimeout(function() {
            $("#dialog-short").slideUp("fast");
        }, tm * 1000);
    });
}


function removeClick(t) {
    $("#" + sides[t] + " img").removeClass("clicca").attr("onclick", "").unbind("click");
}

function restoreClick(t) {
    $("#" + sides[t] + " img").addClass("clicca");
    for (i = 0; i < 3; i++)
        $("#" + sides[t] + " ." + names[i] + " img").attr("onclick", "enq(" + i + ")");
}

function checkVinto() {
    if ($("#sx img").length < 1 && $("#zat img").length < 2) {
        updateMoves();
        stopTimer();
        endTimeStamp = new Date();
        const duration_mins = parseFloat((endTimeStamp.getTime() - startTimeStamp.getTime())/60000).toFixed(3); 

        $("#game img").removeClass("clicca").off("click");
        $("#zat").animate({ left: 0 }, "slow").append('<span class="inizia">Ganaste!</span>');

        vitoria("Buen trabajo, has ganado! Y has usado " + conta + " movimientos, en un tiempo de " + etime.textContent + 
        ". En breve se reiniciará la página. ", 7);
        $("#move-button").slideUp("fast");

        if(isLoggedIn){
            recordDurationStatistics(gameName, duration_mins);
            var payloadObject = JSON.parse(atob(localStorage.getItem("JWT").split('.')[1]));
            editProfileScores(gameName, payloadObject.ign, conta, duration_mins);
            addScoreToLeaderboard(gameName, payloadObject.ign, payloadObject.hashedEmail, conta, duration_mins);
        }
        setTimeout(function(){location.reload();}, 7000);     
    }
}

function parti() {
    check();
    if (PL) {
        errore(
            "**********************************************************************************<br>" +
            "*****************************************<br>" +
            "Lo sentimos, perdiste :'(<br>" +
            "El lobo se ha comido a la cabra!<br>" +
            "El juego se reiniciará en unos segundos<br>" +
            "******************************************<br>"+
            "**********************************************************************************<br>", 5);
        setTimeout(function(){
            location.reload();
        }, 6000); 
        return
    };
    if (PC) {
        errore(
            "**********************************************************************************<br>" +
            "*****************************************<br>" +
            "Lo sentimos, perdiste :'(<br>" +
            "La cabra se ha comido a la col!<br>" +
            "El juego se reiniciará en unos segundos<br>" +
            "******************************************<br>"+
            "**********************************************************************************<br>", 5);
        setTimeout(function(){
            location.reload();
        }, 6000); 
        return
    }; 
    var nspace = (turn == 0) ? lspace : -lspace;
    removeClick(turn);
    turn = 1 - turn;
    restoreClick(turn);
    $("#zat").animate({ left: nspace }, "slow");
    conta += 1;
    updateMoves(); 
}

function check() {
    PC = PL = ZE = false;
    var x = $("#" + sides[turn] + " img"), p, l, c;
    p = l = c = 0;
    for (i = 0; i < x.length; i++) {
        var src = $(x[i]).attr("src");
        var parts = src.split('/');
        var imageName = parts[parts.length - 1];

        if (imageName == 'cabra.png') p = 1;
        if (imageName == 'lobo.png') l = 1;
        if (imageName == 'col.png') c = 1;
    }
	PC = PC || (p == 1 && c == 1);
	PL = PL || (p == 1 && l == 1);
    x = $("#zat")[0].children;
    ZE = (x.length < 1);
}

function enq(i) {
    var zatNode = $("#zat")[0];
    
    if (zatNode.children.length > 0) return;

    var x = $("#" + sides[turn] + " ." + names[i])[0].children; // Obtén solo los elementos hijos

    var el = x[x.length - 1];
    $(el).attr("onclick", "deq(" + i + ")").hide("fast", function () {
        zatNode.appendChild($(this)[0]); // Añade el primer elemento del objeto jQuery
    });

    $(el).show("fast");
    check();
}

function deq(i) {
    var zatNode = $("#zat")[0];

    var el, l = zatNode.children; // Obtén solo los elementos hijos

    for (j = 0; j < l.length; j++) {
        if ($(l[j]).attr("onclick") == "deq(" + i + ")") el = l[j];
    }

    $(el).attr("onclick", "enq(" + i + ")").hide("fast", function () {
        $("#" + sides[turn] + " ." + names[i]).append($(this)[0]); // Añade el primer elemento del objeto jQuery
    });

    $(el).show("fast");
    check();
    checkVinto();
}

google.setOnLoadCallback(function() {
    $("#zat").css("margin-left", space).addClass("clicca").click(function() {
        $("#zat").removeClass("clicca").off("click");
        $(".inizia").slideUp(function() { $(this).remove(); });
        $("#zat").animate({left: -lspace}, "slow");
        $("#move-button").slideDown("slow");
        init();
        
    });
    $("#move-button").click(function() { parti(); });
});

//=======Scores and music===========================================

// Función para gestionar el almacenamiento en el localStorage
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Función para obtener el valor almacenado en el localStorage
function getFromLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
}
function toggleMusic() {
    backgroundMusicEnabled = getFromLocalStorage('backgroundMusicEnabled', true);

    backgroundMusicEnabled = !backgroundMusicEnabled;
    saveToLocalStorage('backgroundMusicEnabled', backgroundMusicEnabled);
    if (backgroundMusicEnabled) {
      musicOnIcon.classList.remove("hidden");
      musicOffIcon.classList.add("hidden");
      backgroundMusic.play();
    } else {
      musicOnIcon.classList.add("hidden");
      musicOffIcon.classList.remove("hidden");
      backgroundMusic.pause();
    }
}

function startMusic() {
    backgroundMusicEnabled = getFromLocalStorage('backgroundMusicEnabled', true);
    if (backgroundMusicEnabled) {
        musicOnIcon.classList.remove("hidden");
        musicOffIcon.classList.add("hidden");
        backgroundMusic.play();
    }
    else {
        let backgroundMusic = document.getElementById("player");
        musicOnIcon.classList.add("hidden");
        musicOffIcon.classList.remove("hidden");
        backgroundMusic.pause();
    }
}

// Función para toggle del diálogo
function toggleHelpDialog() {
    dialogLong.style.display = (dialogLong.style.display === 'block') ? 'none' : 'block';
    if (dialogLong.style.display === 'block') {
        dialogLong.style.color = "#063555";
        dialogLong.style.textAlign = "left";
        dialogLong.innerHTML =             
            "**********************************************************************************<br>" +
            "Nivel 1 - Condiciones:<br>" +
            "•	Orilla izquierda: Lobo, Cabra, Col<br>" +
            "•	Orilla derecha: Vacía<br>" +
            "•	Se puede viajar sin pasajeros<br>" +
            "•	Nro. máximo de pasajeros en el barco: 1<br>" +
            "**********************************************************************************<br>" +
            "Objetivo: Llevar a todos al lado derecho.<br>" +
            "Recuerda: Para subir o bajar un pasajero del barco dale click a su figura.<br>" +
            "Importante: Al moverte nunca dejes solos cabras con coles o lobos con cabras o perderás.<br>" +
            "**********************************************************************************<br>";
    } else {
        dialogLong.innerHTML = ""; 
    }
}

// Función para activar automáticamente el diálogo después de unos segundos
function autoActivateDialog(hideAfterSeconds) {
    dialogDisplayedOneTime = getFromLocalStorage('dialogDisplayedOneTime-n-1', false);

    if (!dialogDisplayedOneTime){
        dialogLong.style.display = 'block';
        dialogLong.style.color = "#063555";
        dialogLong.style.textAlign = "left";
        dialogLong.innerHTML =
            "Me cierro en 20 segundos!<br>" +             
            "Si quieres volver a leer esto y más instrucciones da click en [ (?) ]<br>" +
            "**********************************************************************************<br>" +
            "Nivel 1 - Condiciones:<br>" +
            "•	Se puede viajar sin pasajeros<br>" +
            "•	Nro. máximo de pasajeros en el barco: 1<br>" +
            "**********************************************************************************<br>" +
            "Objetivo: Llevar a todos al lado derecho.<br>" +
            "Recuerda: Para subir o bajar un pasajero del barco dale click a su figura.<br>" +
            "Importante: Al moverte nunca dejes solos cabras con coles o lobos con cabras o perderás.<br>" +
            "**********************************************************************************<br>";
    
        setTimeout(function() {
            dialogLong.style.display = 'none';
            dialogLong.innerHTML = ""; 
        }, hideAfterSeconds * 1000);
    } 
    saveToLocalStorage('dialogDisplayedOneTime-n-1', true);
}


///////// Initialization /////////
function init() {
    for (i = 0; i < 3; i++) {
        var x = $("#sx ." + names[i]);
        x.hide();
        for (j = 0; j < 1; j++) 
            x.append('<img src="../../resources/lccGame/images/' + names[i] + '.png"/>');
        x.show("slow");
    }
    restoreClick(0);
    removeClick(1);
    startTimeStamp = new Date();
    startTimer();
}

startMusic();
autoActivateDialog(20);
screenValues();

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.style.display = (mobileMenu.style.display === 'flex') ? 'none' : 'flex';
}

/////leaderboard pop up//////////

const scoresList = document.getElementsByClassName("members-with-score")[0];

async function getScores(){
  if(isLoggedIn){
    const innerhtml = await getLeaderboardScores(gameName);
    scoresList.innerHTML = innerhtml;
  } else {
    scoresList.innerHTML = '<div class="not-logged-in"><span>Porfavor <a href="/login">registrate</a> para guardar tu puntuación.</span></div>';
  }
}


// Login/logout
function logout(){
    isLoggedIn = false;
    userLogout();
  }
  

function checkLoginStatus(){
    if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
      document.getElementById("login-btn").innerHTML = "Login";
      document.getElementById("mobile-sign-out").innerHTML = 
          '<i class="fa fa-sign-out" style="font-size:16px"></i>' + " Login" ;
      isLoggedIn = false;
    }
  }