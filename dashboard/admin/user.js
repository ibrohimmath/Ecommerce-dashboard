"use strict";

const nav = document.querySelector("nav");
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");
const body = document.body;

// ------- 
let queryObj = {};
function hasAlreadyQuery() {
  return window.location.href.includes("?");
}

function clearQueryParams() {
  if (!hasAlreadyQuery()) return;
  window.location.href = window.location.href.split("?")[0];
}

function configSearchUrl(searchUrl) {
  let q = [], category = [];
  if (!searchUrl.includes("&&")) {
    return searchUrl;
  }
  searchUrl = searchUrl.split("&&");
  // console.log(searchUrl);
  for (const id in searchUrl) {
    if (searchUrl[id].startsWith("q=")) {
      q.push(searchUrl[id]);
      continue;
    }
    if (searchUrl[id] !== "category=") {
      category.push(searchUrl[id]);
    }
  }
  if (q.length && category.length) {
    return `${q.at(-1)}&&${category.at(-1)}`;
  } else {
    return q.at(-1) || category.at(-1);
  }
}

// If url has 2+ ? chars we need to config url

// Old version
// function configUrl() {
//   if (!hasAlreadyQuery()) return;
//   let lst = window.location.href.split("?");
//   window.location.href = lst[0] + "?" + configSearchUrl(lst[lst.length - 1]);
//   console.log(window.location.href);
// }
function configUrl() {
  if (!hasAlreadyQuery()) return;
  if (window.location.href.includes("all_category")) {
    window.location.href = window.location.href.replace("all_category", "");
  }
  const lst = window.location.href.split("?");
  const newSearchUrl = configSearchUrl(lst[lst.length - 1]);
  if (newSearchUrl !== lst[lst.length - 1]) {
    window.location.href = lst[0] + "?" + newSearchUrl;
    console.log("Configured url", window.location.href);
  }
}
configUrl();

// Old version
// function getQueryParams() {
//   if (!hasAlreadyQuery()) return;
//   const searchUrl = window.location.search;
//   const searchParams = new URLSearchParams(searchUrl);
//   let queryString = "?";
//   const arr = [...searchParams.entries()];
//   for (const id in arr) {
//     const [key, val] = arr[id];
//     queryString += `${key}=${val}`;
//     if (id < arr.length - 1) queryString += "&&";
//   }
//   console.log(queryString);
//   return queryString;
// }
function getQueryParams() {
  if (!hasAlreadyQuery()) return;
  let searchUrl = window.location.search;
  const searchParams = new URLSearchParams(searchUrl);
  let queryString = "?";
  for (const [key, val] of searchParams.entries()) {
    queryString += `${key}=${val}`;
    queryString += "&&";
    queryObj[key] = val;
  }
  queryString = queryString.slice(0, -2); // Remove the trailing "&&"
  console.log("QueryString", queryString);
  console.log(queryObj);
  return queryString;
}
getQueryParams();

function addQueryParam(str) {
  if (hasAlreadyQuery()) {
    window.location.href += `&&${str}`;
    return;
  }
  window.location.href += `?${str}`;
}

function insertBefore(divbefore, html) {
  divbefore.insertAdjacentHTML("beforebegin", html);
}

