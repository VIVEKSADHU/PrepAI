import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// This object holds your Firebase project's configuration.
// The values are read from the .env file.
//
// IMPORTANT: You must replace the placeholder values in your .env file
// with the actual keys from your Firebase project's settings. To find them:
// 1. Go to the Firebase Console -> Your Project -> Project settings.
// 2. In the "General" tab, scroll to the "Your apps" card.
// 3. Select your web app and find the "SDK setup and configuration".
// 4. Copy the config values into the matching variables in the .env file.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
// This check prevents initializing the app more than once.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get references to Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
