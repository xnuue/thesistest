// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCo7nh58UwLmF5w6XPc4erpJgHE2fD1-pE",
    authDomain: "thesissandbox.firebaseapp.com",
    projectId: "thesissandbox",
    storageBucket: "thesissandbox.appspot.com",
    messagingSenderId: "219383246422",  
    appId: "1:219383246422:web:137c8b5cf599e6734dd5f7",
    measurementId: "G-DPPCXVN3HD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

let UserCreds = JSON.parse(sessionStorage.getItem("user-creds"));
let UserInfo = JSON.parse(sessionStorage.getItem("user-info"));

console.log('User Info:', UserInfo);
console.log('User Creds:', UserCreds);

if (UserInfo && UserInfo.name) {
    document.getElementById('name').textContent = UserInfo.name;
} else {
    console.log('User name not found in session storage.');
}

const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('fileButton');
const signoutButton = document.getElementById('signout');

fileButton.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = sRef(storage, 'pdf/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed',
        (snapshot) => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        (error) => {
            console.error('Upload failed:', error);
            console.error('Error code:', error.code);
            console.error('Error message:', error.message);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
            });
        }
    );
});

signoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        sessionStorage.removeItem("user-creds");
        sessionStorage.removeItem("user-info");
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Signing out failed:', error);
    });
});