// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBKFS4Ezg8gKK-IsGUrnpqz5iiiFqeIE",
  authDomain: "users-9fe88.firebaseapp.com",
  projectId: "users-9fe88",
  storageBucket: "users-9fe88.appspot.com",
  messagingSenderId: "282767492411",
  appId: "1:282767492411:web:2eab1bae44c096f8a9e31e",
  measurementId: "G-FRE71YKZLD"
};

// Firebase অ্যাপ ইনিশিয়ালাইজ করুন
const app = initializeApp(firebaseConfig);

// Firestore ডাটাবেস ইন্সট্যান্স তৈরি করুন
const db = getFirestore(app);

export default db;
