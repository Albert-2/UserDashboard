import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "firebase/auth";
import app from "./firebaseConfig";

const auth = getAuth(app);

// Sign-Up Function
export const signUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Sign-Up Error:", error);
    throw error;
  }
};

// Login Function
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// Logout Function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully.");
  } catch (error) {
    console.error("Logout Error:", error);
    throw error;
  }
};