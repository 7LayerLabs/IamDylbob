# Google Sign-In Setup Guide for Marvel Legends Tracker

## Current Implementation
The app currently has a demo authentication system that:
- Shows a sign-in page (`auth.html`)
- Allows "Continue as Guest" for testing
- Stores auth status in localStorage
- Shows user info and sign-out button when logged in

## To Enable Real Google Sign-In

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure consent screen:
   - App name: "Marvel Legends Tracker"
   - User support email: Your email
   - Authorized domains: Your domain
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: 
     - `http://localhost` (for testing)
     - `https://yourdomain.com` (for production)
   - Authorized redirect URIs: Same as above
7. Copy your Client ID

### Step 2: Update auth.html
Replace the current `signInWithGoogle()` function with:

```html
<!-- Add this in the <head> section -->
<script src="https://accounts.google.com/gsi/client" async defer></script>

<!-- Replace the Google Sign-In button with: -->
<div id="g_id_onload"
     data-client_id="YOUR_CLIENT_ID_HERE"
     data-callback="handleCredentialResponse"
     data-auto_prompt="false">
</div>
<div class="g_id_signin"
     data-type="standard"
     data-size="large"
     data-theme="filled_blue"
     data-text="sign_in_with"
     data-shape="rectangular"
     data-logo_alignment="left">
</div>

<script>
function handleCredentialResponse(response) {
    // Decode the JWT token
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Store user data
    localStorage.setItem('marvelLegendsAuth', JSON.stringify({
        user: responsePayload.email,
        name: responsePayload.name,
        picture: responsePayload.picture,
        signInTime: new Date().toISOString()
    }));
    
    // Redirect to main app
    window.location.href = 'index.html';
}

function decodeJwtResponse(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}
</script>
```

### Step 3: Update Sign Out Function
In `script.js`, update the `signOut()` function:

```javascript
function signOut() {
    // Google Sign-Out
    google.accounts.id.disableAutoSelect();
    
    // Clear local storage
    localStorage.removeItem('marvelLegendsAuth');
    localStorage.removeItem('marvelLegendsFigures');
    
    // Redirect to auth page
    window.location.href = 'auth.html';
}
```

### Step 4: Add User-Specific Data Storage
To save collections per user, modify the localStorage keys in `script.js`:

```javascript
function loadFromStorage() {
    const userKey = currentUser ? `marvelLegends_${currentUser.user}` : 'marvelLegendsFigures';
    const stored = localStorage.getItem(userKey);
    // ... rest of the function
}

function saveToStorage() {
    const userKey = currentUser ? `marvelLegends_${currentUser.user}` : 'marvelLegendsFigures';
    localStorage.setItem(userKey, JSON.stringify(figures));
}
```

## Security Notes
1. **Never expose**: Client Secret (keep server-side only)
2. **Always use HTTPS** in production
3. **Validate tokens** server-side for sensitive operations
4. **Consider Firebase Auth** for easier implementation with more features

## Alternative: Firebase Authentication
For easier implementation with more features:
1. Use Firebase Auth instead of direct Google OAuth
2. Provides built-in user management
3. Syncs data across devices
4. Includes password reset, email verification, etc.

## Testing
1. Test with localhost first
2. Use Chrome DevTools to debug authentication flow
3. Check Network tab for OAuth responses
4. Verify localStorage is properly set

## Production Deployment
1. Update authorized domains in Google Console
2. Use environment variables for Client ID
3. Implement proper error handling
4. Add loading states during authentication
5. Consider adding other sign-in methods (Email, Facebook, etc.)