"use strict";
// Project 5: Firebase web configuration from the registered client app.
// Firebase web config identifies your project; access is enforced by Firestore rules.
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

export const firebaseConfig = {
    apiKey: "AIzaSyDy9hcGwAfY1j92OC2Qh9piSHUzF_Rhyfw",
    authDomain: "central-asian-cuisine.firebaseapp.com",
    projectId: "central-asian-cuisine",
    storageBucket: "central-asian-cuisine.firebasestorage.app",
    messagingSenderId: "29476413615",
    appId: "1:29476413615:web:825552eb95cf799d3db45a",
    measurementId: "G-W4RHSGRFQK"
};

export const firebaseConfigured =
    ["apiKey", "authDomain", "projectId", "messagingSenderId", "appId"]
        .every((key) => typeof firebaseConfig[key] === "string" &&
            firebaseConfig[key].length > 5 && !firebaseConfig[key].includes("PASTE_"));

const app = firebaseConfigured ? initializeApp(firebaseConfig) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

export function friendlyError(error) {
    const descriptions = {
        "auth/invalid-credential": "The email or password is incorrect. Please try again.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/email-already-in-use": "This email already has an account. Try signing in.",
        "auth/weak-password": "Choose a stronger password (at least six characters).",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "A network problem interrupted Firebase. Check your connection.",
        "auth/unauthorized-domain": "This website is not an authorized Firebase domain. Add it in Firebase Authentication settings.",
        "permission-denied": "Firebase denied access. Check your sign-in status and Firestore security rules.",
        "unavailable": "Firebase is temporarily unavailable. Check your connection and try again."
    };
    return descriptions[error?.code] || error?.message || "An unexpected Firebase error occurred.";
}