function clear(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// ------- 
// Checking admin is whether the superadmin
function isSuperAdmin() {
  return localStorage.getItem("token") === "superadmin";
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

// ------- 
// Sidebar functionalities

function openSidebar() {
  if (sidebar.classList.contains("sidebar-move--right")) return;
  sidebar.classList.toggle("sidebar-move--right");

  nav.querySelector(".logo").classList.toggle("hidden");
  nav.style.justifyContent = "flex-end";
  nav.style.width = "82vw";

  container.style.width = "81.4vw";
}

function closeSidebar() {
  if (!sidebar.classList.contains("sidebar-move--right")) return;
  sidebar.classList.toggle("sidebar-move--right");
  
  nav.querySelector(".logo").classList.toggle("hidden");
  nav.style.justifyContent = null;
  nav.style.width = "100vw";

  container.style.width = "100vw";
}

function redirectToLogin() {
  if (localStorage.getItem("token"))
    localStorage.removeItem("token");
  if (localStorage.getItem("userimage"))
    localStorage.removeItem("userimage");
  window.location.href = "/dashboard/auth/log-in/index.html";
}

function redirectToSignUp(queryParam) {
  let url = "/dashboard/auth/sign-up/index.html";
  if (queryParam) {
    url += queryParam;
  }
  window.location.href = url;  
}

// ------- 
// Simple Admin functionalities
if (isSuperAdmin()) {
  const products = sidebar.querySelector(".products");
  let html;
  html = `
    <div class="user-function add-admin">
      <span class="function__logo"> <i class="fa-solid fa-user-plus"></i></span>
      <span class="function__name">Add Admin</span>
    </div>
  `;
  insertBefore(products, html);
  html = `
    <div class="user-function users">
      <span class="function__logo"><i class="fa-solid fa-users"></i></span>
      <span class="function__name">Admins</span>
    </div>
  `;
  insertBefore(products, html);
}

// Admin request functions
async function getOneAdmin(id) {
  try {
    const res = await fetch(`http://localhost:4001/admin/${id}`);
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    let data = await res.json();
    return data;
  } catch (err) {
    Tost({ text: `Cannot get user ${err.message}`, type: "error" });
    setTimeout(TostDel, 2800);
  }
}

async function deleteOneAdmin(id) {
  try {
    const res = await fetch(`http://localhost:4001/admin/${id}`, {
      method: "DELETE",
    })
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.log("Err", err);
  }
}

async function getAdmins() {
  try {
    const res = await fetch("http://localhost:4001/admin");
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    let data = await res.json();
    data.forEach(({firstName, lastName, login, password, email, image, id}) => {
      container.querySelector(".users__lists").insertAdjacentHTML("beforeend", `
        <div class="user__row" data-userid="${id}">
          <div class="user-col__image">
            <img src="${image}" alt="">
          </div>
          <div class="user-col__firstname">
            ${firstName}
          </div>
          <div class="user-col__lastname">
            ${lastName}
          </div>
          <div class="user-col__username">
            ${login}
          </div>
          <div class="user-col__password">
            ${password}
          </div>
          <div class="user-col__email">
            ${email}
          </div>
          <div class="user-col__funcs">
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
          </div>
        </div>       
      `);
    });
  } catch(err) {
    console.log("Err", err);
  }

}

async function showAdmins() {
  container.innerHTML = `
    <div class="usersshow__row-head">
      <div class="usersshow__info">
        <div class="usersshow__title">Admins List</div>
      </div>
    </div>
    <div class="users__lists">
      <div class="user__row">
        <div class="user-col__image-header">
          Image
        </div>
        <div class="user-col__firstname">
          Firstname
        </div>
        <div class="user-col__lastname">
          Lastname
        </div>
        <div class="user-col__username">
          Username
        </div>
        <div class="user-col__password">
          Password
        </div>
        <div class="user-col__email">
          Email
        </div>
        <div class="user-col__funcs">
          Functions
        </div>
      </div>                                
    </div>
  `;
  await getAdmins();
  catchUserEditDeleteEvents();
}

// Categories request functions
async function createCategory(name) {
  try {
    const res = await fetch(`http://localhost:4001/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });
    if (!res.ok) {
      throw new Error(`${res.status}`);
    }
    Tost({text: `Successfully created category`, type: "success"});
    setTimeout(TostDel, 2800);
    return true;
  } catch(err) {
    Tost({text: `Error ${err.message}`, type: "error"});
    setTimeout(TostDel, 2800);
    return false;
  }
}

async function getCategories() {
  try {
    const res = await fetch("http://localhost:4001/categories");
    if (!res.ok) {
      throw new Error(`Error ${res.status}`);
    }
    let data = await res.json();
    return data;
  } catch (err) {
    console.log("Error", err);
  }
}

async function deleteOneCategory(id) {
  try {
    const res = await fetch(`http://localhost:4001/categories/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error(res.status);
    }
    Tost({text: "Successfully deleted category", type: "success"});
    setTimeout(TostDel, 2800);
  } catch (err) {
    Tost({text: `Error ${err.message}`, type: "error"});
    setTimeout(TostDel, 2800);
  }
}

async function showCategories() {
  const categories = await getCategories();
  categories.forEach(({name, id}) => {
    document.querySelector(".products__categories-select").insertAdjacentHTML("beforeend", `
      <option value="${name}">${name}</option>
    `);    
  }); 
}

function addShowCategoriesPageEventListeners() {
  const form = container.querySelector("form");
  const formOpener = container.querySelector(".categoryform__opener");
  formOpener.addEventListener("click", function(e) {
    formOpener.classList.toggle("hidden");
    form.classList.toggle("hidden");
  });
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = form.querySelector("input").value;
    form.querySelector("input").value = "";
    await createCategory(name);
    clearQueryParams();
    setTimeout(async () => {
      formOpener.classList.toggle("hidden");
      form.classList.toggle("hidden");  
      clear(container);
      await showCategoriesPage();
    }, 2800);
  });
  container.querySelector(".categorieslist").addEventListener("click", async function(e) {
    if (e.target.classList.contains("delete")) {
      const answer = confirm("Do you really want to delete?");
      console.log("Answer to delete", answer);
      if (!answer) {
        return;
      }
      const categoryRow = e.target.closest(".categorieslist__row");
      const id = categoryRow.dataset.categoryid;
      // console.log("Delete category", id);
      categoryRow.remove();
      await deleteOneCategory(id);
      setTimeout(() => {
        categoryRow.remove();
      }, 2800);  
    }
  });
}

