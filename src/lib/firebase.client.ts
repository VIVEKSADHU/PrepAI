import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// WARNING: Hardcoding credentials is not recommended for production.
// This is for prototyping purposes only.
// Replace the "YOUR_..." placeholders with your actual Firebase project's web app credentials.
const firebaseConfig = {
  apiKey: "AIzaSyAI4Bq6UdA2W-WVXNOAtWBk2zonuvIpQi0",
  authDomain: "prepai-bcb3d.firebaseapp.com",
  projectId: "prepai-bcb3d",
  storageBucket: "prepai-bcb3d.firebasestorage.app",
  messagingSenderId: "590593843510",
  appId: "1:590593843510:web:3307449e1b15500ca35397"
};


let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
