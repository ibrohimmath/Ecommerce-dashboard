let body = document.querySelector("body");

let form = document.querySelector("#form");
async function Login(obj) {
  try {
    let data = await fetch("https://fakestoreapi.com/auth/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(obj),
    });
    if (!data.ok) {
      Tost({ text: "Error !", type: "error" });
      setTimeout(TostDel2, 2800);
    }
    return data.json();
  } catch (err) {
    console.log("err", err);
  }
}

function Tost(mas) {
  // {
  //     text:"Success !",
  //     type:"success"
  // }
  // {
  //     text:"Information !",
  //     type:"information"
  // }
  // {
  //     text:"Error !",
  //     type:"error"
  // }
  // {
  //     text:"Warning !",
  //     type:"warning"
  // }

  let tost = document.createElement("div");
  tost.classList.add("tost");
  tost.classList.add(mas.type);
  tost.innerHTML = `<h3>${mas.text}</h3> <span></span>`;
  body.appendChild(tost);
}

function TostDel() {
  let tost = document.querySelector(".tost");
  tost.remove();
  // window.location.href = "/";
}

function TostDel2() {
  let tost = document.querySelector(".tost");
  tost.remove();
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  let formData = new FormData(form);
  let data = Object.fromEntries(formData);

  if (data) {
    let res = await Login(data);

    if (res.token) {
      form.children[1].value = "";
      form.children[5].value = "";

      localStorage.setItem("token", res.token);

      Tost({ text: "Success !", type: "success" });
      setTimeout(TostDel, 2800);
    }
  }
});

// Login function with Tost manipulating function