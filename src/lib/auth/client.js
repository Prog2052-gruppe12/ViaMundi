"use client";

import { auth, googleProvider } from "@/lib/firebase/client";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";

const SESSION_URL = "/api/auth/session";
export const DEFAULT_AFTER_LOGIN = "/user";
export const DEFAULT_AFTER_LOGOUT = "/login";

export async function establishSessionCookie() {
  const user = auth.currentUser;
  if (!user) throw new Error("Ingen bruker funnet");

  const idToken = await user.getIdToken(false);

  const res = await fetch(SESSION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "Kunne ikke opprette session");
  }
}

export async function signUpWithEmail({ email, password, displayName }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }

  await establishSessionCookie();
  return userCredential.user;
}

export async function signInWithEmail({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  await establishSessionCookie();
  return userCredential.user;
}

export async function signInWithGoogle() {
  try {
    const userCredential = await signInWithPopup(auth, googleProvider);
    await establishSessionCookie();
    return userCredential.user;
  } catch (error) {
 
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('POPUP_CLOSED');
    }
    throw error;
  }
}

export async function signOutEverywhere() {
  try {
    await fetch(SESSION_URL, { method: "DELETE" });
  } catch (error) {
    console.error("Feil ved sletting av session:", error);
  }
  await signOut(auth);
}
