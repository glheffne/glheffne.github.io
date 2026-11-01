"use strict";

// This is a demonstration interface, not an authentication system.
document.addEventListener("DOMContentLoaded", () => {
    const triggers = document.querySelectorAll("[data-login-open]");
    if (!triggers.length) return;

    const dialog = document.createElement("dialog");
    dialog.className = "login-dialog";
    dialog.setAttribute("aria-labelledby", "demo-login-heading");
    dialog.innerHTML = `
        <div class="login-dialog-header">
            <h2 id="demo-login-heading">Demo Login</h2>
            <button type="button" class="login-close" aria-label="Close login" data-login-close>&times;</button>
        </div>
        <p class="mock-note">This is a preview of a future feature. No account is created and no information is sent or saved. Please do not use real passwords.</p>
        <form id="demo-login-form">
            <div class="form-group">
                <label for="demo-email">Email</label>
                <input type="email" id="demo-email" autocomplete="off" placeholder="example@email.com" required>
            </div>
            <div class="form-group">
                <label for="demo-password">Password</label>
                <input type="password" id="demo-password" autocomplete="off" placeholder="Use a made-up password" required>
            </div>
            <button class="demo-login-submit" type="submit">Preview Login</button>
            <p class="login-feedback" role="status" aria-live="polite"></p>
        </form>`;
    document.body.appendChild(dialog);

    const form = dialog.querySelector("#demo-login-form");
    const feedback = dialog.querySelector(".login-feedback");
    triggers.forEach((button) => button.addEventListener("click", () => {
        feedback.textContent = "";
        form.reset();
        dialog.showModal();
        dialog.querySelector("#demo-email").focus();
    }));
    dialog.querySelector("[data-login-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
    form.addEventListener("submit", (event) => {
        event.preventDefault();
        feedback.textContent = "Demo complete! Real sign-in is not available yet.";
        form.reset();
    });
});
