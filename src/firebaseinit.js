// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyDSijxktoH3Fvik98XktPYPI3qHtTrMQiM",
    authDomain: "zutureapp.firebaseapp.com",
    projectId: "zutureapp",
    storageBucket: "zutureapp.appspot.com",
    messagingSenderId: "405150168235",
    appId: "1:405150168235:web:809f8c3dcd86402ea8b3ee",
    measurementId: "G-SVZVKD9TSS"
  };

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORE = getStorage(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);