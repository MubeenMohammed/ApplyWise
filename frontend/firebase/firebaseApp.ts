// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI98ewqp542ldRfpOJ5uuTl6_XU2YPDz0",
  authDomain: "comp250-webtool.firebaseapp.com",
  projectId: "comp250-webtool",
  storageBucket: "comp250-webtool.firebasestorage.app",
  messagingSenderId: "239255805361",
  appId: "1:239255805361:web:32d66bffa1a9d905d03190",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
