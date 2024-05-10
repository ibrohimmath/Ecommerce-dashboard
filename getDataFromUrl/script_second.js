"use strict";

const searchUrl = window.location.search;

const urlSearch = new URLSearchParams(searchUrl);

for (const [key, value] of urlSearch.entries()) {
  console.log(value);
}