async function showCategoriesPage() {
  const categories = await getCategories();
  container.innerHTML = `
    <div class="categorieslist__row-header">
      <div class="categorieslist__title">Categories List</div>
      <form class="add__category hidden">
        <input type="text" name="category" placeholder="Category" required="true" />
        <button type="submit">Save</button>
      </form>
      <button class="categoryform__opener">Add category</button>
    </div>
    <div class="categorieslist">
      ${categories.map(category => `
        <div class="categorieslist__row" data-categoryid="${category.id}">
          <span class="category__name">${category.name}</span>
          <span class="delete">Delete</span>
        </div>
      `).join("")}
    </div>
  `;
  addShowCategoriesPageEventListeners();
}

// Products request functions
function shortSentence(sentence) {
  sentence = sentence.split(" ");
  if (sentence.length > 8) {
    sentence = sentence.slice(0, 8);
  }
  return sentence.join(" ");
}

async function getOneProduct(productId) {
  try {
    const res = await fetch(`http://localhost:4001/products/${productId}`);
    if (!res.ok) {
      throw new Error(res.status);
    }
    let data = await res.json();
    // console.log("One Product", data);
    return data;
  } catch(err) {
    console.log("Error", err);
  }
}

async function deleteOneProduct(productId) {
  try {
    const res = await fetch(`http://localhost:4001/products/${productId}`, {
      method: "DELETE",
    }); 
    console.log(res);
    // if (!res.ok) {
    //   throw new Error(res.status);
    // }
  } catch (err) {
    console.log("Error", err);
  }
}

let curr = 0; // Curr image on slider
function addSlideEventListener() {
  const images = document.querySelector(".productshow__slider-wrapper").querySelectorAll("img");
  const len = images.length;
  document.querySelector(".slider-btn__left").addEventListener("click", function(e) {
    curr = (curr - 1 + len) % len;
    images.forEach((imgNode, id) => {
      imgNode.style.left = `${100 * (id - curr)}%`;
    });
  });
  document.querySelector(".slider-btn__right").addEventListener("click", function(e) {
    curr = (curr + 1) % len;
    images.forEach((imgNode, id) => {
      imgNode.style.left = `${100 * (id - curr)}%`;
    });
  });
}

