window.onload = checkRegistrationOrLogin;
window.onpopstate = checkRegistrationOrLogin;
document.addEventListener("DOMContentLoaded", checkRegistrationOrLogin);

function isUserRegistered() {
  return localStorage.getItem("token") !== null;
}

function checkRegistrationOrLogin() {
  if (!isUserRegistered()) {
    window.location.href = "/log-in";
  }
}
