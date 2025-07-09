// src/lib/firebase.client.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD8hK2EXAMPLEKEYDOREPLACE",
  authDomain: "prepai-bcb3d.firebaseapp.com",
  projectId: "prepai-bcb3d",
  storageBucket: "prepai-bcb3d.appspot.com",
  messagingSenderId: "43135287829",
  appId: "1:43135287829:web:abcdefg1234567"
};

const hasPlaceholder = Object.values(firebaseConfig).some(
  (value) => value.includes("EXAMPLEKEYDOREPLACE") || value.includes("abcdefg1234567")
);

if (hasPlaceholder && typeof window !== 'undefined') {
  console.warn(`
    ====================================================================================================
    FIREBASE CONFIGURATION NEEDED
    ====================================================================================================
    Your Firebase configuration in 'src/lib/firebase.client.ts' contains placeholder values.
    The app will not function correctly until you replace them.
    
    To fix this:
    1. Go to your Firebase project console: https://console.firebase.google.com/
    2. Select your project ('prepai-bcb3d').
    3. Go to Project Settings (gear icon) > 'Your apps' card.
    4. Find your web app's 'SDK setup and configuration' and select 'Config'.
    5. Copy the config object values into the 'firebaseConfig' object in this file.
    ====================================================================================================
  `);
}

// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();


export { app, auth, db, googleProvider };