function buildshowProduct(obj) {
  if (typeof obj.images === "string") {
    obj.images = JSON.parse(obj.images);
  }
  console.log(obj);
  container.innerHTML = `
    <div class="productshow__wrapper">
      <div class="productshow__slider">
        <span class="slider-btn__left"><i class="fa-solid fa-chevron-left"></i></span>
        <span class="slider-btn__right"><i class="fa-solid fa-chevron-right"></i></span>
        <div class="productshow__slider-wrapper">
          ${obj.images.map((imageLink, id) => `<img src="${imageLink}" style="left: ${id * 100}%" />`).join("")}
        </div>
      </div>
      <div class="productshow__restdatas">
        <div class="product__title">${obj.title}</div>
        <div class="product__category">${obj.category}</div>
        <div class="product__price">${obj.price} uzs</div>
        <div class="product__description">${obj.description}</div>
      </div>
    </div>
  `;
  addSlideEventListener();
}

async function showOneProduct(productId) {
  try {
    const data = await getOneProduct(productId);
    // console.log("Show product data", data);
    buildshowProduct(data);
  } catch(err) {
    console.log("Error", err);
  }
}

async function getProducts() {
  let url = "http://localhost:4001/products";
  if (getQueryParams()) url += getQueryParams();
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error ${data.status}`);
    }
    let data = await res.json();
    data.forEach(({title, description, price, category, id}) => {
      container.querySelector(".products__lists").insertAdjacentHTML("beforeend", `
        <div class="product__row" data-productid="${id}">
          <div class="product-col__category">
            ${category}
          </div>
          <div class="product-col__title">
            ${title}
          </div>
          <div class="product-col__info">
            ${shortSentence(description)}
          </div>
          <div class="product-col__price">
            ${price}
          </div>
          <div class="product-col__funcs">
            <span class="edit">Edit</span>
            <span class="delete">Delete</span>
            <span class="show__product">Show</span>

          </div>
        </div>                
      `);
    });
  } catch(err) {
    console.log("Error", err);
  }
}

async function showProducts() {
  container.innerHTML = `
    <div class="productshow__row-head">
      <div class="productshow__info">
        <div class="productshow__title">Products List</div>
      </div>
      <div class="productshow__func-button">
        <button class="create-new btn--active">Create New</button>
      </div>
    </div>
    <div class="products__lists">
      <div class="products__row-settings">
        <div class="categories_select__wrapper">
          <select class="products__categories-select" name="category">
            <option value="all_category">All category</option>
          </select>
          <span class="select__arrow"><i class="fa-solid fa-chevron-down"></i></span>
        </div>
        <form class="products__date-and-status">
          <input type="text" name="q" />
          <span class="searchlogo"><i class="fa-solid fa-magnifying-glass"></i></span>
        </form>
      </div>
      <div class="product__row row-header">
        <div class="product-col__category">
          Category
        </div>
        <div class="product-col__title">
          Title
        </div>
        <div class="product-col__info">
          Description
        </div>
        <div class="product-col__price">
          Price
        </div>
        <div class="product-col__funcs">
          Functions
        </div>
      </div>                                
    </div>
  `;
  await showCategories();  
  await getProducts();
  productsEditDeleteEventListeners();
}

// Product Create Page
async function showProductCreatePage(productId) {
  let product;
  if (productId) {
    product = await getOneProduct(productId);
  }
  // console.log("Edit product", product);
  const categories = await getCategories();
  container.innerHTML = `
    <div class="productscreate__row-head">
      <div class="productscreate__title">Add New Product</div>
      <div class="productscreate__func-button">
        <button class="publish btn--active" type="submit" form="productcreateform">Publish</button>
      </div>
    </div>
    <form class="productscreate__form" id="productcreateform">
      <label for="title">Product title</label>
      <input type="text" class="title" name="title" id="title" placeholder="Type here" required />
      <label for="desc">Description</label>
      <textarea name="description" id="desc" rows="2" required></textarea>
      <label for="img">Images</label>
      <div class="image__row" data-imageord="0">
        <input name="image" type="text" required="true" />        
      </div>
      <button class="add_image_input">Add Image Input</button>
      <div class="productscreate__row">
        <p class="price__wrapper">
          <label for="price">Price</label>
          <input type="number" name="price" id="price" class="price" placeholder="Type here" required />          
        </p>
        <div class="category__total">
          <label for="select">Category</label>
          <div class="category__wrapper">
            <select name="category" id="select">
              <option value="">Select category</option>
              ${categories.map(({name}) => `<option value="${name}">${name}</option>`).join("")}
            </select>
            <span class="select__arrow"><i class="fa-solid fa-chevron-down"></i></span>
          </div>
        </div>
      </div>
    </form>
  `;  
  if (productId) {
    const form = document.querySelector(".productscreate__form");
    document.querySelector(".productscreate__title").textContent = "Edit Product";
    document.querySelector(".productscreate__func-button").querySelector("button").textContent = "Save";
    form.querySelector("input[name='title']").value = product.title;
    form.querySelector("textarea").value = product.description;

    // Images array adding to form
    if (typeof product.images === "string") {
      product.images = JSON.parse(product.images);
    }
    form.querySelector(".image__row").remove();
    const addImageInput = document.querySelector(".add_image_input");
    product.images.forEach((item, id) => {
      addImageInput.insertAdjacentHTML("beforebegin", `
      <div class="image__row" data-imageord="${id}">
        <input name="image" type="text" value=${item} required="true" />     
        ${id ? '<button class="image_input_del">Delete Input</button>' : ''}
      </div>
    `);  
    });

    form.querySelector("input[name='price']").value = +product.price;
    form.querySelector("select[name='category']").value = product.category;
   
    container.insertAdjacentHTML("afterbegin", `
      <div class="productid hidden" data-productid="${productId}"></div>
    `);
  }
  productCreatePageEventListeners();
}

async function productCreateForm(obj) {
  try {
    const res = await fetch(`http://localhost:4001/products${obj.id ? "/" + obj.id : ""}`, {
      method: `${obj.id ? "PUT" : "POST"}`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(obj),
    });
    let data = await res.json();
    // console.log(data);
    return data;
  } catch (err) {
    console.log("Error", err.message);
    Tost({ text: `Error ${err.message}`, type: "error" });
    setTimeout(TostDel, 2800);
  } 
}

