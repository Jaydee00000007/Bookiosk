# Firebase setup (Bookiosk)

1. Create a Firebase project and register a Web app.
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a **Cloud Firestore** database (production mode).
4. Add the values from the Firebase Web app config as Vite variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
5. Add the same variables in the Bookiosk Vercel project's environment settings, then redeploy.
6. Configure Firestore rules to restrict each user's documents to their authenticated UID.

The integration uses Firebase's REST endpoints, so no extra npm package is required. Email/password account creation, sign-in and password-reset requests are exposed through `src/services/firebaseAuth.js`. Firestore REST helpers are in `src/services/firebase.js`.

Do not publish server credentials. Firebase web configuration is intended for browser apps; secure the data with Firestore Security Rules.
