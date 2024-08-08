let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let who = document.getElementById('whoami');
let so = document.getElementById('signout');
let wc = document.getElementById('welcome');

let signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = 'login.html'
}

let check = () => {
  if (UserCreds && !UserCreds.emailVerified) {
    alert("Please verify your email before logging in.")
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href = 'login.html';

  } else {
    console.log("written with blood tears and sweat");
    console.log("https://facebook.com/senn2k");
  }
  console.log(UserCreds)
    who.innerText = `${UserCreds.name}`;
    wc.innerText = `Welcome ${UserCreds.name}!`;
};
window.addEventListener('load', check);
so.addEventListener('click', signout);