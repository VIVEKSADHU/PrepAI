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

// This check determines if the app is in demo mode.
export const isDemoMode = firebaseConfig.apiKey.includes("EXAMPLEKEYDOREPLACE") || firebaseConfig.appId.includes("abcdefg1234567");

if (isDemoMode) {
  console.warn(`
    ====================================================================================================
    FIREBASE IS IN DEMO MODE
    ====================================================================================================
    Your Firebase configuration in 'src/lib/firebase.client.ts' contains placeholder values.
    The app is running in Demo Mode with mock data. Authentication and database features are disabled.
    
    To enable full functionality, you MUST replace the placeholder values with your
    actual Firebase project's web app credentials.
    
    How to fix:
    1. Go to your Firebase project console: https://console.firebase.google.com/
    2. Select your project ('prepai-bcb3d').
    3. Go to Project Settings (gear icon).
    4. In the 'General' tab, scroll down to the 'Your apps' section.
    5. Select your web app and find the 'SDK setup and configuration' with the 'Config' option selected.
    6. Copy the values (apiKey, authDomain, etc.) and paste them into the 'firebaseConfig' object
       in this file ('src/lib/firebase.client.ts').
    ====================================================================================================
  `);
}


// Conditionally initialize Firebase
let app: FirebaseApp;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (!isDemoMode) {
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
} else {
  app = {} as FirebaseApp; // Provide a mock app object in demo mode
}

export { app, auth, db, googleProvider };
