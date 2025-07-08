import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This function checks if all the required Firebase config keys are present and not placeholders.
function validateFirebaseConfig(config: typeof firebaseConfig) {
    const missingOrPlaceholderKeys = Object.entries(config)
        .filter(([key, value]) => !value || (typeof value === 'string' && value.includes('YOUR_')))
        .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`);

    if (missingOrPlaceholderKeys.length > 0) {
        throw new Error(
`Firebase configuration is missing or incomplete in your .env file.
Please set the following environment variables:
${missingOrPlaceholderKeys.join('\n')}

You can find these values in your Firebase project settings under your web app's configuration.`
        );
    }
}

validateFirebaseConfig(firebaseConfig);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
