function fetchProfile(){
    window.location.href = "/editProfile";
}

function logout(){
    userLogout();
}


function checkAndUnlockLevels() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    const textContainer1 = document.querySelectorAll(".text")[0];
    // Nivel 1
    const text1 = document.getElementById("result1");
    if(user && user.moves_nivel_1 !== 0 && user.time_nivel_1 !== 0){
        textContainer1.classList.remove("locked");
        text1.innerHTML = 
            "Mejor resultado: <br>" + 
            "Movimientos: " + user.moves_nivel_1 + "<br>" +
            "Tiempo: " + formatearTiempoDecimal(user.time_nivel_1);
    } else {
        textContainer1.classList.add("locked");
        text1.innerHTML =
            "Aquí puedes ver tu mejor resultado: Menor cantidad de movimientos y menor tiempo realizado en el nivel"
    }

    // Nivel 2
    const nivel2 = document.getElementById("nivel-2");
    const square2 = document.getElementById("nivel-2-square");
    const icon2 = document.getElementById("icon-nivel-2");
    const textContainer2 = document.querySelectorAll(".text")[1];
    const text2 = document.getElementById("result2");

    if (user && user.moves_nivel_1 <= 10 && user.time_nivel_1 <= 0.5 && user.moves_nivel_1 !== 0 && user.time_nivel_1 !== 0) {
        nivel2.classList.remove("locked");
        nivel2.style.pointerEvents = "auto";
        icon2.style.display = "none";
        square2.classList.remove("locked");
        square2.style.borderColor = "rgba(59, 153, 30, 0.5)";
        textContainer2.classList.remove("locked");
        text2.innerHTML = (user.moves_nivel_2 !== 0 && user.time_nivel_2 !== 0) ?
            "Mejor resultado:  <br>" +
            "Movimientos: " + user.moves_nivel_2 + "<br>" +
            "Tiempo: " + formatearTiempoDecimal(user.time_nivel_2)
            : "Sin registros" + "<br>" + "Da tu mejor intento!";
    } else {
        nivel2.classList.add("locked");
        nivel2.style.pointerEvents = "none";
        square2.classList.add("locked");
        square2.style.borderColor = "rgba(153, 30, 30, 0.5)";
        textContainer1.classList.add("locked");
        text2.innerHTML = 
            "Para desbloquearme, logeate y supera el nivel 1: <br>" +
            "- Máx: 15 movimientos <br>" +
            "- En menos de 30 seg.";
    }
    // Nivel 3
    const nivel3 = document.getElementById("nivel-3");
    const square3 = document.getElementById("nivel-3-square");
    const icon3 = document.getElementById("icon-nivel-3");
    const textContainer3 = document.querySelectorAll(".text")[2];
    const text3 = document.getElementById("result3");

    if (user && user.moves_nivel_2 <= 6 && user.time_nivel_2 <= 0.5 && user.moves_nivel_2 !== 0 && user.time_nivel_2 !== 0) {
        nivel3.classList.remove("locked");
        nivel3.style.pointerEvents = "auto";
        icon3.style.display = "none";
        square3.classList.remove("locked");
        square3.style.borderColor = "rgba(59, 153, 30, 0.5)";
        textContainer3.classList.remove("locked");
        text3.innerHTML = (user.moves_nivel_3 !== 0 && user.time_nivel_3 !== 0) ?
            "Mejor resultado:  <br>" +
            "Movimientos: " + user.moves_nivel_3 + "<br>" +
            "Tiempo: " + formatearTiempoDecimal(user.time_nivel_3)
            : "Sin registros" + "<br>" + "Da tu mejor intento!";
    } else {
        nivel3.classList.add("locked");
        nivel3.style.pointerEvents = "none";
        square3.classList.add("locked");
        textContainer3.classList.add("locked");
        text3.innerHTML =
            "Para desbloquearme, logeate y supera el nivel 2:<br>" +
            "- Máx: 6 movimientos<br>" +
            "- En menos de 30 seg.";
    }

    // Nivel 4
    const nivel4 = document.getElementById("nivel-4");
    const square4 = document.getElementById("nivel-4-square");
    const icon4 = document.getElementById("icon-nivel-4");
    const textContainer4 = document.querySelectorAll(".text")[3];
    const text4 = document.getElementById("result4");

    if (user && user.moves_nivel_3 <= 15 && user.time_nivel_3 <= 1 && user.moves_nivel_3 !== 0 && user.time_nivel_3 !== 0) {
        nivel4.classList.remove("locked");
        nivel4.style.pointerEvents = "auto";
        icon4.style.display = "none";
        square4.classList.remove("locked");
        square4.style.borderColor = "rgba(59, 153, 30, 0.5)";
        textContainer4.classList.remove("locked");
        text4.innerHTML =(user.moves_nivel_4 !== 0 && user.time_nivel_4 !== 0) ?
            "Mejor resultado:  <br>" +
            "Movimientos: " + user.moves_nivel_4 + "<br>" +
            "Tiempo: " + formatearTiempoDecimal(user.time_nivel_4)
            : "Sin registros" + "<br>" + "Da tu mejor intento!";
    } else {
        nivel4.classList.add("locked");
        nivel4.style.pointerEvents = "none";
        square4.classList.add("locked");
        textContainer4.classList.add("locked");
        text4.innerHTML =
            "Para desbloquearme, logeate y supera el nivel 3:<br>" +
            "- Máx: 15 movimientos<br>" +
            "- En menos de 1 min.";
    }

    // Nivel 5
    const nivel5 = document.getElementById("nivel-5");
    const square5 = document.getElementById("nivel-5-square");
    const icon5 = document.getElementById("icon-nivel-5");
    const textContainer5 = document.querySelectorAll(".text")[4];
    const text5 = document.getElementById("result5");

    if (user && user.moves_nivel_4 <= 10 && user.time_nivel_4 <= 1 && user.moves_nivel_4 !== 0 && user.time_nivel_4 !== 0) {
        nivel5.classList.remove("locked");
        nivel5.style.pointerEvents = "auto";
        icon5.style.display = "none";
        square5.classList.remove("locked");
        square5.style.borderColor = "rgba(59, 153, 30, 0.5)";
        textContainer5.classList.remove("locked");
        text5.innerHTML =(user.moves_nivel_5 !== 0 && user.time_nivel_5 !== 0) ?
            "Mejor resultado:  <br>" +
            "Movimientos: " + user.moves_nivel_5 + "<br>" +
            "Tiempo: " + formatearTiempoDecimal(user.time_nivel_5)
            : "Sin registros" + "<br>" + "Da tu mejor intento!";
    } else {
        nivel5.classList.add("locked");
        nivel5.style.pointerEvents = "none";
        square5.classList.add("locked");
        textContainer5.classList.add("locked");
        text5.innerHTML =
            "Para desbloquearme, logeate y supera el nivel 4:<br>" +
            "- Máx: 10 movimientos<br>" +
            "- En menos de 1 min.";
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    mobileMenu.style.display = (mobileMenu.style.display === 'flex') ? 'none' : 'flex';
}

