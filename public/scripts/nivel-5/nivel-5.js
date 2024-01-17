var isLoggedIn = true;
var startTimeStamp;
var endTimeStamp;
const gameName = "nivel-5";

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
var dialogShort = document.getElementById('dialog-short');
var dialogDisplayedOneTime;
var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

var sides = ["sx", "dx"];
var names = ["cabra", "lobo", "col"];
var space, lspace, rspace, turn = 0, timer, PC = true, PL = true, ZE = true; 

var conta = 0;
let timerInterval;

const gameWidth = 1536;
const gameHeight = 730;
space = (gameWidth - 325) / 2 - 200;
lspace = 240 - space;
rspace = space - 210;

var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

const open = document.getElementById("open");
const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");

////////////////// Add Event Listeners //////////////////
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
    dialogLong.style.color = "rgb(202, 14, 14)";
    dialogLong.style.textAlign = "center";
    dialogLong.style.lineHeight = "71px";
    $("#dialog-long").html(t).slideDown("fast", 
    function() {
        timer = window.setTimeout(function() {
            $("#dialog-long").slideUp("fast");
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

function warning(t, tm) {
    window.clearTimeout(timer);
    dialogShort.style.color = "rgb(202, 14, 14)";
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
	for (i=0; i<3; i++)
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

        vitoria("Buen trabajo, has ganado! Y has usado " + conta + " movimientos, en un tiempo de " + etime.textContent+ ".", 300);
        $("#move-button").slideUp("fast");

        if(isLoggedIn){
            recordDurationStatistics(gameName, duration_mins);
            var payloadObject = JSON.parse(atob(localStorage.getItem("JWT").split('.')[1]));
            addScoreToLeaderboard(gameName, payloadObject.ign, payloadObject.hashedEmail, conta);
        }
        setTimeout(function(){location.reload();}, 15000);     
    }
}

function parti() {
    check();
	if (ZE) return warning("Debes subir al menos una figura al barco!", 4);
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
        }, 5000); 
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
        }, 5000); 
        return
    }; 
    var nspace = (turn == 0) ? rspace : lspace;
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
	for (i=0; i<x.length; i++) {
        var src = $(x[i]).attr("src");
        var parts = src.split('/');
        var imageName = parts[parts.length - 1];

        console.log("Image name: ",imageName);
		if (imageName == 'cabra.png') p = 1;
		if (imageName == 'lobo.png') l = 1;
		if (imageName == 'col.png') c = 1;
	}
	PC = PC || (p == 1 && c == 1);
	PL = PL || (p == 1 && l == 1);
    console.log("PC: ", PC, "PL: ", PL, "ZE: ", ZE);

    x = $("#zat")[0].children;

    ZE = (x.length < 1);
}

function enq(i) {
    var zatNode = $("#zat")[0];
    
    console.log("Enq: ", zatNode.children.length);

    if (zatNode.children.length > 2) return;

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

    console.log("Enq: ", zatNode.children.length);

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

google.load("jquery", "1");
google.setOnLoadCallback(function() {
    $("#zat").css("margin-left", space).addClass("clicca").click(function() {
        $("#zat").removeClass("clicca").off("click");
        $(".inizia").slideUp(function() { $(this).remove(); });
        $("#zat").animate({left: lspace}, "slow");
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
    console.log("toggleMusic");
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
        console.log("toggleMusic");
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
        dialogLong.style.lineHeight = "40px";
        dialogLong.style.textAlign = "left";
        dialogLong.innerHTML =             
            "**********************************************************************************<br>" +
            "Nivel 5 - Condiciones:<br>" +
            "•  Orilla izquierda: 3 Lobos, 3 Cabras, 3 Coles<br>" +
            "•	Orilla derecha: Vacía<br>" +
            "•	No se puede viajar solo!<br>" +
            "•	Nro. máximo de pasajeros en el barco: 3<br>" +
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
    dialogDisplayedOneTime = getFromLocalStorage('dialogDisplayedOneTime-n-5', false);

    if (!dialogDisplayedOneTime){
        dialogLong.style.display = 'block';
        dialogLong.style.color = "#063555";
        dialogLong.style.lineHeight = "40px";
        dialogLong.style.textAlign = "left";
        dialogLong.innerHTML =
            "Me cierro en 20 segundos!<br>" +             
            "Si quieres volver a leer esto y más instrucciones da click en el botón [ (?) ]<br>" +
            "**********************************************************************************<br>" +
            "Nivel 5 - Condiciones:<br>" +
            "•	No se puede viajar solo!<br>" +
            "•	Nro. máximo de pasajeros en el barco: 3<br>" +
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
    saveToLocalStorage('dialogDisplayedOneTime-n-5', true);
}


///////// Initialization /////////
function init() {
    for (i = 0; i < 3; i++) {
        // Aquí con sx controlo el lugar en donde se ubicarán las imágenes
        var x = $("#sx ." + names[i]);
        x.hide();
        for (j = 0; j < 3; j++) 
            x.append('<img src="../../resources/lccGame/images/' + names[i] + '.png"/>');
        x.show("slow");
    }
    restoreClick(0);
    removeClick(1);
    startTimeStamp = new Date();
    startTimer();
    updateMoves();
}

function logout(){
  isLoggedIn = false;
  userLogout();
}

startMusic();
autoActivateDialog(20);

/////leaderboard pop up///////////

function checkLoginStatus(){
  if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
    document.getElementById("login-btn").innerHTML = "Login";
    isLoggedIn = false;
  }
}

const scoresList = document.getElementsByClassName("members-with-score")[0];

async function getScores(){
  if(isLoggedIn){
    const innerhtml = await getLeaderboardScores(gameName);
    scoresList.innerHTML = innerhtml;
  } else {
    scoresList.innerHTML = '<div class="not-logged-in"><span>Please <a href="/login">login</a> to record your results.</span></div>';
  }
}