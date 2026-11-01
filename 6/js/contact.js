"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("contact-status");
    if (!form || !status) return;

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!form.reportValidity()) return;

        const name = document.getElementById("contact-name").value.trim();
        const email = document.getElementById("contact-email").value.trim();
        const topic = document.getElementById("contact-topic").value;
        const message = document.getElementById("contact-message").value.trim();
        if (!name || !email || !message) return;

        const subject = encodeURIComponent(`[Central Asian Culture & Cuisine] ${topic}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nTopic: ${topic}\n\n${message}`);
        status.textContent = "Your email app should open with a draft. Please review it and press Send there to deliver your message.";
        window.location.href = `mailto:glheffne@go.olemiss.edu?subject=${subject}&body=${body}`;
    });
});
