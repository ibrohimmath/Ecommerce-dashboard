"use strict";

const body = document.body;
const nav = document.querySelector("nav");
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");
const form = document.querySelector("form");
let editUser = false;

// -------
function getAdminDatasFromQueryParams() {
  const searchUrl = window.location.search;
  if (searchUrl) {
    editUser = true;
  }
  console.log(editUser);
  const urlSearch = new URLSearchParams(searchUrl);
  return urlSearch.entries();
}

function changeFormLabels() {
  document.title = editUser ? "Update Admin" : "Sign Up Admin";
  document.querySelector(".signup__title").textContent = editUser ? "Edit User" : "Sign Up";
  form.querySelector("button[type='submit']").textContent = editUser ? "Save" : "Signup";  
}

function fillDatas(adminDataEnries) {
  changeFormLabels();
  for (const [key, value] of adminDataEnries) {
    if (form.querySelector(`input[name=${key}]`)) {
      form.querySelector(`input[name=${key}]`).value = value;
    }
  }
}

function modifyAdminData() {
  const adminData = getAdminDatasFromQueryParams();
  // for (const [key, value] of adminData) {
  //   console.log(key, value);
  // }
  fillDatas(adminData);
}

// -------
async function createUser(obj) {
  try {
    let data = await fetch("http://localhost:4001/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    console.log(data);
    if (!data.ok) {
      Tost({ text: "Error!", type: "error" });
      setTimeout(TostDel, 2800);
      throw new Error("Error");
    }
    data = await data.json();
    console.log(data);
    return data;
  } catch(err) {
    console.log("Err", err);
  }
}

async function updateUser(obj) {
  try {
    let data = await fetch(`http://localhost:4001/admin/${obj.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    console.log(data);
    if (!data.ok) {
      Tost({ text: "Error!", type: "error" });
      setTimeout(TostDel, 2800);
      throw new Error("Error");
    }
    data = await data.json();
    console.log(data);
    return data;

  } catch (err) {
    console.log("Err", err);
  }
}

// -------
// Redirect functions
function redirectToDashboard() {
  window.location.href = "/dashboard/admin/index.html";
}

function redirectToLogin() {
  if (localStorage.getItem("token"))
    localStorage.removeItem("token");
  if (localStorage.getItem("userimage"))
    localStorage.removeItem("userimage");
  window.location.href = "/dashboard/auth/log-in/index.html";
}

// ------- 
// Profile image

function getUserImage() {
  return localStorage.getItem("userimage");
}

function renderUserImage() {
  const img = getUserImage();
  if (!img) {
    redirectToLogin();
  }
  nav.querySelector(".img-user").querySelector("img").src = getUserImage(); 
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
  if (tost) {
    tost.remove();
  }
}

// -------
// Main functions
// Redirect to dashboard from signup page when the user is not superadmin
if (!(localStorage.getItem("token") && localStorage.getItem("token") === "superadmin")) {
  redirectToDashboard();
}

if (getUserImage()) {
  renderUserImage();
}

modifyAdminData();

document.querySelector(".sidebar-open").addEventListener("click", redirectToDashboard);
document.querySelector(".goto-login").addEventListener("click", function(e) {
  redirectToLogin();
});

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  let adminData;
  if (editUser) {
    adminData = getAdminDatasFromQueryParams();
  }
  
  const formData = new FormData(form);
  if (adminData) {
    formData.append("id", Object.fromEntries(adminData).id);
  } else {
    formData.append("id", formData.get("login"));
  }
  const obj = Object.fromEntries(formData);
  console.log(obj);
  let res;
  if (!editUser) {
    res = await createUser(obj);
  } else {
    res = await updateUser(obj);
  }
  
  if (res.id) {
    for (let i = 0; i <= 5; i++) {
      form.children[i].value = "";
    }
    Tost({ text: `Admin was successfully ${editUser ? "updated" : "created"}`, type: "success" });
    setTimeout(function() {
      TostDel();
      redirectToDashboard();
    }, 2800);
  }

  return false;
});