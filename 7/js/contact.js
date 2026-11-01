"use strict";
import { auth, db, firebaseConfigured, friendlyError } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { addDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

const form = document.getElementById("contact-form");
const gate = document.getElementById("contact-login-required");
const status = document.getElementById("contact-status");
const submit = form.querySelector("[type=submit]");
const emailInput = document.getElementById("contact-email");

function setStatus(message, isError = false) {
    status.textContent = message;
    status.classList.toggle("error-text", isError);
}
function busy(working) {
    submit.disabled = working;
    form.classList.toggle("is-loading", working);
}
if (!firebaseConfigured) {
    gate.hidden = false;
    setStatus("Firebase isn't connected yet. The site owner needs to enter the Firebase config.", true);
} else {
    onAuthStateChanged(auth, (user) => {
        gate.hidden = Boolean(user);
        form.hidden = !user;
        emailInput.value = user?.email || "";
        setStatus(user ? "Signed in. Complete the form to save your message in Firebase." :
            "Please sign in before sending a message.");
    }, (error) => setStatus(friendlyError(error), true));
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const user = auth?.currentUser;
    if (!user) { setStatus("Please sign in before submitting.", true); return; }
    const name = document.getElementById("contact-name").value.trim();
    const topic = document.getElementById("contact-topic").value;
    const message = document.getElementById("contact-message").value.trim();
    if (!name || !message) { setStatus("Name and message must not be blank.", true); return; }
    if (name.length > 120 || message.length > 3000) {
        setStatus("Keep your name under 120 characters and your message under 3,000 characters.", true);
        return;
    }
    busy(true);
    setStatus("Saving your message to Firebase...");
    try {
        const result = await addDoc(collection(db, "contactMessages"), {
            uid: user.uid,
            name,
            email: user.email,
            topic,
            message,
            createdAt: serverTimestamp()
        });
        form.reset();
        emailInput.value = user.email;
        setStatus(`Your message was saved successfully! Confirmation ID: ${result.id}`);
    } catch (error) {
        setStatus(`Your message wasn't saved: ${friendlyError(error)}`, true);
    } finally { busy(false); }
});
