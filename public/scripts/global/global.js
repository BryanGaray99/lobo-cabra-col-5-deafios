async function getNewAcessToken(){
  const REFRESH_TOKEN = localStorage.getItem("RefreshToken");
  const newAccessToken = await fetch('/token', {
    method: 'POST',
    headers: {
      'Authorization': 'REFRESH_TOKEN '+ REFRESH_TOKEN,
      'Content-type': 'application/json'
    }
  }).then(res => res.json());

  if(localStorage.getItem("JWT")){
    localStorage.removeItem("JWT");
  }
  localStorage.setItem("JWT", newAccessToken.accessToken);
}

async function recordDurationStatistics(gameName, duration_mins){
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch('/api/gamePlayedDuration', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName, duration_mins
    })
  }).then(res => res.json());

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    recordDurationStatistics(gameName, duration_mins);
  }
}

async function userLogout(){
  const REFRESH_TOKEN = localStorage.getItem("RefreshToken");
  const response = await fetch('/api/logout', {
    method: 'DELETE',
    headers: {
      'Authorization': 'REFRESH_TOKEN '+ REFRESH_TOKEN,
      'Content-type': 'application/json'
    }
  })
  .then(res => res.json())
  .catch(err => console.log(err))
  .then(() => {
    if(localStorage.getItem("JWT")){
      localStorage.removeItem("JWT");
      localStorage.removeItem("RefreshToken");
    }
    if(sessionStorage.getItem("user")){
      sessionStorage.removeItem("user");
    }
  })
  .then(() => {
    window.location.href = "/login";
  });
}

async function addScoreToLeaderboard(gameName, ign, hashedEmail, score){
  // console.log('gameName, ign, score ', gameName, ign, score);
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch(`/api/games/${gameName}`, {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName, ign, hashedEmail, score
    })
  }).then(res => res.json());

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    addScoreToLeaderboard(gameName, ign, hashedEmail, score);
  }
}

async function editProfileScores(gameName, ign, newScore, newTime){
  const ACCESS_TOKEN = localStorage.getItem("JWT");

  const result = await fetch('/api/editProfileScores', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      ign, gameName, newScore, newTime
    })
  }).then(res => res.json());

  // console.log('Response from server:', result);

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    return editProfileScores(gameName, ign, newScore);
  } else if (result.status === 'ok') {
  } else {
    console.error('Failed to update score:', result.msg);
  }
}

async function getLeaderboardScores(gameName){
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const result = await fetch('/api/leaderboard', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      gameName
    })
  }).then(res => res.json())

  if(result.status === 'ok'){
    var length = (result.records.length >= 5) ? 5 : result.records.length;
    var innerhtml = "";

    for(var i=0; i<length; i++){
      currScoreHtml = `<div class="single-member-score"><div class="position_number">${i+1}</div><div class="details-for-member"><div><img class="profile-pic" src="https://www.gravatar.com/avatar/${result.records[i].hashedEmail}?d=monsterid"/></div><span class="name">${result.records[i].ign}</span><span class="score">${result.records[i].score} pts.</span></div></div>`
      innerhtml = innerhtml + currScoreHtml;
    }

    if(!innerhtml){
      innerhtml = '<div class="empty-board" style="padding: 19px;"><span style="color: darkblue;font-size: 21px;">Looks like no one tops the board yet. Be the first.</span></div>';
    }
    // console.log('innerhtml ' ,innerhtml);
    return innerhtml;
  }
  else if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    getLeaderboardScores(gameName);
  }
}

async function getProfile() {
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const ign = JSON.parse(window.atob(ACCESS_TOKEN.split('.')[1])).ign;

  try {
    const response = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Authorization': 'ACCESS_TOKEN ' + ACCESS_TOKEN,
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        ign
      })
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const res = await response.json();
    // console.log(res.user);
    
    // Llama a getUserData solo después de obtener la respuesta.
    getUserData(res.user);
  } catch (error) {
    console.error(error);
  }
}

