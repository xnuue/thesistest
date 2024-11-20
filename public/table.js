// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

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
const db = getFirestore(app);
const storage = getStorage(app);

let selectedFile = null;

document.getElementById('selectFileBtn').addEventListener('click', () => {
    selectedFile = document.getElementById('fileInput').files[0];
    if (selectedFile) {
        document.getElementById('selectedFileLabel').textContent = `Selected file: ${selectedFile.name}`;
    }
});

async function populateTable() {
    try {
        const querySnapshot = await getDocs(collection(db, "Archive"));
        const tableBody = document.getElementById("archiveList").getElementsByTagName('tbody')[0];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const title = data.title;
            const year = data.year;
            const docId = doc.id;
            const abstract = data.abstract;
            const author = data.author;
            const url = data.url;

            const newRow = tableBody.insertRow(tableBody.rows.length);
            const cell1 = newRow.insertCell(0);
            const cell2 = newRow.insertCell(1);
            const cell3 = newRow.insertCell(2);
            const cell4 = newRow.insertCell(3);
            const cell5 = newRow.insertCell(4); // New cell for the Favorite button

            cell1.textContent = title;
            cell2.textContent = year;
            cell3.textContent = author;

            const viewButton = document.createElement('button');
            viewButton.textContent = "View Document";
            viewButton.classList.add('btn', 'btn-primary');
            viewButton.onclick = () => {
                sessionStorage.setItem('documentData', JSON.stringify({
                    title: title,
                    year: year,
                    abstract: abstract,
                    author: author,
                    url: url,
                    docId: docId
                }));
                window.location.href = 'document.html';
            };

            const favoriteButton = document.createElement('button');
            favoriteButton.textContent = "Add to Favorites";
            favoriteButton.classList.add('btn', 'btn-warning');
            favoriteButton.onclick = async () => {
                const userId = JSON.parse(sessionStorage.getItem("user")).id; // Assumes user ID is in session storage
                await toggleFavorite(userId, docId, favoriteButton);
            };

            cell4.appendChild(viewButton);
            cell5.appendChild(favoriteButton);
        });
    } catch (error) {
        console.error("Error populating table:", error);
    }
}

async function toggleFavorite(userId, docId, button) {
    try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.error("User document not found!");
            return;
        }

        const userData = userSnap.data();
        const favorites = userData.favorites || [];

        if (favorites.includes(docId)) {
            // If already in favorites, remove it
            const updatedFavorites = favorites.filter(fav => fav !== docId);
            await updateDoc(userRef, { favorites: updatedFavorites });
            button.textContent = "Add to Favorites";
            button.classList.remove('btn-danger');
            button.classList.add('btn-warning');
        } else {
            // If not in favorites, add it
            favorites.push(docId);
            await updateDoc(userRef, { favorites: favorites });
            button.textContent = "Remove from Favorites";
            button.classList.remove('btn-warning');
            button.classList.add('btn-danger');
        }
    } catch (error) {
        console.error("Error updating favorites:", error);
    }
}


function clearForm() {
    document.getElementById('title').value = '';
    document.getElementById('year').value = '';
    document.getElementById('author').value = '';
    document.getElementById('abstract').value = '';
    document.getElementById('fileInput').value = '';
    document.getElementById('selectedFileLabel').textContent = 'Please select a file';
}

function saveData() {
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const author = document.getElementById('author').value;
    const abstract = document.getElementById('abstract').value;

    if (!selectedFile) {
        alert("Please select a file to upload.");
        return;
    }

    const storageRef = sRef(storage, 'pdf/' + selectedFile.name);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    const uploadButton = document.getElementById('ulb');

    uploadButton.disabled = true;

    uploadTask.on('state_changed',
        (snapshot) => {
            const percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            document.getElementById('uploader').value = percentage;
        },
        (error) => {
            console.error('Upload failed:', error);
            uploadButton.disabled = false;
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                const archive = {
                    title: title,
                    year: year,
                    author: author,
                    abstract: abstract,
                    timeuploaded: now.toLocaleString(),
                    url: downloadURL
                };

                addDoc(collection(db, "Archive"), archive)
                    .then((docRef) => {
                        console.log("Document saved with ID:", docRef.id);
                        alert("File and data saved successfully!");
                        populateTable();
                        clearForm();
                    })
                    .catch((error) => {
                        console.error("Error saving document:", error);
                    })
                    .finally(() => {
                        uploadButton.disabled = false;
                        document.getElementById('uploader').value = 0;
                    });
            });
        }
    );
}

document.getElementById('saveform').addEventListener('submit', (event) => {
    event.preventDefault();
    saveData();
});

const now = new Date();
console.log(`Current Date and Time: ${now.toLocaleString()}`);

document.getElementById("ta").addEventListener("click", () => {
    const tableBody = document.getElementById("archiveList").getElementsByTagName('tbody')[0];
    while (tableBody.rows.length > 0) {
        tableBody.deleteRow(0);
    }
    populateTable();
});

window.onload = populateTable;