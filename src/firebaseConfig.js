import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

console.log(import.meta);
console.log(import.meta.env);
console.log(import.meta.env.VITE_FIREBASE_CONFIG);
const firebaseConfig = import.meta.env.VITE_FIREBASE_CONFIG;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
