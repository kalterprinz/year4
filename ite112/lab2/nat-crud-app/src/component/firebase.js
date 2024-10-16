import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMNpls10smRN2ih4Pnp6hTQRA-paPgsJ4",
  authDomain: "lab2-717e1.firebaseapp.com",
  projectId: "lab2-717e1",
  storageBucket: "lab2-717e1.appspot.com",
  messagingSenderId: "284994751699",
  appId: "1:284994751699:web:edde1a05ab8e73ab609826",
  measurementId: "G-YC1RX2QKB0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db };