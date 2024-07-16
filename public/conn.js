let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"))

let who = document.getElementById('whoami');
let so = document.getElementById('signout');
let wc = document.getElementById('welcome');

let signout = () => {
  sessionStorage.removeItem("user-creds");
  sessionStorage.removeItem("user-info");
  window.location.href = 'login.html'
}

let check = () => {
  // Check email verification within UserCreds (assuming "emailVerified" exists)
  if (UserCreds && !UserCreds.emailVerified) {
    alert("Please verify your email before logging in.")
    sessionStorage.removeItem("user-creds");
    sessionStorage.removeItem("user-info");
    window.location.href = 'login.html';

  } else {
    // Existing code to display user information (optional)
    console.log("written with blood tears and sweat");  // (Optional)
    console.log("https://facebook.com/senn2k");        // (Optional)  
  }
  console.log(UserCreds)
    who.innerText = `${UserCreds.name}`;
    wc.innerText = `Welcome ${UserCreds.name}!`;
};
window.addEventListener('load', check);
so.addEventListener('click', signout);