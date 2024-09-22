// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const storage = getStorage(app);
const firestore = getFirestore(app);
const auth = getAuth(app);

const uploader = document.getElementById('uploader');
const fileButton = document.getElementById('fileButton');
const signoutButton = document.getElementById('signout');

const titleInput = document.getElementById('forTitle');
const yearInput = document.getElementById('forYear');
const authorInput = document.getElementById('forAuthor');
const abstractInput = document.getElementById('forAbstract');

fileButton.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const title = titleInput.value.trim();
    const year = yearInput.value.trim();
    const author = authorInput.value.trim();
    const abstract = abstractInput.value.trim();

    if (!title || !year || !author || !abstract) {
        alert('Please fill out all the fields.');
        return;
    }

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

                const fileMetadata = {
                    title: title,
                    year: year,
                    author: author,
                    abstract: abstract,
                    name: file.name,
                    url: downloadURL,
                    uploadedBy: UserInfo.name || 'Unknown',
                    timestamp: new Date()
                };

                const docRef = doc(firestore, 'files', file.name);
                setDoc(docRef, fileMetadata).then(() => {
                    console.log('File metadata saved successfully to Firestore.');
                    alert('File and metadata uploaded successfully!');
                }).catch((error) => {
                    console.error('Error saving file metadata to Firestore:', error);
                });
            });
        }
    );
});