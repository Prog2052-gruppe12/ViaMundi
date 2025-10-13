import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";

// client side firebase config. skal kun brukes på client side!
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};
  

// hent app og initialiser den hvis den ikke finnes
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Auth
const auth = getAuth(app);
// lagrer innloggingsinformasjonen i lokalt på browsern (cookie)
setPersistence(auth, browserLocalPersistence);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider };


 