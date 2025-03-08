import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbnHqyIPNwN3SMhvv31_T5wNt543lpSRE",
  authDomain: "focus-room-d4329.firebaseapp.com",
  projectId: "focus-room-d4329",
  storageBucket: "focus-room-d4329.appspot.com",
  messagingSenderId: "751671234091",
  appId: "1:751671234091:web:547f51dd94f98a2a33246e",
  measurementId: "G-LET6WLT4L7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Register user function
export const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user; // Return the user object
  } catch (error) {
    throw new Error(error.message); // Throw error for handling in the component
  }
};

// Export Firebase services
export { app, analytics, auth, db };
