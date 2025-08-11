# Firebase Setup Guide for Rooted With Eva

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "rooted-with-eva" (or any name you prefer)
4. Disable Google Analytics (optional)
5. Click "Create Project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on "Google" sign-in method
4. Toggle "Enable"
5. Add your email as Project support email
6. Click "Save"

## Step 3: Set up Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select your region (closest to your users)
5. Click "Enable"

## Step 4: Configure Security Rules

1. In Firestore, click on "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Your Configuration

1. Click the gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the "</>" (Web) icon
5. Register app with nickname "Rooted Web App"
6. Copy the configuration object

## Step 6: Update firebase-config.js

Replace the placeholder config in `firebase-config.js` with your actual config:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

## Step 7: Configure Authorized Domains

1. In Firebase Console, go to Authentication > Settings
2. Click "Authorized domains" tab
3. Add your domain (e.g., `yourdomain.com`)
4. For local testing, `localhost` is already authorized

## Step 8: Deploy Your Site

You can host on Firebase Hosting (free) or any web server:

### Option A: Firebase Hosting (Recommended)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Run `firebase init` in your project folder
3. Select "Hosting"
4. Use existing project
5. Public directory: `.` (current directory)
6. Single-page app: No
7. Deploy with: `firebase deploy`

### Option B: Other Hosting
- Upload all files to your web server
- Ensure HTTPS is enabled (required for Firebase Auth)

## Features Now Available

✅ Sign in with Google account
✅ Data syncs across all devices
✅ Real-time updates between devices
✅ Offline support with automatic sync
✅ Secure user data isolation
✅ No backend server needed

## Testing

1. Open your site in a browser
2. Click "Sign In with Google" 
3. Add a plant on one device
4. Sign in on another device
5. See your plants appear automatically!

## Troubleshooting

- **Sign-in popup blocked**: Allow popups for your site
- **Not syncing**: Check Firestore rules and authentication
- **Console errors**: Verify Firebase config is correct
- **CORS issues**: Use Firebase Hosting or configure CORS headers

## Support

For issues with the plant tracker, check the browser console for error messages.
For Firebase issues, visit [Firebase Support](https://firebase.google.com/support).