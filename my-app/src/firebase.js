// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyColSU4_gEGgZ2vj7QuzQ9ELV3wpBbOC20",
  authDomain: "btmusic-bcit.firebaseapp.com",
  projectId: "btmusic-bcit",
  storageBucket: "btmusic-bcit.firebasestorage.app",
  messagingSenderId: "102844144043",
  appId: "1:102844144043:web:df85ce4e62b7c514079aee",
  measurementId: "G-9MQYCK5JBF"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Make sure auth state persists even after page refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
