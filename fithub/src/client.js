// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSkdeaVnVoW9F7vO3pPG8U9aBOdAn61eg",
  authDomain: "fithub-f5445.firebaseapp.com",
  projectId: "fithub-f5445",
  storageBucket: "fithub-f5445.firebasestorage.app",
  messagingSenderId: "458440136685",
  appId: "1:458440136685:web:df470523d0b9ec1c8739e4",
  measurementId: "G-EQR2J36L7E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
