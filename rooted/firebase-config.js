// Firebase configuration
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { 
    getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    signOut,
    onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc,
    getDocs,
    deleteDoc,
    onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8yrTVBPm047s831E5rEcYEvKIDO4N31o",
  authDomain: "rooted-with-eva.firebaseapp.com",
  projectId: "rooted-with-eva",
  storageBucket: "rooted-with-eva.firebasestorage.app",
  messagingSenderId: "421442337002",
  appId: "1:421442337002:web:bf8d6e78ae60b8a7b87f93",
  measurementId: "G-FCMV1E4449"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Auth functions
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

// Plant data functions
export async function savePlantToCloud(userId, plantData) {
    try {
        const plantRef = doc(db, 'users', userId, 'plants', plantData.id.toString());
        await setDoc(plantRef, plantData);
    } catch (error) {
        console.error("Error saving plant:", error);
        throw error;
    }
}

export async function deletePlantFromCloud(userId, plantId) {
    try {
        const plantRef = doc(db, 'users', userId, 'plants', plantId.toString());
        await deleteDoc(plantRef);
    } catch (error) {
        console.error("Error deleting plant:", error);
        throw error;
    }
}

export async function loadPlantsFromCloud(userId) {
    try {
        const plantsCollection = collection(db, 'users', userId, 'plants');
        const snapshot = await getDocs(plantsCollection);
        const plants = [];
        snapshot.forEach(doc => {
            plants.push(doc.data());
        });
        return plants;
    } catch (error) {
        console.error("Error loading plants:", error);
        return [];
    }
}

// Real-time sync
export function syncPlants(userId, callback) {
    const plantsCollection = collection(db, 'users', userId, 'plants');
    return onSnapshot(plantsCollection, (snapshot) => {
        const plants = [];
        snapshot.forEach(doc => {
            plants.push(doc.data());
        });
        callback(plants);
    });
}

export { onAuthStateChanged };