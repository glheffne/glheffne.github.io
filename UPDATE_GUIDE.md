# Project 4 — Usability updates (November 2026)

Based on feedback from three reviewers, the following were updated:

- Added one AI-generated illustrative image per dish (16 total) in `img/dishes/`.
- Updated `data/foods.json` with a relative image path and preparation details for each dish. All pre-existing country descriptions, food descriptions, ingredients, and cultural significance information were preserved.
- Updated `js/script.js` to display dish images on food cards and in detail sections, along with preparation notes.
- Added a `Log In` navigation button on all four pages. It opens a clearly labeled demonstration form (`js/login.js`), without storing credentials or performing authentication.
- Redesigned `contact.html` with a stacked Name / Email / Topic / Message form similar to the supplied screenshot.
- Added `js/contact.js` to open the visitor's email application using `mailto:`. This does **not** send a message automatically. The visitor must click Send in their email app.
- Kept the previously available About, Feedback, and FAQ content on the contact page, and added a terracotta/gold accent to the existing warm color scheme.
- Preserved the original top-level landing page and Projects 1–3 and Activities.

## Publishing the site

1. Extract the ZIP file to a folder on your computer.
2. Upload **the contents** of `glheffne.github.io-main` to the root of your GitHub Pages repository, keeping directories in the same places. If uploading only Project 4, replace the contents of folder `6` with the new version, including `img/dishes/` and `js/login.js` / `js/contact.js`.
3. Commit the changes to the repository. GitHub Pages should then publish the updated site at `https://glheffne.github.io/6/`.
4. Open the updated site, test its links, try the food explorer, and verify the form opens a local email draft. Test the login button only with made-up credentials; it is a demonstration.

## Local testing note

The explorer fetches `data/foods.json`. Opening `explore.html` directly from the filesystem (`file://`) may be blocked by browsers. Test on GitHub Pages, or run a local server from the repository root: `python -m http.server 8000`. Then visit `http://localhost:8000/6/`.

## Images

See `IMAGE_NOTES.md`. All 16 dish images are AI-generated visual representations, rather than documentary photographs. If later replacing them with real photos, confirm each photo accurately depicts the food and credit its source/license.
