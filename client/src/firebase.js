// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAhEOszosi6pkyZV7owv4v9_Ir69H3nDqY",
  authDomain: "syncflix-videoplayer.firebaseapp.com",
  projectId: "syncflix-videoplayer",
  storageBucket: "syncflix-videoplayer.appspot.com",
  messagingSenderId: "229849605226",
  appId: "1:229849605226:web:df0a6d49e2652370cbd613",
  measurementId: "G-EN2BD4FQNE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;