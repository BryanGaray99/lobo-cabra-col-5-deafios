function show(){
    // console.log(user);
    const user = JSON.parse(sessionStorage.getItem("user"));
    console.log(user);
    const url = "https://ui-avatars.com/api/?name=" + user.firstName + "+"+ user.lastName + "&background=faebd7";
    document.querySelector(".profileImage").src = url;
    document.querySelector(".profileImageShort").src = url;
    document.getElementById("ign").innerHTML = user.ign;
    document.getElementById("name").innerHTML =  user.firstName +" " + user.middleName + " "+ user.lastName;
    document.getElementById("email").innerHTML = user.useremail;
    document.getElementById("nivel-1").innerHTML = user.moves_nivel_1;
    document.getElementById("nivel-2-moves").innerHTML = user.moves_nivel_2 !== 0 ? "Movimientos: " + user.moves_nivel_2 : "Sin registros";
    document.getElementById("nivel-2-time").innerHTML = user.time_nivel_2 !== 0 ? "Tiempo: " + formatearTiempoDecimal(user.time_nivel_2) : "";
    document.getElementById("nivel-3").innerHTML = user.moves_nivel_3;
    document.getElementById("nivel-4").innerHTML = user.moves_nivel_4;
    document.getElementById("nivel-5").innerHTML = user.moves_nivel_5;

}

function formatearTiempoDecimal(totalMinutosDecimal) {
  // Convertir a minutos y segundos
  var minutos = Math.floor(totalMinutosDecimal);
  var segundos = Math.round((totalMinutosDecimal - minutos) * 60);

  // Formatear la cadena
  var tiempoFormateado = minutos + " minutos y " + segundos + " segundos";

  return tiempoFormateado;
}