// --------------  Main functions (and Event listeners)

clear(container);
renderUserImage();

// ---------

document.querySelector(".sidebar-open").addEventListener("click", openSidebar);
document.querySelector(".sidebar-close").addEventListener("click", closeSidebar);

sidebar.addEventListener("click", async function(e) {
  const el = e.target;
  if (container.querySelector(".productscreate__title") && !el.classList.contains("sidebar")) {
    const answer = confirm("Do you want to close form?");
    console.log("Answer for closing form", answer);
    if (!answer) return;
  }
  if (el.classList.contains("logout") || el.parentElement.classList.contains("logout")) {
    redirectToLogin();
  }
  if (el.classList.contains("dashboard") || el.parentElement.classList.contains("logout")) {
    clear(container);
    clearQueryParams();  
  }
  if (el.classList.contains("products") || el.parentElement.classList.contains("products")) {
    console.log("Products List Request was sent");
    await showProducts();
    searchEventListener();
    selectEventListener();
  }

  // Event Listeners when the admin is super admin
  if (isSuperAdmin()) {
    if (el.classList.contains("add-admin") || el.parentElement.classList.contains("add-admin")) {
      redirectToSignUp();
    }
    if (el.classList.contains("users") || el.parentElement.classList.contains("users")) {
      showAdmins();
    }
  }
  if (el.classList.contains("add-products") || el.parentElement.classList.contains("add-products")) {
    await showProductCreatePage();
  }
  if (el.classList.contains("categories") || el.parentElement.classList.contains("categories")) {
    await showCategoriesPage();
  }
});

// ---------

function searchEventListener() {
  const searchInput = document.querySelector("input[name='q']"); 
  if (queryObj.q) {
    searchInput.value = queryObj.q;
  } 
  const form = document.querySelector("form");
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    // console.log(searchInput.value);
    addQueryParam(`q=${searchInput.value}`);
    await showProducts();
  });
}

function selectEventListener() {
  const select = document.querySelector(".products__categories-select");

  if (queryObj.category) {
    select.value = queryObj.category;
  }

  select.addEventListener("change", async function(e) {
    // console.log(select.value);
    addQueryParam(`category=${select.value}`);
    await showProducts();
  });
}

