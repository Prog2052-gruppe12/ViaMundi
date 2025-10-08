import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// formater private key
function formatPrivateKey(key) {
  if (!key) return "";
  return key.replace(/\\n/g, "\n");
}

// initliasere Firebase Admin SDK 
function initializeFirebaseAdmin() {
// sjekker om admin app allerede er initialisert
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!privateKey || !clientEmail || !projectId) {
    throw new Error(
      "Mangler required Firebase Admin credentials. Sjekk at FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, og FIREBASE_PROJECT_ID er satt i environment variables."
    );
  }

  return initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

// initliasere admin app
const adminApp = initializeFirebaseAdmin();

export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export default adminApp; 

