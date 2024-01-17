// var sides = ["sx", "dx"];
// var names = ["cabra", "lobo", "col"];
// var space, lspace, turn = 0, timer, PC = true, PL = true, ZE = true, conta = 0;

// function errore(t, tm) {
//     window.clearTimeout(timer);
//     $("#dialog").html(t).slideDown("fast", function() {
//         timer = window.setTimeout(function() {
//             $("#dialog").slideUp("fast");
//         }, tm * 1000);
//     });
// }

// function removeClick(t) {
//     $("#" + sides[t] + " img").removeClass("clicca").attr("onclick", "").unbind("click");
// }

// function restoreClick(t) {
//     $("#" + sides[t] + " img").addClass("clicca");
//     for (i = 0; i < 3; i++)
//         $("#" + sides[t] + " ." + names[i] + " img").attr("onclick", "enq(" + i + ")");
// }

function checkVinto() {
    if ($("#sx img").length == 9 && $("#zat img").length < 2) {
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

        if (imageName == 'cabra.png') p++;
        if (imageName == 'lobo.png') l++;
        if (imageName == 'col.png') c++;
    }
    PC = (p > 0 && c > 0 && l == 0);
    PL = (p > 0 && l > 0 && c == 0);
    x = $("#zat")[0].childNodes;
    ZE = (x.length < 1);

    console.log('Lado:', sides[turn], 'P:', p, 'L:', l, 'C:', c);
    console.log('PC:', PC, 'PL:', PL, 'ZE:', ZE);
}

function enq(i) {
    if ($("#zat")[0].childNodes.length > 5) return;
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
        for (j = 0; j < 3; j++) // Cambiar de 1 a 3 para añadir 3 imágenes de cada uno
            x.append('<img src="../resources/lccGame/images/' + names[i] + '.png"/>');
        x.show("slow");
    }
    restoreClick(0);
    removeClick(1);
}

google.load("jquery", "1");
google.setOnLoadCallback(function() {
    const gameWidth = 1536;
    const gameHeight = 730;
    space = (gameWidth - 325) / 2 - 200;
    console.log(space);
    lspace = space - 190;
    $("#zat").css("margin-left", space).addClass("clicca")
        .click(function() {
            $(this).removeClass("clicca").off("click");
            $(".inizia").slideUp(function() { $(this).remove(); });
            $("#zat").animate({left: -lspace}, "slow");
            $("#button").slideDown("slow");
            init();
        });
    $("#dialog").css({"left" : (gameWidth - 465) / 2,
    "top" : (gameHeight - 350) / 4});
    $("#button").click(function() { parti(); });
});