"use strict";

const form = document.querySelector("form");

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const inputUsername = document.querySelector("input[type='text']");
  const inputPassword = document.querySelector("input[type='password']");
  console.log(inputUsername.value);
  console.log(inputPassword.value);
  window.location.href = `http://127.0.0.1:5500/second.html/?userName=${inputUsername.value}&&userPassword=${inputPassword.value}`;
});