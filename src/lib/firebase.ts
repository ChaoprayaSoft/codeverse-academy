import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCNMpcfZJUSQpHGIvqVc0QE2lCjP-i2fg0",
  authDomain: "codeverse-1a8ec.firebaseapp.com",
  projectId: "codeverse-1a8ec",
  storageBucket: "codeverse-1a8ec.firebasestorage.app",
  messagingSenderId: "722458959167",
  appId: "1:722458959167:web:04381efd7a05b99eaac78a",
  measurementId: "G-74N5JK9DZQ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
