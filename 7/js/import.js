"use strict";
import { auth, db, firebaseConfigured, friendlyError } from "./firebase.js";
import { onAuthStateChanged, reload } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Match the verified owner email configured in firestore.rules.
const OWNER_EMAIL = "glheffne@go.olemiss.edu";
const status = document.getElementById("import-status");
const importButton = document.getElementById("import-foods");
const refreshButton = document.getElementById("refresh-owner");
const isOwner = (user) => user && user.emailVerified && user.email?.toLowerCase() === OWNER_EMAIL;

function updateAccount(user) {
    importButton.disabled = !isOwner(user);
    if (!user) status.textContent = "Sign in with your owner account first.";
    else if (user.email?.toLowerCase() !== OWNER_EMAIL) status.textContent = `Signed in as ${user.email}. Import requires ${OWNER_EMAIL}.`;
    else if (!user.emailVerified) status.textContent = "Please verify your email, then refresh account status.";
    else status.textContent = "Verified owner. Ready to import country data.";
}
if (firebaseConfigured) onAuthStateChanged(auth, updateAccount, error => status.textContent = friendlyError(error));
else status.textContent = "Set your Firebase configuration in js/firebase.js first.";

refreshButton.addEventListener("click", async () => {
    if (!auth?.currentUser) { updateAccount(null); return; }
    try { await reload(auth.currentUser); updateAccount(auth.currentUser); }
    catch (error) { status.textContent = friendlyError(error); }
});

importButton.addEventListener("click", async () => {
    if (!isOwner(auth?.currentUser)) return;
    importButton.disabled = true;
    status.textContent = "Reading local seed file and uploading to Firebase...";
    status.classList.add("is-loading");
    try {
        const response = await fetch("data/foods.json");
        if (!response.ok) throw new Error("Couldn't load data/foods.json.");
        const data = await response.json();
        if (!Array.isArray(data.countries) || data.countries.length !== 4) throw new Error("Expected 4 countries.");
        for (const country of data.countries) {
            if (!country.id || !Array.isArray(country.foods)) throw new Error("Invalid country record.");
            await setDoc(doc(db, "countries", country.id), country);
        }
        const foods = data.countries.reduce((total, country) => total + country.foods.length, 0);
        status.textContent = `Import complete! Saved ${data.countries.length} countries and ${foods} foods. Open Explore Foods to verify.`;
    } catch (error) {
        status.textContent = `Import failed: ${friendlyError(error)}. Check your Firebase rules and verified email.`;
    } finally {
        status.classList.remove("is-loading");
        importButton.disabled = !isOwner(auth.currentUser);
    }
});
