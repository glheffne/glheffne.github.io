"use strict";
import { auth, db, firebaseConfigured, friendlyError } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
    const gate = document.getElementById("explore-signin");
    let lastUserId = null;

    const selectionContainer = document.getElementById("selection-container");
    const detailsSection = document.getElementById("details-section");
    const detailsContainer = document.getElementById("details-container");
    const statusMessage = document.getElementById("status-message");
    const backButton = document.getElementById("back-button");
    const restartButton = document.getElementById("restart-button");

    let countries = [];
    let selectedCountry = null;

    // Create an HTML element with optional text and CSS class.
    function createElement(tagName, textContent = "", className = "") {
        const element = document.createElement(tagName);
        element.textContent = textContent;

        if (className) {
            element.className = className;
        }

        return element;
    }

    // Update the message describing the application's current state.
    function updateStatus(message) {
        statusMessage.textContent = message;
    }

    // Remove previously displayed food details.
    function clearDetails() {
        detailsContainer.replaceChildren();
        detailsSection.hidden = true;
    }

    // Display a retry button if the JSON request fails.
    function showRetryButton() {
        const retryButton = createElement("button", "Try Again");
        retryButton.type = "button";
        retryButton.addEventListener("click", loadFoodData);

        selectionContainer.replaceChildren(retryButton);
    }

    // Load country and dish documents directly from Firestore, not the local JSON file.
    async function loadFoodData() {
        if (!auth?.currentUser) return;
        updateStatus("Loading traditional foods...");
        statusMessage.classList.add("is-loading");
        selectionContainer.replaceChildren();
        clearDetails();
        backButton.hidden = true;
        restartButton.hidden = true;
        try {
            const snapshot = await getDocs(collection(db, "countries"));
            if (snapshot.empty) {
                updateStatus("Our food guide is temporarily unavailable. Please check back soon.");
                return;
            }
            const order = ["kazakhstan", "kyrgyzstan", "turkmenistan", "uzbekistan"];
            countries = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
                .sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
            if (!countries.every((country) => Array.isArray(country.foods))) {
                throw new Error("Some food records are incomplete.");
            }
            showCountries();
        } catch (error) {
            updateStatus(`We couldn't load the food guide: ${friendlyError(error)}`);
            showRetryButton();
        } finally {
            statusMessage.classList.remove("is-loading");
        }
    }

    // Display country cards using information and images from JSON.
    function showCountries() {
        selectedCountry = null;
        selectionContainer.replaceChildren();
        clearDetails();

        selectionContainer.className = "country-grid";

        backButton.hidden = true;
        restartButton.hidden = true;

        updateStatus("Select a country to explore its traditional foods.");

        countries.forEach((country) => {
            const card = createElement("article", "", "country-card");

            const image = document.createElement("img");
            image.src = country.image;
            image.alt = `Traditional food from ${country.name}`;
            image.className = "country-image";
            image.loading = "lazy";

            const heading = createElement("h3", country.name);
            const description = createElement("p", country.description);

            const button = createElement(
                "button",
                `Explore ${country.name}`
            );

            button.type = "button";
            button.addEventListener("click", () => {
                showFoods(country);
            });

            card.append(image, heading, description, button);
            selectionContainer.appendChild(card);
        });
    }

    // Display the traditional dishes associated with one country.
    function showFoods(country) {
        selectedCountry = country;
        selectionContainer.replaceChildren();
        clearDetails();

        selectionContainer.className = "food-grid";

        backButton.hidden = false;
        restartButton.hidden = true;

        updateStatus(
            `Choose a traditional food from ${country.name}.`
        );

        country.foods.forEach((food) => {
            const card = createElement("article", "", "food-card");
            const image = document.createElement("img");
            image.src = food.image;
            image.alt = `Illustration of ${food.name}, a traditional dish from ${country.name}`;
            image.className = "dish-image";
            image.loading = "lazy";
            image.width = 384;
            image.height = 384;

            const heading = createElement("h3", food.name);
            const description = createElement("p", food.description);

            const button = createElement(
                "button",
                `Learn About ${food.name}`
            );

            button.type = "button";
            button.addEventListener("click", () => {
                showFoodDetails(food);
            });

            card.append(image, heading, description, button);
            selectionContainer.appendChild(card);
        });
    }

    // Display the selected dish's information without changing pages.
    function showFoodDetails(food) {
        clearDetails();

        const heading = createElement("h3", food.name);
        const image = document.createElement("img");
        image.src = food.image;
        image.alt = `Illustration of ${food.name} from ${selectedCountry.name}`;
        image.className = "dish-detail-image";
        image.width = 384;
        image.height = 384;

        const descriptionHeading = createElement("h4", "Description");
        const description = createElement("p", food.description);

        const preparationHeading = createElement("h4", "How It Is Prepared");
        const preparation = createElement("p", food.preparation || "Preparation varies by region and family.");

        const ingredientsHeading = createElement("h4", "Ingredients");
        const ingredientsList = document.createElement("ul");

        const significanceHeading = createElement(
            "h4",
            "Cultural Significance"
        );

        const significance = createElement(
            "p",
            food.culturalSignificance
        );

        food.ingredients.forEach((ingredient) => {
            const listItem = createElement("li", ingredient);
            ingredientsList.appendChild(listItem);
        });

        detailsContainer.append(
            heading,
            image,
            descriptionHeading,
            description,
            preparationHeading,
            preparation,
            ingredientsHeading,
            ingredientsList,
            significanceHeading,
            significance
        );

        detailsSection.hidden = false;
        restartButton.hidden = false;

        updateStatus(
            `Showing information about ${food.name} from ${selectedCountry.name}.`
        );
    }

    // Return to the initial country selection screen.
    function restartSelection() {
        showCountries();
    }

    backButton.addEventListener("click", restartSelection);
    restartButton.addEventListener("click", restartSelection);

    // Don't read database content until Firebase finishes checking authentication.
    if (!firebaseConfigured) {
        updateStatus("The food guide is temporarily unavailable. Please try again later.");
    } else {
        onAuthStateChanged(auth, (user) => {
            gate.hidden = Boolean(user);
            if (user) {
                if (user.uid !== lastUserId) { lastUserId = user.uid; loadFoodData(); }
            } else {
                lastUserId = null;
                countries = [];
                selectionContainer.replaceChildren();
                clearDetails();
                backButton.hidden = true;
                restartButton.hidden = true;
                updateStatus("Sign in to explore traditional foods from across Central Asia.");
            }
        }, (error) => updateStatus(friendlyError(error)));
    }
});
