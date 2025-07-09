
// src/lib/firebase.client.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
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

export const isDemoMode = hasPlaceholder;

if (isDemoMode && typeof window !== 'undefined') {
  console.warn(`
    ====================================================================================================
    FIREBASE CONFIGURATION NEEDED (DEMO MODE ACTIVE)
    ====================================================================================================
    Your Firebase configuration in 'src/lib/firebase.client.ts' contains placeholder values.
    The app is running in DEMO MODE with mock data.
    
    To fix this and use your own database:
    1. Go to your Firebase project console: https://console.firebase.google.com/
    2. Select your project ('prepai-bcb3d').
    3. Go to Project Settings (gear icon) > 'Your apps' card.
    4. Find your web app's 'SDK setup and configuration' and select 'Config'.
    5. Copy the config object values into the 'firebaseConfig' object in this file.
    ====================================================================================================
  `);
}

// Conditionally initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isDemoMode) {
  // In demo mode, we don't initialize Firebase to avoid errors.
  // We create mock objects to prevent the app from crashing.
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
} else {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };
