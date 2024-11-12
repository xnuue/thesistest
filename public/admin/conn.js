let adminSession = JSON.parse(sessionStorage.getItem("ssAdmin"));

let who = document.getElementById('whoami');
let so = document.getElementById('signout');
let wc = document.getElementById('welcome');

let signout = () => {
  sessionStorage.removeItem("ssAdmin");
  window.location.href = '../index.html';
}

let check = () => {
  if (!adminSession) {
    alert("You need to log in as an admin to access this page.");
    window.location.href = '../index.html'; 
  } else {
    console.log('Admin Info:', adminSession);
    document.getElementById('name').textContent = adminSession.acc; 
  }
};

if (!adminSession) {
  window.location.href = "../index.html";
}

window.addEventListener('load', check);
so.addEventListener('click', signout);
