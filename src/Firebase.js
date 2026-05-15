import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Database ke liye zaroori hai

const firebaseConfig = {
  apiKey: "AIzaSyBYkuvXq7P5R0FZSLUexhIbRYS50k_RqW4",
  authDomain: "studypulse-db.firebaseapp.com",
  projectId: "studypulse-db",
  storageBucket: "studypulse-db.firebasestorage.app",
  messagingSenderId: "751862030450",
  appId: "1:751862030450:web:e6075a8d3cf033827122eb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Database (Firestore) ko export karein taake Profile.jsx mein use kar sakein
export const db = getFirestore(app);