
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCo7nh58UwLmF5w6XPc4erpJgHE2fD1-pE",
  authDomain: "thesissandbox.firebaseapp.com",
  projectId: "thesissandbox",
  storageBucket: "thesissandbox.appspot.com",
  messagingSenderId: "219383246422",
  appId: "1:219383246422:web:137c8b5cf599e6734dd5f7",
  measurementId: "G-DPPCXVN3HD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const auth = getAuth(app);

let name = document.getElementById('fname');
let pass = document.getElementById('pw');
let em = document.getElementById('email');
let sn = document.getElementById('studentnum'); 
let MainForm = document.getElementById('reg');
let currentTime = new Date(); 

var year = currentTime.getFullYear();

let RegisterUser = evt => {
  evt.preventDefault();
  createUserWithEmailAndPassword(auth, em.value, pass.value)
    .then(async (credentials) => {
      await sendEmailVerification(auth.currentUser); 
      
      var ref = doc(db, "UserAuthList", credentials.user.uid);
      await setDoc(ref, {
        name: name.value,
        email: em.value,
        studentID: sn.value,
        isDark: "0",
        year: year
      });
      alert("Account created! Please verify your email before logging in. Check your inbox or spam folder.");
      window.location.href = "index.html"; 
    })
    .catch((error) => {
      alert(error.message);
      console.error(error.code);
      console.error(error.message);
    });
}

MainForm.addEventListener('submit', RegisterUser);  