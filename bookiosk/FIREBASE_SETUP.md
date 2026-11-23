# Firebase setup (Bookiosk)

## 1. Firebase project
1. Open the Firebase console and create or select the project for Bookiosk.
2. Register a Web app in Project settings.
3. In **Authentication → Sign-in method**, enable **Email/Password**.
4. In **Firestore Database**, create the default database.

## 2. Environment variables
Copy the Web app configuration values into a local `bookiosk/.env` file and the Bookiosk Vercel project's Environment Variables:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`

Use the exact values from Firebase Project settings → Your apps → SDK setup and configuration. Add them to Vercel for **Production**, **Preview**, and **Development** as needed, then redeploy. Never commit the .env file.

## 3. Firestore security rules
In Firestore → Rules, publish rules that restrict every user's shelf to their own authenticated UID:

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/shelf/{bookId} {
      allow read, create, update, delete: if request.auth != null
        && request.auth.uid == userId;
    }
  }
}
```

Do not use open rules such as `allow read, write: if true`.

## 4. What Bookiosk uses
- Email/password sign-up and sign-in through Firebase Authentication.
- Password reset email through Firebase Authentication.
- ID-token refresh to keep sessions working after the initial token expires.
- Firestore path `users/{uid}/shelf/{bookId}` for the signed-in user's saved books.
- A separate guest shelf and per-user local cache so books from one signed-in account are not shown to another account on the same browser.

Google sign-in is not enabled in the current UI. Firebase web configuration is intended for browser apps; access to personal reading data is enforced by the Firestore rules above.
