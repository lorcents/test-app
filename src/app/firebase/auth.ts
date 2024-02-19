import firebase_app from "./config"
import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword, updateProfile } from "firebase/auth";

const auth = getAuth(firebase_app);


async function signUp(email: string, password: string, displayName: string,gender:string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // Set the user's display name and photoURL (profile picture)
      await updateProfile(userCredential.user, {
        displayName: displayName,
        photoURL: `https://avatar.iran.liara.run/public/${gender}`,
      });
  
      return { user: userCredential.user, error: null };
    } catch (error:any) {
      throw new Error(error.message)
    }
  }

async function signIn(email:string, password :string) {
    let result = null,
        error = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
        return result;
    } catch (error:any) {
        throw new Error(error.message)
    }
}

export {signIn,signUp,auth}