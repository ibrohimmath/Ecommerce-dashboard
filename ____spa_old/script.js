"use strict";

const app = document.querySelector(".app");

// -----

let nav = null;
let sidebar = null;
let container = null;

// -----

function clear(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// -----



// -----

const history = {
  push(url) {
    window.history.pushState({}, "", `#/${url}`); 
    sessionStorage.setItem("path", url);
  },
  path() {
    return sessionStorage.getItem("path");
  },
};

// -----

const navObject = {
  addComponents() {
    nav = document.createElement("nav");
    nav.innerHTML = `
      <div class="logo">
        <img src="../img/logo.png" alt="">
        <span class="sidebar-open">
          <i class="fa-solid fa-bars"></i>
        </span>
      </div>
      <ul>
        <li>
          <span class="notification">
            <i class="fa-solid fa-bell"></i>
            <span class="notification__num">0</span>
          </span>
        </li>
        <li>
          <span class="mode">
            <i class="fa-solid fa-moon"></i>
          </span>
        </li>
        <li>
          <span class="img-user">
            <img src="../img/dashboard/unknown.png" alt="">
          </span>
        </li>
      </ul>
    `;

    app.appendChild(nav);
  },
  setNumNotification(num) {
    nav.querySelector(".notification__num").textContent = num;
  },
  setUserImage(imageUrl) {
    nav.querySelector(".img-user").src = imageUrl;
  }
};

const sidebarObj = {
  addComponents() {
    sidebar = document.createElement("div");
    sidebar.setAttribute("class", "sidebar");  
    sidebar.innerHTML = `
      <div class="sidebar__nav">
        <img src="../img/logo.png" alt="">
        <span class="sidebar-close">
          <i class="fa-solid fa-xmark"></i>
        </span>      
      </div>
      <div class="user-functions">
        <div class="user-function dashboard">
          <span class="function__logo"><i class="fa-solid fa-house"></i></span>
          <span class="function__name">Dashboard</span>
        </div>
        <div class="user-function products">
          <span class="function__logo"><i class="fa-solid fa-bag-shopping"></i></span>
          <span class="function__name">Products</span>
        </div>
        <ul class="products-format hidden">
          <li class="product--show">Product list</li>
          <li class="product__categories">Categories</li>
        </ul>
        <div class="user-function add-products">
          <span class="function__logo">+</span>
          <span class="function__name">Add product</span>
        </div>
      </div>
    `;

    app.appendChild(sidebar)
  },
  openSidebar() {
    if (sidebar.classList.contains("sidebar-move--right")) return;
    sidebar.classList.toggle("sidebar-move--right");

    nav.querySelector(".logo").classList.toggle("hidden");
    nav.style.justifyContent = "flex-end";
    nav.style.width = "82vw";

    container.style.width = "81.4vw";
  },
  closeSidebar() {
    if (!sidebar.classList.contains("sidebar-move--right")) return;
    sidebar.classList.toggle("sidebar-move--right");
    
    nav.querySelector(".logo").classList.toggle("hidden");
    nav.style.justifyContent = null;
    nav.style.width = "100vw";

    container.style.width = "100vw";
  },
  deactivateUserFunction() {
    if (!sidebar.querySelector(".user-function--selected")) return;
    sidebar.querySelector(".user-function--selected").classList.toggle("user-function--selected");
  },
  activateUserFunction(item) {
    this.deactivateUserFunction();
    if (item.classList.contains("user-function--selected")) return;
    item.classList.toggle("user-function--selected");
    console.log("Activated user-function div", item);
  }
};

const containerObj = {
  addComponents() {
    container = document.createElement("div");
    container.setAttribute("class", "container");
    app.appendChild(container);
  },  
  addProductsShowPage() {
    container.innerHTML = `
      <div class="productshow__row-head">
        <div class="productshow__info">
          <div class="productshow__title">Products List</div>
          <div class="productshow__desc">Lorem ipsum dolor sit amet.</div>
        </div>
        <div class="productshow__func-button">
          <button class="export">Export</button>
          <button class="import">Import</button>
          <button class="create-new btn--active">Create New</button>
        </div>
      </div>
      <div class="products__lists">
        <div class="products__row-settings">
          <select class="products__categories-select">
            <option value="all_category">All category</option>
          </select>
          <div class="products__date-and-status">
            <input type="date" class="product--date" value="mm-dd-yyyy">
            <select class="product__status">
              <option value="active" selected>Active</option>
              <option value="archived">Archived</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>
        <div class="product__row">
          <div class="product-col__image">
            <img src="https://cdn.dummyjson.com/product-images/1/1.jpg" alt="">
          </div>
          <div class="product-col__info">
            An apple mobile which is nothing like apple
          </div>
          <div class="product-col__price">
            $549
          </div>
          <div class="product-col__status">
            <div class="status--active">
              Active
            </div>
          </div>
          <div class="product-col__date">
            05.04.2024
          </div>
          <div class="product-col__funcs">
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
          </div>
        </div>
        <div class="product__row">
          <div class="product-col__image">
            <img src="https://cdn.dummyjson.com/product-images/1/1.jpg" alt="">
          </div>
          <div class="product-col__info">
            An apple mobile which is nothing like apple
          </div>
          <div class="product-col__price">
            $549
          </div>
          <div class="product-col__status">
            <div class="status--archived">
              Archived
            </div>
          </div>
          <div class="product-col__date">
            05.04.2024
          </div>
          <div class="product-col__funcs">
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
          </div>
        </div>  
        <div class="product__row">
          <div class="product-col__image">
            <img src="https://cdn.dummyjson.com/product-images/1/1.jpg" alt="">
          </div>
          <div class="product-col__info">
            An apple mobile which is nothing like apple
          </div>
          <div class="product-col__price">
            $549
          </div>
          <div class="product-col__status">
            <div class="status--disabled">
              Disabled
            </div>
          </div>
          <div class="product-col__date">
            05.04.2024
          </div>
          <div class="product-col__funcs">
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
          </div>
        </div>                
      </div>
    `;
  },
  addProductCreatePage() {
    container.innerHTML = `
      <div class="productscreate__row-head">
        <div class="productscreate__title">Add New Product</div>
        <div class="productscreate__func-button">
          <button class="publish btn--active">Publish</button>
        </div>
      </div>
      <form class="productscreate__form">
        <label for="title">Product title</label>
        <input type="text" class="title" name="title" id="title" placeholder="Type here">
        <label for="desc">Description</label>
        <textarea name="description" id="desc" rows="4"></textarea>
        <label for="img">Images</label>
        <input name="image" type="file" id="img" class="img" accept="image/png, image/gif, image/jpeg" />        
        <div class="productscreate__row">
          <p>
            <label for="price">Price</label>
            <input type="number" name="price" id="price" class="price" placeholder="Type here">          
          </p>
          <p>
            <label for="category">Category</label>
            <input type="text" name="category" id="category" class="category" placeholder="Type here">
          </p>
        </div>
      </form>
    `;
  },
};

const userObj = {
  // addSignupPage() {
  //   container.innerHTML = `

  //   `;
  // },
  addLoginPage() {
    container.innerHTML = `
      <div class="logindiv">
        <div class="logindiv__title">
          Sign In
        </div>
        <form>
          <input type="text" placeholder="Firstname" name="firstName">        
          <input type="password" placeholder="Password" name="password">
          <button type="submit">Login</button>
        </form>
        <div class="row__signup">
          <span>Don't have an account. </span>&nbsp;
          <span class="goto-signup">Sign up</span>
        </div>
      </div>
    `;
  },
};

// -----

document.addEventListener("DOMContentLoaded", function(e) {
  navObject.addComponents();
  sidebarObj.addComponents();
  containerObj.addComponents();
  userObj.addLoginPage();

  if (history.path()) {
    if (history.path() == "admin") {
      window.history.pushState({}, document.title, window.location.pathname);
      history.push("admin");
    }    
  } else {
    history.push("admin");
  }

  collectEventListeners();
});

// -----

function collectEventListeners() {
  document.querySelector(".sidebar-open").addEventListener("click", sidebarObj.openSidebar);
  document.querySelector(".sidebar-close").addEventListener("click", sidebarObj.closeSidebar);
  sidebar?.querySelector(".products").addEventListener("click", function(e) {
    let el = e.target;
    sidebar.querySelector(".products-format").classList.toggle("hidden");
  }); 
  sidebar?.addEventListener("click", function(e) {
    let el = e.target;
    if (el.classList.contains("product--show")) {
      containerObj.addProductsShowPage(); 
      return;
    } 
    if (!el.classList.contains("user-function")) el = el.closest(".user-function");
    if (el.classList.contains("add-products")) {
      containerObj.addProductCreatePage();
      container.querySelector(".publish").addEventListener("click", function(e) {
        const form = container.querySelector("form");
        console.log(form);
        let formData = new FormData(form);
        for (const [key, val] of formData.entries()) {
          console.log("Property", key);
          console.log("Property value", val);
        }
      });
    }
    sidebarObj.activateUserFunction(el);
  });
}

// Project  SPA (old version) by mylsef