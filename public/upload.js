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
const firestore = getFirestore();
const auth = getAuth(app);

const uploader = document.getElementById('uploader');
const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('forTitle');
const yearInput = document.getElementById('forYear');
const authorInput = document.getElementById('forAuthor');
const abstractInput = document.getElementById('forAbstract');
const selectedFileLabel = document.getElementById('selectedFileLabel');

let selectedFile = null;

document.getElementById('selectFileBtn').addEventListener('click', () => {
    selectedFile = fileInput.files[0];
    if (selectedFile) {
        selectedFileLabel.textContent = `Selected file: ${selectedFile.name}`;
        $('#uploadModal').modal('hide');
    } else {
        alert('Please select a file.');
    }
});

document.getElementById('uploadButton').addEventListener('click', () => {
    if (!selectedFile) {
        alert('Please select a file first.');
        return;
    }

    const title = titleInput.value.trim();
    const year = yearInput.value.trim();
    const author = authorInput.value.trim();
    const abstract = abstractInput.value.trim();

    if (!title || !year || !author || !abstract) {
        alert('Please fill out all the fields.');
        return;
    }

    const storageRef = sRef(storage, 'pdf/' + selectedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on('state_changed',
        (snapshot) => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        },
        (error) => {
            console.error('Upload failed:', error);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const fileMetadata = {
                    title: title,
                    year: year,
                    author: author,
                    abstract: abstract,
                    name: selectedFile.name,
                    url: downloadURL,
                    uploadedBy: 'Unknown',
                    timestamp: new Date()
                };

                const docRef = doc(firestore, 'files', selectedFile.name);
                setDoc(docRef, fileMetadata).then(() => {
                    alert('File and metadata uploaded successfully!');
                }).catch((error) => {
                    console.error('Error saving file metadata to Firestore:', error);
                });
            });
        }
    );
});
