import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDSQxLegaKwfiZ9qZe5YoHdxa39Qj-PtAg",
  authDomain: "messsathi-c1281.firebaseapp.com",
  projectId: "messsathi-c1281",
  storageBucket: "messsathi-c1281.firebasestorage.app",
  messagingSenderId: "1023281342544",
  appId: "1:1023281342544:web:454cac0dac12534359c955",
  measurementId: "G-Z8Q5X0RPYJ"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
