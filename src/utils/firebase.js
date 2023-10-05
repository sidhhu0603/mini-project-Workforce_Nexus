import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// const {
//   initializeAppCheck,
//   ReCaptchaV3Provider,
// } = require("firebase/app-check");

const firebaseConfig = {
  apiKey: "AIzaSyCoCpgoXcxItAve9MJ5oTnnKfrTSIxXxWc",
  authDomain: "sem5-hrms.firebaseapp.com",
  projectId: "sem5-hrms",
  storageBucket: "sem5-hrms.appspot.com",
  messagingSenderId: "334753844354",
  appId: "1:334753844354:web:280169a863a7daf3a2389b"
};
// Initialize Firebase

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// const appCheck = initializeAppCheck(app, {
//   // FIREBASE_APPCHECK_DEBUG_TOKEN: true,
//   provider: new ReCaptchaV3Provider(
//     process.env.REACT_APP_FIREBASE_APP_CHECK_TOKEN
//   ),
//   isTokenAutoRefreshEnabled: true,
// });

export { db, auth, rtdb };
