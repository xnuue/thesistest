let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

let who = document.getElementById('whoami');
let so = document.getElementById('signout');
let wc = document.getElementById('welcome');

let signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info, studentID");
  window.location.href = 'index.html'
}

let check = () => {
  if (UserCreds && !UserCreds.emailVerified) {
    alert("Please verify your email before logging in.")
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href = 'index.html';

  } else {
    console.log('User Info:', UserInfo);
    console.log('User Creds:', UserCreds);
  }
  document.getElementById('name').textContent = UserInfo.name;
  document.getElementById('sn').textContent = UserInfo.sn;
};

if (!UserCreds || !UserInfo) {
  window.location.href = "index.html";
}
window.addEventListener('load', check);
so.addEventListener('click', signout);