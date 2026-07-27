// Firebase Configuration — Member 5 Netflix Project
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBC8F4lovUDjRusWCtZ9MamKxVTfNe-0YA",
  authDomain: "netflix-member5.firebaseapp.com",
  projectId: "netflix-member5",
  storageBucket: "netflix-member5.firebasestorage.app",
  messagingSenderId: "1081168864198",
  appId: "1:1081168864198:web:e2623070bab052b1a7c8c7",
  measurementId: "G-9CYHM1T70G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore Database
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);

export default app;
