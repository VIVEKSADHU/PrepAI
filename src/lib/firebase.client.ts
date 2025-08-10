// src/lib/firebase.client.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAI4Bq6UdA2W-WVXNOAtWBk2zonuvIpQi0",
  authDomain: "prepai-bcb3d.firebaseapp.com",
  projectId: "prepai-bcb3d",
  storageBucket: "prepai-bcb3d.firebasestorage.app",
  messagingSenderId: "590593843510",
  appId: "1:590593843510:web:3307449e1b15500ca35397"
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
    This will cause authentication and database errors.
    
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

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');

export { app, auth, db, googleProvider };
