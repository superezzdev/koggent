// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "koggent-cd5cc.firebaseapp.com",
  projectId: "koggent-cd5cc",
  storageBucket: "koggent-cd5cc.firebasestorage.app",
  messagingSenderId: "1021848054049",
  appId: "1:1021848054049:web:1d86d29abeba7fa31d7660",
  measurementId: "G-RWWQG2WNHZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();