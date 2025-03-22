// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxutHuHjPqnR3e3mIQBWatxOq_DmIav54",
  authDomain: "applywise-ead81.firebaseapp.com",
  projectId: "applywise-ead81",
  storageBucket: "applywise-ead81.firebasestorage.app",
  messagingSenderId: "698929729983",
  appId: "1:698929729983:web:c1b44ae980e63200fa910a",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
