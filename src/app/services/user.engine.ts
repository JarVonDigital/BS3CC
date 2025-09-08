import {effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence, user, signOut, User
} from '@angular/fire/auth';
import {firstValueFrom, from, map} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {addDoc, collection, doc, Firestore, getDoc, getDocs, setDoc} from '@angular/fire/firestore';

export interface UserLoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserEngine {

  auth = inject(Auth)
  firestore = inject(Firestore)
  userCollection = collection(this.firestore, 'users');
  $signedInUser: Signal<User | null | undefined> = toSignal(from(user(this.auth)));

  /**
   * Effect function to update the user database with the signed-in user's information.
   *
   * This function checks if a user is signed in and fetches the user's document
   * reference in the `userCollection`. If the user's document does not exist in the
   * database, the function creates a new document with the user's details, including
   * UID, email, display name, photo URL, email verification status, account creation time,
   * and last login time.
   *
   * The function performs the following:
   * - Verifies if a user is signed in.
   * - Retrieves the document reference for the signed-in user from the `userCollection`.
   * - Checks if the user's document exists in the database.
   * - Creates a new document with the user's details if it does not exist.
   *
   * This operation is asynchronous.
   */
  updateUserDB = effect(async () => {
    const user = this.$signedInUser();
    if(!user) return;

    const docRef = doc(this.userCollection, user.uid);
    const docData = await getDoc(docRef);
    if(!docData.exists()) {
      await setDoc(docRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        lastLogin: user.metadata.lastSignInTime
      })
    }
  })

  async getUsers(): Promise<User[]> {
    let data = await getDocs(this.userCollection)
    return data.docs.map(d => d.data() as User)
  }

  async loginWithEmailAndPassword({email, password}: UserLoginForm) {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (loginError) {
      console.log(loginError)
    }
  }

  async onLogout() {
    await signOut(this.auth)
  }
}
