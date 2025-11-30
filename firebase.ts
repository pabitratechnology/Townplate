
// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
import * as analytics from "firebase/analytics";
import { getAuth, updateProfile } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEOVKjbTZWZpLUhxEnLtC2oSBs6tnHK0s",
  authDomain: "pabitra-marketplace.firebaseapp.com",
  projectId: "pabitra-marketplace",
  storageBucket: "pabitra-marketplace.appspot.com",
  messagingSenderId: "7273052284",
  appId: "1:7273052284:web:409339e9a6d16ac88171f9",
  measurementId: "G-3BBZZWH2J4"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const analyticsInstance = analytics.getAnalytics(app);
const auth = getAuth(app);

export { app, analyticsInstance as analytics, auth, updateProfile };