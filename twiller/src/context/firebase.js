import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCwnv64_RaqWfYjIAu8b1k9S6pWSTS1eGU",
  authDomain: "twiller-e6c0e.firebaseapp.com",
  projectId: "twiller-e6c0e",
  storageBucket: "twiller-e6c0e.appspot.com",
  messagingSenderId: "858786068135",
  appId: "1:858786068135:web:9243cb0705dbd92dcbcd82",
  measurementId: "G-KQXV09RZZJ",
};

const app = initializeApp(firebaseConfig);
export const auth=getAuth(app)
export default app

