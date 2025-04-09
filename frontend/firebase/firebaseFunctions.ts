import { auth } from "./firebaseApp";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  OAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

export async function signIn(email: string, password: string): Promise<void> {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in successfully");
  } catch (error: any) {
    console.error("Error signing in:", error.message);
    throw new Error(error.message);
  }
}

export async function signUp(email: string, password: string): Promise<void> {
  try {
    console.log("Signing up with:", email, password);
    console.log("Auth instance:", auth);
    await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up successfully");
  } catch (error: any) {
    console.error("Error signing up:", error.message);
    throw new Error(error.message);
  }
}

export async function signInWithApple(): Promise<void> {
  try {
    const provider = new OAuthProvider("apple.com");
    provider.addScope("email");
    provider.addScope("name");
    await signInWithPopup(auth, provider);
  } catch (error: any) {
    console.error("Error signing in with Apple:", error.message);
    throw new Error(error.message);
  }
}

export async function signInWithGoogle(): Promise<void> {
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (error: any) {
    console.error("Error signing in with Google:", error.message);
    throw new Error(error.message);
  }
}
