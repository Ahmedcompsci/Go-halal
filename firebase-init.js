// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyA1dgKamvYTYowgGsS7ZxEsj-pLjJRUlVc", // these are critacal it allows it to connect it with firebase
  authDomain: "halalgo-2.firebaseapp.com",
  projectId: "halalgo-2",
  storageBucket: "halalgo-2.appspot.com", 
  messagingSenderId: "308177144684",
  appId: "1:308177144684:web:48785209b2326371b60149",
  measurementId: "G-FY9S8VT9TT"
};

const app = initializeApp(firebaseConfig); // this initialize the app for the firebase
const db = getFirestore(app);
const auth = getAuth(app); // gets the authtacation 

export { db, auth };
