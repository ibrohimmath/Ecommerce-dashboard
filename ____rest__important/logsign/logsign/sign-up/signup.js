let body = document.querySelector("body");

let form = document.querySelector(".form");
let name = document.querySelector("#name");
let password = document.querySelector("#password");
let btn = document.querySelector(".btn");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(password.value, name.value);
});