// ---------

function productCreatePageEventListeners() {
  const addImageInput = document.querySelector(".add_image_input");
  addImageInput.addEventListener("click", function(e) {
    console.log("Add Image Input Event");
    const imageInputRowLast = addImageInput.previousElementSibling;
    addImageInput.insertAdjacentHTML("beforebegin", `
      <div class="image__row" data-imageord="${+imageInputRowLast.dataset.imageord + 1}">
        <input name="image" type="text" required="true" />       
        <button class="image_input_del">Delete Input</button> 
      </div>
    `);  
  });
  document.addEventListener("click", function(e) {
    if (e.target.classList.contains("image_input_del")) {
        console.log("Image Input del", e.target);
        const imageRow = e.target.closest(".image__row");
        imageRow.remove();
    }
  });
  const form = document.querySelector(".productscreate__form");
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const listImages = [];
    for (const [key, value] of formData.entries()) {
      if (key === "image") {
        listImages.push(value);
      }
    }
    formData.delete("image");
    formData.append("images", JSON.stringify(listImages));
    let update = false;
    if (container.querySelector(".productid")) {
      update = true;
      formData.append("id", +container.querySelector(".productid").dataset.productid);
    }
    // for (const [key, value] of formData.entries()) {
    //   console.log(key, value);
    // }
    const obj = Object.fromEntries(formData);
    try {
      const res = await productCreateForm(obj);
      Tost({text: `Successfully ${update ? "updated": "created"} product`, type: "success"});
      setTimeout(function() {
        TostDel();
        clear(container);
      }, 2800);      
    } catch(err) {
      console.log("Error", err);
      Tost({text: `Error ${err.message}`, type: "error"});
      setTimeout(function() {
        TostDel();
        clear(container);
      }, 2800);
    }
    
  });
}

// ---------

function productsEditDeleteEventListeners() {
  const productsList = document.querySelector(".products__lists");
  productsList.addEventListener("click", async function(e) {
    const el = e.target;
    if (el.classList.contains("edit")) {
      const productId = el.closest(".product__row").dataset.productid;
      // console.log("Edit product", productId);
      await showProductCreatePage(productId);
    } else if (el.classList.contains("delete")) {
      const productId = el.closest(".product__row").dataset.productid;
      const answer = confirm("Do you really want to delete?");
      if (!answer) {
        return;
      } 
      try {
        console.log("Deleted product", productId);
        await deleteOneProduct(productId);
        console.log(productId);
        el.closest(".product__row").remove();
        Tost({text: "Successfully deleted product", type: "success"});
        setTimeout(TostDel, 2800);
      } catch (err) {
        Tost({text: "Error with deleting product", type: "error"});
        setTimeout(TostDel, 2800);
      }
    } else if (el.classList.contains("show__product")) {
      const productId = el.closest(".product__row").dataset.productid;
      // console.log("Show product", productId);
      await showOneProduct(productId);
    }
  });
}

// ---------

// Edit-Delete functions for Admins
function catchUserEditDeleteEvents() {
  container.querySelector(".users__lists").addEventListener("click", async function(e) {
    let el = e.target;
    const id = el.closest(".user__row").dataset.userid;
    const obj = await getOneAdmin(id);
    // console.log(obj);
    // Edit admin data
    if (el.classList.contains("edit")) {
      let queryParams = "?";
      const lst = Object.entries(obj);
      for (const id in lst) {
        const [key, val] = lst[id];
        queryParams += `${key}=${val}`;
        if (id !== lst.length - 1) {
          queryParams += "&&";
        }
      }
      console.log(queryParams);
      redirectToSignUp(queryParams);
    }
    // Delete admin data 
    else if (el.classList.contains("delete")) {
      const data = await deleteOneAdmin(id);
      if (data) {
        el.closest(".user__row").remove();
        Tost({ text: `Admin was successfully deleted`, type: "success" });
        setTimeout(TostDel, 2800);
      }
    }
  });    
}

// ---------

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
