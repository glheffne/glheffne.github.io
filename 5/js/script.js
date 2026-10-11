// Fetch snowboarding information from the JSON file
async function loadBoardingData() {
    const response = await fetch("js/boardingData.json");

    if (!response.ok) {
        throw new Error("Unable to load snowboarding data");
    }

    return await response.json();
}

// Update the webpage using JSON information
function updatePage(data) {

    // Update browser title
    document.title = data.title;

    // Update main header
    document.getElementById("styleName").textContent =
        data.header;

    // Update hero section
    document.getElementById("heroTitle").textContent =
        data.hero.headline;

    document.getElementById("heroDesc").textContent =
        data.hero.description;

    // Update Overview section
    document.getElementById("sec1Title").textContent =
        data.sections.overview.title;

    document.getElementById("sec1Subtitle").textContent =
        data.sections.overview.subtitle;

    // Update Equipment section
    document.getElementById("sec2Title").textContent =
        data.sections.equipment.title;

    document.getElementById("sec2Subtitle").textContent =
        data.sections.equipment.subtitle;

    // Update Overview cards
    const overviewCards =
        document.querySelectorAll("#sec1Grid .card");

    data.sections.overview.cards.forEach((card, index) => {
        overviewCards[index].querySelector("h3").textContent =
            card.title;

        overviewCards[index].querySelector("p").textContent =
            card.description;
    });

    // Update Equipment cards
    const equipmentCards =
        document.querySelectorAll("#sec2Grid .card");

    data.sections.equipment.cards.forEach((card, index) => {
        equipmentCards[index].querySelector("h3").textContent =
            card.title;

        equipmentCards[index].querySelector("p").textContent =
            card.description;
    });
}

// Change the hero background image
function updateBackground(data) {
    const hero = document.getElementById("heroSection");

    // Get the image path from JSON and resolve it
    // relative to the JSON file's directory
    const imageURL = new URL(
        data.hero.image,
        new URL("js/boardingData.json", document.baseURI)
    ).href;

    // Update the CSS background image variable
    hero.style.setProperty(
        "--hero-img",
        `url("${imageURL}")`
    );

    console.log("Background image updated:", imageURL);
}

// Change skiing information to snowboarding
async function changeToSnowboarding() {
    try {
        const data = await loadBoardingData();

        // Update text and cards
        updatePage(data);

        // Update background image
        updateBackground(data);

        console.log("Page successfully changed to snowboarding!");

    } catch (error) {
        console.error("Error updating webpage:", error);
    }
}

// Connect the Change button to JavaScript
document.getElementById("changeThemeBtn")
    .addEventListener("click", changeToSnowboarding);
