// Authentication UI module
import { 
    signInWithGoogle, 
    signOutUser, 
    auth, 
    onAuthStateChanged,
    savePlantToCloud,
    deletePlantFromCloud,
    loadPlantsFromCloud,
    syncPlants
} from './firebase-config.js';

let currentUser = null;
let unsubscribeSync = null;

// Create auth UI elements
export function createAuthUI() {
    // TEMPORARILY DISABLED - Google Sign-in hidden per user request
    console.log('Auth UI temporarily disabled - using local storage only');
    return;
    
    try {
        const authContainer = document.createElement('div');
        authContainer.className = 'auth-container';
        authContainer.innerHTML = `
            <div class="auth-status">
                <div id="authInfo" class="auth-info">Initializing...</div>
                <button id="authBtn" class="auth-btn" style="display: none;">Sign In</button>
            </div>
        `;
        
        // Insert after navbar
        const navbar = document.querySelector('.navbar');
        if (navbar && navbar.parentNode) {
            navbar.parentNode.insertBefore(authContainer, navbar.nextSibling);
        } else {
            document.body.prepend(authContainer);
        }
    
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .auth-container {
                position: fixed;
                top: 70px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 12px 18px;
                border-radius: 10px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                min-width: 220px;
                border: 2px solid #87a96b;
            }
        
        .auth-info {
            font-size: 14px;
            color: #2d5016;
        }
        
        .auth-btn {
            padding: 8px 16px;
            background: linear-gradient(135deg, #2d5016 0%, #87a96b 100%);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: transform 0.2s;
        }
        
        .auth-btn:hover {
            transform: scale(1.05);
        }
        
        .sync-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #2d5016;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            display: none;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }
        
        .sync-active {
            display: block;
        }
    `;
    document.head.appendChild(style);
    
    // Add sync indicator
    const syncIndicator = document.createElement('div');
    syncIndicator.className = 'sync-indicator';
    syncIndicator.id = 'syncIndicator';
    syncIndicator.textContent = '☁️ Syncing...';
    document.body.appendChild(syncIndicator);
    
        // Set up auth button
        const authBtn = document.getElementById('authBtn');
        if (authBtn) {
            authBtn.addEventListener('click', handleAuthClick);
        }
        
        // Monitor auth state
        onAuthStateChanged(auth, (user) => {
            handleAuthStateChange(user);
        });
        
    } catch (error) {
        console.error('Error creating auth UI:', error);
        // Create a fallback UI
        const fallbackAuth = document.createElement('div');
        fallbackAuth.className = 'auth-container';
        fallbackAuth.innerHTML = `
            <div class="auth-status">
                <div class="auth-info">Sign-in temporarily unavailable</div>
            </div>
        `;
        document.body.prepend(fallbackAuth);
    }
}

async function handleAuthClick() {
    const authBtn = document.getElementById('authBtn');
    
    try {
        authBtn.disabled = true;
        authBtn.textContent = 'Processing...';
        
        if (currentUser) {
            await signOutUser();
        } else {
            await signInWithGoogle();
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert('Sign-in failed. Please check your internet connection and try again.');
    } finally {
        authBtn.disabled = false;
        authBtn.textContent = currentUser ? 'Sign Out' : 'Sign In with Google';
    }
}

async function handleAuthStateChange(user) {
    const authInfo = document.getElementById('authInfo');
    const authBtn = document.getElementById('authBtn');
    
    if (!authInfo || !authBtn) {
        console.error('Auth UI elements not found');
        return;
    }
    
    // Show the button now that auth state is determined
    authBtn.style.display = 'block';
    
    if (user) {
        currentUser = user;
        authInfo.textContent = `Signed in as ${user.email}`;
        authBtn.textContent = 'Sign Out';
        
        // Load plants from cloud
        showSyncIndicator();
        const cloudPlants = await loadPlantsFromCloud(user.uid);
        
        // Merge with local plants (prefer cloud if conflict)
        if (cloudPlants.length > 0) {
            window.plants = cloudPlants;
            localStorage.setItem('plants', JSON.stringify(cloudPlants));
            if (window.renderPlants) window.renderPlants();
            if (window.updateCalendar) window.updateCalendar();
        } else {
            // First time user - upload local plants to cloud
            const localPlants = window.plants || [];
            for (const plant of localPlants) {
                await savePlantToCloud(user.uid, plant);
            }
        }
        
        // Set up real-time sync
        if (unsubscribeSync) unsubscribeSync();
        unsubscribeSync = syncPlants(user.uid, (plants) => {
            window.plants = plants;
            localStorage.setItem('plants', JSON.stringify(plants));
            if (window.renderPlants) window.renderPlants();
            if (window.updateCalendar) window.updateCalendar();
            hideSyncIndicator();
        });
        
        hideSyncIndicator();
    } else {
        currentUser = null;
        authInfo.textContent = 'Sign in to sync across devices';
        authBtn.textContent = 'Sign In with Google';
        
        if (unsubscribeSync) {
            unsubscribeSync();
            unsubscribeSync = null;
        }
    }
}

function showSyncIndicator() {
    const indicator = document.getElementById('syncIndicator');
    if (indicator) indicator.classList.add('sync-active');
}

function hideSyncIndicator() {
    setTimeout(() => {
        const indicator = document.getElementById('syncIndicator');
        if (indicator) indicator.classList.remove('sync-active');
    }, 1000);
}

// Export functions for plant operations
export async function saveToCloud(plantData) {
    if (currentUser) {
        showSyncIndicator();
        await savePlantToCloud(currentUser.uid, plantData);
        hideSyncIndicator();
    }
}

export async function deleteFromCloud(plantId) {
    if (currentUser) {
        showSyncIndicator();
        await deletePlantFromCloud(currentUser.uid, plantId);
        hideSyncIndicator();
    }
}

export function isSignedIn() {
    return currentUser !== null;
}

export function getCurrentUser() {
    return currentUser;
}