import {effect, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence, user, signOut, User
} from '@angular/fire/auth';

export interface UserLoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserEngine {

  private auth = inject(Auth)
  $isLoggedIn: WritableSignal<User | undefined | null> = signal(null);

  constructor() {
    user(this.auth).subscribe(u => {
      console.log(u)
      this.$isLoggedIn.set(u)
    })
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
