var isLoggedIn = true;
var startTimeStamp;
var endTimeStamp;
const gameName = "nivel-1";

const moves = document.querySelector(".score-number");
const etime = document.querySelector(".elapsed-time");

const newGameBtn = document.querySelector(".btn-newGame");

const musicOnIcon = document.querySelector(".icon-music_note");
const musicOffIcon = document.querySelector(".icon-music_off");
const bgMusic = document.querySelector(".btn-bgm");


let backgroundMusicEnabled = true;

var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");
var sides = ["sx", "dx"];
var names = ["cabra", "lobo", "col"];
var space, lspace, turn = 0, timer, PC = true, PL = true, ZE = true; 

var conta = 0;
let timerInterval;

const gameWidth = 1536;
const gameHeight = 730;
space = (gameWidth - 325) / 2 - 200;
lspace = space - 150;

var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

const open = document.getElementById("open");
const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");

// Add Event Listeners
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

/////// Time and moves ////////
// Función para iniciar el temporizador
function startTimer() {
    startTimeStamp = new Date();
    timerInterval = setInterval(updateTimer, 1000); // Actualiza el temporizador cada segundo
}

// Función para detener el temporizador
function stopTimer() {
    clearInterval(timerInterval);
    endTimeStamp = new Date();
}

// Función para actualizar el temporizador en la interfaz de usuario
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTimeStamp) / 1000);
    
    // Calcula horas, minutos y segundos
    const minutes = Math.floor((elapsedTime % 3600) / 60);
    const seconds = elapsedTime % 60;
    
    // Formatea las horas, minutos y segundos para que siempre tengan dos dígitos
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    
    // Actualiza el contenido de texto del elemento con el tiempo formateado
    etime.textContent = `${formattedMinutes}:${formattedSeconds}`;
}
// Función para actualizar los movimientos en la interfaz de usuario
function updateMoves() {
    moves.textContent = conta; // Actualiza el número de movimientos en la interfaz de usuario
}

///////// Lógica del juego /////////
function errore(t, tm) {
    window.clearTimeout(timer);
    $("#dialog").html(t).slideDown("fast", function() {
        timer = window.setTimeout(function() {
            $("#dialog").slideUp("fast");
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
        errore("Buen trabajo, has ganado! Y has usado " + conta + " movimientos, en un tiempo de " + etime.textContent+ ".", 15);
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
    if (PL) return errore("El lobo se ha comido a la cabra!", 2);
    if (PC) return errore("La cabra se ha comido a la col!", 2);
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
    PC = (p == 1 && c == 1 && l == 0); // La cabra y la col están solas
    PL = (p == 1 && l == 1 && c == 0); // La cabra y el lobo están solos
    x = $("#zat")[0].childNodes;
    ZE = (x.length < 1);
}

function enq(i) {
    if ($("#zat")[0].childNodes.length > 2) return;
    var x = $("#" + sides[turn] + " ." + names[i])[0].childNodes;
    var el = x[x.length - 1];
    $(el).attr("onclick", "deq(" + i + ")").hide("fast", function () {
        $("#zat").append($(this));
    });
    $(el).show("fast");
    check();
}

function deq(i) {
    var el, l = $("#zat")[0].childNodes;
    for (j = 0; j < l.length; j++) if ($(l[j]).attr("onclick") == "deq(" + i + ")") el = l[j];
    $(el).attr("onclick", "enq(" + i + ")").hide("fast", function () {
        $("#" + sides[turn] + " ." + names[i]).append($(this));
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
  
function toggleMusic() {
    let backgroundMusic = document.getElementById("player");
    backgroundMusicEnabled = !backgroundMusicEnabled;
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
    let backgroundMusic = document.getElementById("player");
    backgroundMusic.play();
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
    updateMoves();
}

function logout(){
  isLoggedIn = false;
  userLogout();
}

init();
startMusic();

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