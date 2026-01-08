import { signInAnonymously } from "firebase/auth";
import { auth } from "./config";

export const anonymousLogin = async () => {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
};
