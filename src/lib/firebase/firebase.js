import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getApps, getApp } from "firebase/app";


const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};
  

// get app for server side rendering
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// FIRESTORE/database
export const db = getFirestore(app);

 