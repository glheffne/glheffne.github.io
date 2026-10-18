"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const DATA_URL = "data/foods.json";

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

    // Update the status message for loading, errors, or instructions.
    function updateStatus(message) {
        statusMessage.textContent = message;
    }

    // Hide the food details and clear previously displayed information.
    function clearDetails() {
        detailsContainer.replaceChildren();
        detailsSection.hidden = true;
    }

    // Display a button that reloads the JSON if loading fails.
    function showRetryButton() {
        const retryButton = createElement("button", "Try Again");
        retryButton.type = "button";
        retryButton.addEventListener("click", loadFoodData);

        selectionContainer.replaceChildren(retryButton);
    }

    // Load the external JSON file using fetch and Promises.
    function loadFoodData() {
        updateStatus("Loading country information...");
        selectionContainer.replaceChildren();
        clearDetails();

        backButton.hidden = true;
        restartButton.hidden = true;

        fetch(DATA_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Unable to load food information.");
                }

                return response.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data.countries)) {
                    throw new Error("Invalid food data.");
                }

                countries = data.countries;
                showCountries();
            })
            .catch(() => {
                updateStatus(
                    "Food information could not be loaded. Please try again."
                );
                showRetryButton();
            });
    }

    // Display the available countries as clickable buttons.
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

            card.append(heading, description, button);
            selectionContainer.appendChild(card);
        });
    }

    // Display the four traditional foods for the selected country.
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

            card.append(heading, description, button);
            selectionContainer.appendChild(card);
        });
    }

    // Display the description, ingredients, and cultural significance.
    function showFoodDetails(food) {
        clearDetails();

        const heading = createElement("h3", food.name);
        const descriptionHeading = createElement("h4", "Description");
        const description = createElement("p", food.description);
        const ingredientsHeading = createElement("h4", "Ingredients");
        const ingredientsList = document.createElement("ul");
        const significanceHeading = createElement(
            "h4",
            "Cultural Significance"
        );
        const significance = createElement("p", food.culturalSignificance);

        food.ingredients.forEach((ingredient) => {
            const listItem = createElement("li", ingredient);
            ingredientsList.appendChild(listItem);
        });

        detailsContainer.append(
            heading,
            descriptionHeading,
            description,
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

    // Return to the country selection screen.
    function restartSelection() {
        showCountries();
    }

    // Return from the food selection screen to the country list.
    backButton.addEventListener("click", restartSelection);

    // Allow visitors to explore another country.
    restartButton.addEventListener("click", restartSelection);

    // Start the application by loading its JSON data.
    loadFoodData();
});