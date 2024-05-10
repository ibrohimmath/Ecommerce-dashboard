window.onload = checkRegistrationOrLogin;
window.onpopstate = checkRegistrationOrLogin;
document.addEventListener("DOMContentLoaded", checkRegistrationOrLogin);

function isUserRegistered() {
  return localStorage.getItem("token") !== null;
}

function checkRegistrationOrLogin() {
  if (!isUserRegistered()) {
    if (localStorage.getItem("token"))
    localStorage.removeItem("token");
    if (localStorage.getItem("userimage"))
      localStorage.removeItem("userimage");
    window.location.href = "/dashboard/auth/log-in/index.html"; 
  }
}