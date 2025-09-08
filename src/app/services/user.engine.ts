import {effect, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence, user, signOut, User
} from '@angular/fire/auth';
import {firstValueFrom, from} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

export interface UserLoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserEngine {

  auth = inject(Auth)
  $signedInUser = toSignal(from(user(this.auth)), {initialValue: null});

  isUserSignedIn() {
    return user(this.auth)
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
