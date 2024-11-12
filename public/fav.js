
function loadFavorites(userId) {
    const userRef = firebase.firestore().collection('users').doc(userId);

    userRef.get().then((doc) => {
        if (doc.exists) {
            const bookmarks = doc.data().bookmarks || [];

            if (bookmarks.length > 0) {
                bookmarks.forEach((thesisId) => {
                    firebase.firestore().collection('theses').doc(thesisId).get().then((thesisDoc) => {
                        if (thesisDoc.exists) {
                            const thesisData = thesisDoc.data();
                            displayFavoriteThesis(thesisData);
                        }
                    });
                });
            } else {
                document.querySelector('.card-body').innerHTML = '<p>No favorites yet.</p>';
            }
        } else {
            console.log("No user data found!");
        }
    }).catch((error) => {
        console.error("Error fetching user favorites: ", error);
    });
}

function displayFavoriteThesis(thesisData) {
    const thesisHtml = `
    <div class="thesis-item">
      <h3>${thesisData.title}</h3>
      <p>Author: ${thesisData.author}</p>
      <p>Description: ${thesisData.description}</p>
      <button onclick="removeBookmark('${thesisData.id}')">Remove from Favorites</button>
    </div>
  `;
    document.querySelector('.card-body').innerHTML += thesisHtml;
}

function removeBookmark(thesisId) {
    const userRef = firebase.firestore().collection('users').doc(UserCreds.uid);
    userRef.update({
        bookmarks: firebase.firestore.FieldValue.arrayRemove(thesisId)
    }).then(() => {
        console.log("Bookmark removed");
        location.reload(); 
    }).catch((error) => {
        console.error("Error removing bookmark: ", error);
    });
}
