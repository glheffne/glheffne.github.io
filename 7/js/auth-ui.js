"use strict";
import { auth, firebaseConfigured, friendlyError } from "./firebase.js";
import {
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
    sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";

const dialog = document.createElement("dialog");
dialog.className = "login-dialog";
dialog.setAttribute("aria-labelledby", "firebase-login-heading");
dialog.innerHTML = `
    <div class="login-dialog-header">
        <h2 id="firebase-login-heading">Account</h2>
        <button type="button" class="login-close" data-login-close aria-label="Close account dialog">&times;</button>
    </div>
    <p class="mock-note">Create a free account to discover traditional foods and share your questions or suggestions.</p>
    <p class="firebase-warning" id="firebase-setup-warning" hidden>Account services are temporarily unavailable. Please try again later.</p>
    <form id="firebase-login-form">
        <div class="form-group"><label for="firebase-email">Email</label>
            <input type="email" id="firebase-email" name="email" autocomplete="email" required></div>
        <div class="form-group"><label for="firebase-password">Password</label>
            <input type="password" id="firebase-password" name="password" autocomplete="current-password" minlength="6" required></div>
        <div class="auth-buttons">
            <button type="submit" name="action" value="login">Log In</button>
            <button type="submit" name="action" value="signup" class="secondary-button">Create Account</button>
        </div>
        <button type="button" id="firebase-reset" class="text-button">Forgot password?</button>
    </form>
    <div id="firebase-signed-in" hidden>
        <p><strong>Signed in as:</strong> <span id="firebase-signed-in-email"></span></p>
        <p id="firebase-verify-status"></p>
        <div class="auth-buttons">
            <button type="button" id="firebase-verification">Send Verification Email</button>
            <button type="button" id="firebase-signout" class="secondary-button">Log Out</button>
        </div>
    </div>
    <p class="login-feedback" id="firebase-auth-status" role="status" aria-live="polite"></p>
`;
document.body.appendChild(dialog);

const buttons = document.querySelectorAll("[data-login-open]");
const loginForm = dialog.querySelector("#firebase-login-form");
const signedInPanel = dialog.querySelector("#firebase-signed-in");
const status = dialog.querySelector("#firebase-auth-status");
const emailInput = dialog.querySelector("#firebase-email");
const passwordInput = dialog.querySelector("#firebase-password");
const setBusy = (busy) => {
    for (const button of dialog.querySelectorAll("button")) button.disabled = busy;
    dialog.classList.toggle("is-loading", busy);
};
const setMessage = (message, isError = false) => {
    status.textContent = message;
    status.classList.toggle("error-text", isError);
};
function openDialog() {
    setMessage("");
    dialog.showModal();
    if (!auth?.currentUser) emailInput.focus();
}
window.openProjectLogin = openDialog;
for (const button of buttons) button.addEventListener("click", openDialog);
dialog.querySelector("[data-login-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });

if (!firebaseConfigured) {
    dialog.querySelector("#firebase-setup-warning").hidden = false;
    loginForm.querySelectorAll("button").forEach(button => button.disabled = true);
    buttons.forEach(button => button.textContent = "Account Unavailable");
} else {
    onAuthStateChanged(auth, (user) => {
        const loggedIn = Boolean(user);
        loginForm.hidden = loggedIn;
        signedInPanel.hidden = !loggedIn;
        dialog.querySelector("#firebase-signed-in-email").textContent = user?.email || "";
        dialog.querySelector("#firebase-verify-status").textContent = user
            ? user.emailVerified ? "Email verified." : "Please verify your email to finish setting up your account."
            : "";
        dialog.querySelector("#firebase-verification").hidden = !user || user.emailVerified;
        buttons.forEach(button => button.textContent = loggedIn ? "My Account" : "Log In");
        document.dispatchEvent(new CustomEvent("site-auth-changed", { detail: { user } }));
    }, (error) => setMessage(friendlyError(error), true));
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!loginForm.reportValidity() || !auth) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const action = event.submitter?.value || "login";
    setBusy(true);
    setMessage(action === "signup" ? "Creating your account..." : "Signing in...");
    try {
        if (action === "signup") {
            const { user } = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(user);
            setMessage("Account created and signed in! Check your inbox to verify your email.");
        } else {
            await signInWithEmailAndPassword(auth, email, password);
            setMessage("Welcome back! You can now explore the food guide or get in touch.");
        }
        passwordInput.value = "";
    } catch (error) {
        setMessage(friendlyError(error), true);
    } finally { setBusy(false); }
});

dialog.querySelector("#firebase-reset").addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) { setMessage("Enter your email above first, then select Forgot password.", true); return; }
    setBusy(true); setMessage("Sending password reset instructions...");
    try {
        await sendPasswordResetEmail(auth, email);
        setMessage("If an account exists for that address, reset instructions have been requested.");
    } catch (error) { setMessage(friendlyError(error), true); }
    finally { setBusy(false); }
});

dialog.querySelector("#firebase-signout").addEventListener("click", async () => {
    setBusy(true); setMessage("Signing out...");
    try { await signOut(auth); setMessage("Signed out."); }
    catch (error) { setMessage(friendlyError(error), true); }
    finally { setBusy(false); }
});

dialog.querySelector("#firebase-verification").addEventListener("click", async () => {
    setBusy(true); setMessage("Sending verification email...");
    try { await sendEmailVerification(auth.currentUser); setMessage("Check your email for a verification link."); }
    catch (error) { setMessage(friendlyError(error), true); }
    finally { setBusy(false); }
});
