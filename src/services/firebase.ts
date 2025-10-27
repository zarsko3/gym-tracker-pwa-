import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCWIFSIob0GB3jtopGjNTClFVzpRJnMXZo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gym-tracker0pwa.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gym-tracker0pwa",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gym-tracker0pwa.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "61186173345",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:61186173345:web:481eb9a25be64fe6de03e0",
  measurementId: "G-WG6QCBERJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Connect to emulators in development
if (import.meta.env.DEV) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    // Emulators already connected or not available
    console.log('Firebase emulators not available');
  }
}

export default app;
