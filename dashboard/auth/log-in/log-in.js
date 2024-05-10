"use strict";

const body = document.body;
const form = document.querySelector("form");

// --------

async function Login(obj) {
  const {login, password, admintype} = obj;
  console.log(admintype);
  try {
    let data = await fetch(`http://localhost:4001/${admintype}?login=${login}&&password=${password}`);
    if (!data.ok) {
      Tost({ text: "Error!", type: "error" });
      setTimeout(TostDel, 2800);
      throw new Error("Error");
    }
    data = await data.json();
    if (!data.length) {
      Tost({ text: "Error!", type: "error" });
      setTimeout(TostDel, 2800);
      throw new Error("Error");
    }
    [data] = data;
    localStorage.setItem("userimage", data.image);
    return data;
  } catch(err) {
    console.log("Err", err);
  }
}

// --------

function Tost(mas) {
  const tost = document.createElement("div");
  tost.classList.add("tost");
  tost.classList.add(mas.type);
  tost.innerHTML = `<h3>${mas.text}</h3> <span></span>`;
  body.appendChild(tost);
}

function TostDel() {
  const tost = document.querySelector(".tost");
  if (tost)
    tost.remove();
}

// --------

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  let formData = new FormData(form);
  let data = Object.fromEntries(formData);

  if (data) {
    let res = await Login(data);
    if (res.id) {
      form.children[0].value = form.children[1].value = "";
      localStorage.setItem("token", res.id);
      Tost({ text: "Welcome, admin!", type: "success" });
      setTimeout(function() {
        TostDel();
        // window.location.href = "/dashboard/admin/index.html";
        redirectToDashboard();
      }, 2800);
    }
  }

  return false;
});

// --------
// Redirect functions

function redirectToSignUp() {
  window.location.href = "/dashboard/auth/sign-up/index.html";
}

function redirectToDashboard() {
  window.location.href = "/dashboard/admin/index.html";
}

// --------

document.querySelector(".goto-signup").addEventListener("click", function(e) {
  redirectToSignUp();
});