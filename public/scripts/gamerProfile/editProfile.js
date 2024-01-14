const user = JSON.parse(sessionStorage.getItem("user"));

document.querySelector("h1").innerHTML = user.ign;
document.getElementById("firstName").value = user.firstName;
document.getElementById("middleName").value = user.middleName;
document.getElementById("lastName").value = user.lastName;
document.getElementById("email").value = user.useremail;

const url = "https://ui-avatars.com/api/?name=" + user.firstName + "+"+ user.lastName + "&background=faebd7";
document.querySelector(".avatarimg").src = url;

document.addEventListener('submit', editUserProfile);
function editUserProfile(e){
    e.preventDefault();
    editProfile();
}