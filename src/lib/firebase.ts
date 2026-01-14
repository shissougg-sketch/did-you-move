import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

// Firebase client config - these are public identifiers, not secrets.
// Security is enforced by Firebase Security Rules, not by hiding these values.
const firebaseConfig = {
  apiKey: "AIzaSyDGZJsiHV7LVSygyDUE0xBcnjWjLfZXzsI",
  authDomain: "mobble-5c274.firebaseapp.com",
  projectId: "mobble-5c274",
  storageBucket: "mobble-5c274.firebasestorage.app",
  messagingSenderId: "548780301916",
  appId: "1:548780301916:web:de98a3bd1017e79556d099",
  measurementId: "G-65KPSSJNG0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging (only if supported)
let messaging: Messaging | null = null;

export const getFirebaseMessaging = async (): Promise<Messaging | null> => {
  if (messaging) return messaging;

  const supported = await isSupported();
  if (supported) {
    messaging = getMessaging(app);
  }
  return messaging;
};

export { app };
