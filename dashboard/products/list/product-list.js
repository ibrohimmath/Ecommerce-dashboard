let urlString = window.location.href;
console.log(urlString);
let url = new URL(urlString);

console.log(url);

let searchParams = new URLSearchParams(url.search);

let name = searchParams.get("user-name");
console.log(name);
let password = searchParams.get("user-password");
console.log(password);
