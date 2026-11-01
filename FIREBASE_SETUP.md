# Project 5 Firebase setup — Central Asian Culture & Cuisine

This website is a static GitHub Pages site that uses Firebase Authentication and Cloud Firestore. The web app configuration in `js/firebase.js` is now set to your `central-asian-cuisine` Firebase project. Authentication, Firestore and Firestore security rules still need enabling in Firebase Console before the site works end-to-end.

## 1. Create project and register a web app

1. Go to https://console.firebase.google.com/ and sign in.
2. Create a project, e.g. `central-asian-cuisine`. Google Analytics is optional.
3. Select the Web (`</>`) icon and register app nickname `Central Asian Cuisine Web`. You do not need to enable Firebase Hosting.
4. Firebase displays `const firebaseConfig = { apiKey: ..., authDomain: ..., projectId: ..., storageBucket: ..., messagingSenderId: ..., appId: ... }`.
5. **Already completed:** `7/js/firebase.js` contains the Firebase web config. These are *web configuration values*, not an Admin SDK private key. **Never upload a service-account JSON or a Firebase private key to GitHub.**

## 2. Enable Firebase Authentication

1. In Firebase Console > Build / Security > Authentication > Get started, open **Sign-in method**.
2. Enable **Email/Password** and click **Save**.
3. In **Authentication > Settings > Authorized domains**, ensure **`glheffne.github.io`** is authorized. Add `localhost` if using a local web server for testing. Google's Firebase hosted domains may already be present.
4. Open `https://glheffne.github.io/7/`, click Log In, and create an account using **`glheffne@go.olemiss.edu`** (or change the project-owner email in the next step).
5. Open your verification email and follow the link; reload the page or choose Refresh Account Status on the import page.

## 3. Create Firestore and publish rules

1. Firebase Console > **Firestore Database** > **Create database**.
2. Choose Standard (Native mode) database and a nearby U.S. region. Choose **production mode** (access denied until rules are published).
3. Open **Firestore Database > Rules**.
4. Copy everything from `7/firestore.rules` into the console's rules editor and click **Publish**.
5. The example rules designate `glheffne@go.olemiss.edu` as the verified owner permitted to import food data. **If you signed up under a different email**, change the email in BOTH `7/firestore.rules` (publish again) and `7/js/import.js` (OWNER_EMAIL). Do not let all signed-in users write to `countries`.
6. Avoid replacing rules with global `allow read, write: if true;`: that exposes all submissions to the internet.

## 4. Import the 16 dishes

1. Upload the new `7/` folder to GitHub Pages, with your configured `js/firebase.js`.
2. Visit `https://glheffne.github.io/7/setup-data.html`.
3. Sign in with your verified owner account and choose **Refresh Account Status**.
4. Click **Import 4 Countries + 16 Foods**. It reads `data/foods.json` and writes 4 Firestore documents under the `countries` collection; each includes an array of 4 foods.
5. Open Firebase Console > Firestore Database > Data to verify `countries/kazakhstan`, `countries/kyrgyzstan`, `countries/turkmenistan`, and `countries/uzbekistan`.
6. On `/7/explore.html`, sign in and confirm you can select a country, choose a dish, and view its details. This fetches from Firestore, not the local JSON file.

## 5. Test the contact form

1. While signed in, visit `/7/contact.html`.
2. Fill in Name, Topic and Message (the signed-in email is filled automatically).
3. Click Send message and wait for a success message containing a confirmation ID.
4. In Firebase Console > Firestore Database > Data, confirm the new document under `contactMessages`.
5. Sign out and verify submitting is unavailable. Signing in with a wrong password should display an inline error and shouldn't throw an alert.
6. Contact submissions do **not** send email: they are written to Firestore. Only Firebase project administrators (in Firebase Console) can view them, as app client reads are denied.

## 6. Local testing and submission

GitHub Pages is the main host. You can also use VS Code Live Server or `python -m http.server 8000` from repository root and open `http://localhost:8000/7/`. `file://` previews won't work well with modules/fetch.

Submit repository URL: https://github.com/glheffne/glheffne.github.io

Check the deployed `/7/` pages on mobile and desktop; validate at https://validator.w3.org/ , https://jigsaw.w3.org/css-validator/ , and https://wave.webaim.org/ . Also check sign-in, Firestore loading, error handling, and message save.

## Common errors

- **Firebase isn't connected**: confirm `js/firebase.js` loads and you uploaded the configured Project 5 files.
- **auth/unauthorized-domain**: add `glheffne.github.io` to Authentication > Settings > Authorized domains.
- **auth/operation-not-allowed**: enable the Email/Password provider.
- **permission-denied in import**: verify the owner email; click the verification link; publish matching Firestore rules.
- **food list empty**: visit `setup-data.html` and import the original `data/foods.json`.
- **contact save denied**: check Firestore rules, authentication, email and required text fields.

This is a course demonstration. For a production website, add anti-abuse protections, data retention rules, and a privacy notice for contact submissions.
