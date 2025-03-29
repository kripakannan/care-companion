// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDvUAd0FOdEpLN8qrNKd-gNVE9NIHR7I5Y",
  authDomain: "care-companion-17.firebaseapp.com",
  projectId: "care-companion-17",
  storageBucket: "care-companion-17.firebasestorage.app",
  messagingSenderId: "934325130052",
  appId: "1:934325130052:web:7156c2fc75063464d0bd11",
  measurementId: "G-JX31D47MDL"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };