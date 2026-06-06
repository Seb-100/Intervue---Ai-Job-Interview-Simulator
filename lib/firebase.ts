import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyB87fmG9HL4SAIsEukY2pg76PXoRHM4M7A",
  authDomain: "intervue-febf0.firebaseapp.com",
  projectId: "intervue-febf0",
  storageBucket: "intervue-febf0.firebasestorage.app",
  messagingSenderId: "1043519787079",
  appId: "1:1043519787079:web:c64866942882140cee2162",
  measurementId: "G-H18GB8BRWD"
};

// Prevent re-initialisation on hot reload
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth    = getAuth(app);
export const db      = getFirestore(app);
export const storage = getStorage(app);
export default app;
