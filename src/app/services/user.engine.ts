import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  UserCredential,
  setPersistence,
  browserLocalPersistence, user, signOut
} from '@angular/fire/auth';
import {toSignal} from '@angular/core/rxjs-interop';

export interface UserLoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserEngine {

  private auth = inject(Auth)

  $isLoggedIn = toSignal(user(this.auth));
  $loggedInUser: WritableSignal<UserCredential | null> = signal(null);

  constructor() {

  }

  async loginWithEmailAndPassword({email, password}: UserLoginForm) {
    try {
      await setPersistence(this.auth, browserLocalPersistence);
      const login = await signInWithEmailAndPassword(this.auth, email, password);
      this.$loggedInUser.set(login)

    } catch (loginError) {
      this.$loggedInUser.set(null)
    }

  }

  async onLogout() {
    await signOut(this.auth)
  }
}