async function editProfile(){
  const firstName = document.getElementById("firstName").value;
  const middleName = document.getElementById("middleName").value;
  const lastName = document.getElementById("lastName").value;
  // const ACCESS_TOKEN = localStorage.getItem("JWT");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ign = user.ign;

  const result = await fetch('/api/editProfile', {
  method: 'POST',
  headers: {
    'Content-type' : 'application/json'
  },
  body: JSON.stringify({
    ign, firstName, middleName, lastName
  })
  }).then(() => {
      user.firstName = firstName;
      user.lastName = lastName;
      user.middleName = middleName;
      let uuser = JSON.stringify(user);
      sessionStorage.setItem("user", uuser);
      window.location.href="/gamerProfile";
  });
}

async function sendReview(review) {
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const ign = user.ign;
  try {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Authorization': 'ACCESS_TOKEN ' + ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ign, review 
      }),
    });

    return response;
  } catch (error) {
    console.error('Error en la llamada al endpoint:', error);
    throw error;
  }
}

function checkLoginStatus(){
  // console.log("checkLoginStatus");
    if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
        document.getElementById("profile").style.display = "none";
        document.getElementById("review").style.display = "none";
        document.getElementById("sign-out").innerHTML = "Login";
        document.getElementById("nav-bar").style = "width: min-content; float: right; margin-right: 20px;";
        checkAndUnlockLevels(null); 
    }
    else{
        const ign = JSON.parse(window.atob(localStorage.getItem("JWT").split('.')[1])).ign;
        document.getElementById("hellomsg").innerHTML = "Bienvenido, " + ign;
        getProfile();
    }
}

function checkLevelStatus(){
  if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
    document.getElementById("login-btn").innerHTML = "Login";
    isLoggedIn = false;
    const currentRoute = window.location.pathname;
    switch (currentRoute) {
      case "/games/nivel-2/":
        blockedLevel2(""); 
        break;
      case "/games/nivel-3/":
        blockedLevel3("");
        break;
      case "/games/nivel-4/":
        blockedLevel4("");
        break;
      case "/games/nivel-5/":
        blockedLevel5("");
        break;
      default:
        break; 
    }
  } else {
    // console.log("Todo ok")
    getProfile();
  }
}

function getUserData(user){
  if(user){
      var setUser = JSON.stringify(user);
      // console.log(setUser);
      sessionStorage.setItem("user", setUser);
      // Filtra solo las propiedades deseadas
      const userDataToStore = {
        moves_nivel_1: user.moves_nivel_1,
        moves_nivel_2: user.moves_nivel_2,
        moves_nivel_3: user.moves_nivel_3,
        moves_nivel_4: user.moves_nivel_4,
        moves_nivel_5: user.moves_nivel_5,
        time_nivel_1: user.time_nivel_1,
        time_nivel_2: user.time_nivel_2,
        time_nivel_3: user.time_nivel_3,
        time_nivel_4: user.time_nivel_4,
        time_nivel_5: user.time_nivel_5,
      };

      // Serializa y guarda en el localStorage
      const userDataJSON = JSON.stringify(userDataToStore);
      localStorage.setItem("userData", userDataJSON);

      setUserData();
  }
}

function setUserData(user){
    var getUser = JSON.parse(sessionStorage.getItem("user"));
    const currentRoute = window.location.pathname;
    switch (currentRoute) {
      case "/games":
        checkAndUnlockLevels(getUser);
        // console.log("Funciona ruta games");
        break;
      case "/games/nivel-2/":
        // console.log("Funciona ruta nivel 2");
        blockedLevel2(getUser);
        break;
      case "/games/nivel-3/":
        blockedLevel3(getUser);
        // console.log("Funciona ruta nivel 3");
        break;
      case "/games/nivel-4/":
        blockedLevel4(getUser);
        // console.log("Funciona ruta nivel 4");
        break;
      case "/games/nivel-5/":
        blockedLevel5(getUser);
        // console.log("Funciona ruta nivel 5");
        break;
      default:
        break; 
    }
}