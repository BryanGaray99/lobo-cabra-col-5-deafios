var startTimeStamp;
var endTimeStamp;
var isLoggedIn = true;
const gameName = "nivel1";
var gameScore = 0;

var modal = document.querySelector("#myModal");
var btn = document.querySelector(".leaderboard_pop");

var sides = ["sx", "dx"];
var names = ["cabra", "lobo", "col"];
var space, lspace, turn = 0, timer, PC = true, PL = true, ZE = true, conta = 0;


/////leaderboard pop up///////////
const open = document.getElementById("open");
const modal_Container = document.getElementById("modal_container");
const close = document.getElementById("close");

open.addEventListener("click",() => {
    modal_Container.classList.add("show");
});
close.addEventListener("click",() => {
    modal_Container.classList.remove("show");
});

function logout(){
    isLoggedIn = false;
    userLogout();
}

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
        $("#game img").removeClass("clicca").off("click");
        $("#zat").animate({ left: 0 }, "slow").append('<span class="inizia">Ganaste!</span>');
        errore("Buen trabajo, has ganado! Y has usado " + conta + " movimientos.", 10);
        $("#button").slideUp("fast");
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

    console.log('Lado:', sides[turn], 'P:', p, 'L:', l, 'C:', c); // Registro de consola
    console.log('PC:', PC, 'PL:', PL, 'ZE:', ZE); // Registro de consola
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

function init() {
    for (i = 0; i < 3; i++) {
        var x = $("#sx ." + names[i]);
        x.hide();
        for (j = 0; j < 1; j++) // Cambia a 1 elemento
            x.append('<img src="../resources/lccGame/images/' + names[i] + '.png"/>');
        x.show("slow");
    }
    restoreClick(0);
    removeClick(1);
}
