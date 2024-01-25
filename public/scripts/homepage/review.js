const ratings = document.querySelectorAll(".rating");
const ratingsContainer = document.querySelector(".ratings-container");
const sendBtn = document.querySelector("#send");
const panel = document.querySelector("#panel");
let selectedRating = "";

function removeActive() {
  ratings.forEach((rating) => rating.classList.remove("active"));
}

function getRatingValue(ratingText) {
  const ratingMap = {
    'No me gustó': 1,
    'Puede mejorar': 2,
    'Neutral': 3,
    'Estuvo bien': 4,
    'Me encantó': 5,
  };

  return ratingMap[ratingText] || 0;
}

ratingsContainer.addEventListener("click", (e) => {
  removeActive();
  if (
    e.target.parentNode.classList.contains("rating") &&
    e.target.nextElementSibling
  ) {
    e.target.parentNode.classList.add("active");
    selectedRating = e.target.nextElementSibling.innerHTML;
  } else if (
    e.target.parentNode.classList.contains("rating") &&
    e.target.previousElementSibling
  ) {
    e.target.parentNode.classList.add("active");
    selectedRating = e.target.innerHTML;
  } else if (e.target.classList.contains("rating")) {
    e.target.classList.add("active");
    selectedRating = e.target.children[1].innerText;
  }
});

sendBtn.addEventListener("click", () => {
  panel.innerHTML = `
    <i class="fas fa-heart" style="color: red;"></i>
    <strong>Muchas Gracias!</strong>
    <br> 
    <strong>Feedback: ${selectedRating}</strong>
    <p>Tendremos en cuenta tu apreciación para seguir mejorando.</p>
    <p>¿Preguntas o sugerencias? Escríbenos	 <a href="mailto:bryangorayacademico@gmail.com">bryangorayacademico@gmail.com</a></p>
  `;

  // Llamar a la función para enviar la retroalimentación
  sendReview(getRatingValue(selectedRating));
});

function checkLoginStatus(){
  if(!(localStorage.getItem("JWT") && localStorage.getItem("RefreshToken"))){
    document.getElementById("panel").classList.add("blocked");
    document.getElementById("not-logged-pannel").classList.add("unlocked");
  }
}