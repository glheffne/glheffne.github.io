// Fetch the snowboarding information from JSON
async function loadBoardingData() {
    const response = await fetch("js/boardingData.json");

    if (!response.ok) {
        throw new Error("Unable to load snowboarding data");
    }

    return await response.json();
}

// Update the webpage using the JSON information
function updatePage(data) {

    // Update the browser title
    document.title = data.title;

    // Update the main header
    document.getElementById("styleName").textContent =
        data.header;

    // Update the hero section
    document.getElementById("heroTitle").textContent =
        data.hero.headline;

    document.getElementById("heroDesc").textContent =
        data.hero.description;

    // Update the Overview section
    document.getElementById("sec1Title").textContent =
        data.sections.overview.title;

    document.getElementById("sec1Subtitle").textContent =
        data.sections.overview.subtitle;

    // Update the Equipment section
    document.getElementById("sec2Title").textContent =
        data.sections.equipment.title;

    document.getElementById("sec2Subtitle").textContent =
        data.sections.equipment.subtitle;

    // Update the Overview cards
    const overviewCards =
        document.querySelectorAll("#sec1Grid .card");

    data.sections.overview.cards.forEach((card, index) => {
        overviewCards[index].querySelector("h3").textContent =
            card.title;

        overviewCards[index].querySelector("p").textContent =
            card.description;
    });

    // Update the Equipment cards
    const equipmentCards =
        document.querySelectorAll("#sec2Grid .card");

    data.sections.equipment.cards.forEach((card, index) => {
        equipmentCards[index].querySelector("h3").textContent =
            card.title;

        equipmentCards[index].querySelector("p").textContent =
            card.description;
    });
}

// Change the background image using the CSS variable
function updateBackground(data) {
    const hero = document.getElementById("heroSection");

    hero.style.setProperty(
        "--hero-img",
        'url("img/alpineBoarding.jpg")'
    );
}

// Run when the Change button is clicked
async function changeToSnowboarding() {
    try {
        const data = await loadBoardingData();

        updatePage(data);
        updateBackground(data);

    } catch (error) {
        console.error("Error loading snowboarding data:", error);
    }
}

// Connect the Change button to the JavaScript function
document.getElementById("changeThemeBtn")
    .addEventListener("click", changeToSnowboarding);
