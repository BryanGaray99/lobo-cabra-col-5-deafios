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

  if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    return editProfileScores(gameName, ign, newScore, newTime);
  } else if (result.status === 'ok') {
    // console.log('Successfully updated score', result.user);
    const newMovesAndTimeData = {
      moves_nivel_1: result.user.moves_nivel_1,
      moves_nivel_2: result.user.moves_nivel_2,
      moves_nivel_3: result.user.moves_nivel_3,
      moves_nivel_4: result.user.moves_nivel_4,
      moves_nivel_5: result.user.moves_nivel_5,
      time_nivel_1: result.user.time_nivel_1,
      time_nivel_2: result.user.time_nivel_2,
      time_nivel_3: result.user.time_nivel_3,
      time_nivel_4: result.user.time_nivel_4,
      time_nivel_5: result.user.time_nivel_5,
    };
    
    // Retrieve existing user data from sessionStorage
    var storedUser = JSON.parse(sessionStorage.getItem('user')) || {};

    // Update only moves and time fields
    const updatedUserMovesAndTime = {
      ...storedUser,
      ...newMovesAndTimeData,
    };

    // Log the updated user data
    // console.log(updatedUserMovesAndTime);

    // Store the updated user data back into sessionStorage
    sessionStorage.setItem('user', JSON.stringify(updatedUserMovesAndTime));
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
      currScoreHtml = `<div class="single-member-score"><div class="position_number">${i+1}</div><div class="details-for-member"><span class="name">${result.records[i].ign}</span><span class="score">${result.records[i].score} movimientos.</span></div></div>`
      innerhtml = innerhtml + currScoreHtml;
    }

    if(!innerhtml){
      innerhtml = '<div class="empty-board" style="padding: 19px;"><span style="color: darkblue;font-size: 21px;">Aun no hay registros, se el primero!</span></div>';
    }
    // console.log('innerhtml ' ,innerhtml);
    return innerhtml;
  }
  else if(result.status == 'error' && result.tokenExpired){
    await getNewAcessToken();
    getLeaderboardScores(gameName);
  }
}

async function getProfile(){
  const ACCESS_TOKEN = localStorage.getItem("JWT");
  const ign = JSON.parse(window.atob(ACCESS_TOKEN.split('.')[1])).ign;
  // const ign = obj.ign;
  // console.log(ign);
  const response = await fetch('/api/profile', {
    method: 'POST',
    headers: {
      'Authorization': 'ACCESS_TOKEN '+ ACCESS_TOKEN,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      ign
    })
  })
  .catch(err => console.log(err))
  .then(res => res.json())
  .then((res) => {
    // console.log(res.user);
    if(res.user){
      var uuser = JSON.stringify(res.user);
      // console.log(uuser);
      sessionStorage.setItem("user", uuser);
      checkAndUnlockLevels();
    }
  });
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