function formatearTiempoDecimal(totalMinutosDecimal) {
  // Convertir a minutos y segundos
  var minutos = Math.floor(totalMinutosDecimal);
  var segundos = Math.floor((totalMinutosDecimal - minutos) * 60);

  // Formatear la cadena
  var tiempoFormateado = minutos + " minutos y " + segundos + " segundos";

  return tiempoFormateado;
}

function checkLoginStatus(){
  // console.log("checkLoginStatus");
    if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
        document.querySelector(".nav-bar").style.justifyContent = "flex-end";
        document.getElementById("profile").style.display = "none";
        document.getElementById("mobile-profile").style.display = "none";
        document.getElementById("review").style.display = "none";
        document.getElementById("mobile-review").style.display = "none";
        document.getElementById("sign-out").innerHTML = 'Login  <i class="fa fa-sign-out" style="font-size:24px"></i>';
        checkAndUnlockLevels(null); 
    }
    else{
        const ign = JSON.parse(window.atob(localStorage.getItem("JWT").split('.')[1])).ign;
        document.getElementById("hellomsg").innerHTML = "Bienvenido, " + ign;
        getProfile();
    }
}

window.addEventListener('resize', checkScreenWidth);
function checkScreenWidth(){
    // Check if element is on the dom
    if (document.getElementById("mobile-menu")) {
        if(window.innerWidth < 600){
            document.getElementById("mobile-menu").style.display = "none";
        }
    }
}