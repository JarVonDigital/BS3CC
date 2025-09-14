import {
  computed,
  effect,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext, signal,
  Signal,
} from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence, user, signOut, User,
  updateProfile, updateEmail
} from '@angular/fire/auth';
import {catchError, concat, from, interval, map, Observable, of, switchMap, timestamp} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  getDoc,
  getDocs, query,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import {getDownloadURL, getStorage, ref, uploadBytes} from '@angular/fire/storage';
import {DialogService} from 'primeng/dynamicdialog';
import {Settings} from '../components/user/settings/settings';
import {DateTime} from 'luxon';
import {SwUpdate} from '@angular/service-worker';
import {ConfirmationService} from 'primeng/api';

export interface UserLoginForm {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserEngine {

  auth = inject(Auth)
  firestore = inject(Firestore)
  injector = inject(EnvironmentInjector);
  dialogService = inject(DialogService)
  confirmService = inject(ConfirmationService)
  swUpdate = inject(SwUpdate);

  $drawerToggle = signal(false);

  userCollection = collection(this.firestore, 'users');
  $refreshUser = signal(false);
  $userDocRef = computed(() => doc(this.userCollection, this.$signedInUser()?.uid))

  $signedInUser: Signal<User | null | undefined> = toSignal(from(user(this.auth)));
  $userEffect = effect(async () => {
    await this.setOnline(this.$signedInUser()!)
    await this.startHeartbeat(this.$signedInUser()!)
  })


  $user = computed(async () => {
    return await runInInjectionContext(this.injector, async () => {
      this.$refreshUser(); // Register
      if (!this.$signedInUser()) return null;
      const signedInUserDbDetails = await getDoc(this.$userDocRef());
      return ({
        ...this.$signedInUser()?.toJSON(),
        ...signedInUserDbDetails.data()
      })
    })
  })

  // RxJS stream that emits every 30s (adjust to taste)
  private cutoff$ = interval(30000).pipe(
    map(() => DateTime.now().minus({minute: 1}).toISO()) // 2 min cutoff
  );

  private runner = (cutoff: any) => {
    if (!this.$signedInUser()) return of([]);
    return runInInjectionContext(this.injector, () => {
      return collectionData(query(this.userCollection))
        .pipe(
          map((users) => {
            return users.filter((user: any) => {
              if (!user.lastActive) return false;
              const lastActive = DateTime.fromISO(user.lastActive);
              const lastCutoff = DateTime.fromISO(cutoff);
              return lastActive.toMillis() > lastCutoff.toMillis();
            });
          })
        );
    })
  }

  $activeUsers = toSignal(
    from(this.fetchInitial()).pipe(
      switchMap((def) => concat(
        from(this.fetchInitial()),
        this.cutoff$.pipe(
          switchMap(
            (cutoff) => this.runner(cutoff)
          )
        )
      ))
    ),
    {initialValue: []}
  );

  // Optional: computed signal for just usernames
  $activeUids = computed(() => this.$activeUsers().map((u: any) => u.uid));

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
    await runInInjectionContext(this.injector, async () => {
      const user = this.$signedInUser();
      if (!user) return;
      const docData = await getDoc(this.$userDocRef());
      if (!docData.exists()) {
        await setDoc(this.$userDocRef(), {
          uid: user.uid,
          photoURL: user.photoURL,
          firstName: '',
          lastName: '',
          middleName: '',
        })
      }
    })
  })

  /**
   * Fetches the initial set of user data based on a specific cutoff time.
   * Filters out users who were last active before the cutoff.
   *
   * @return {Promise<Array<Object>>} A promise that resolves to an array of user data objects for users who were active after the cutoff time.
   */
  private async fetchInitial(): Promise<Array<object>> {
    if (!this.$signedInUser()) return [] as Array<object>;
    return runInInjectionContext(this.injector, async () => {
      const cutoff = DateTime.utc().minus({minutes: 1}).toISO();
      const snap = await getDocs(query(this.userCollection));
      return snap.docs.filter((user: any) => {
        if (!user.data().lastActive) return false;
        const lastActive = DateTime.fromISO(user.data().lastActive);
        const lastCutoff = DateTime.fromISO(cutoff);
        return lastActive.toMillis() > lastCutoff.toMillis();
      }).map((user: any) => user.data());
    })
  }

  private async setOnline(user: User) {
    await runInInjectionContext(this.injector, async () => {
      if (!user) return;
      await updateDoc(this.$userDocRef(), {
        isOnline: true,
        lastActive: DateTime.utc().toISO()
      });
    })

  }

  async setOffline(user: User) {
    await runInInjectionContext(this.injector, async () => {
      await updateDoc(this.$userDocRef(), {
        isOnline: false,
        lastActive: DateTime.utc().toISO()
      });
    })

  }

  /**
   * Starts a heartbeat mechanism that periodically updates the user's last active timestamp in the database.
   *
   * @param {User} user - The user object associated with the heartbeat functionality.
   * @return {Promise<void>} A promise that resolves when the heartbeat mechanism is started successfully.
   */
  async startHeartbeat(user: User): Promise<void> {
    setInterval(() => {
      runInInjectionContext(this.injector, async () => {
        await updateDoc(this.$userDocRef(), {
          lastActive: DateTime.utc().toISO()
        });
      })
    }, 60000); // every 60s
  }

  openSettingsDialog() {
    this.dialogService.open(Settings, {
      appendTo: 'body',
      header: 'Settings',
      closable: true,
      modal: true,
      style: {
        width: '90vw'
      }
    })
  }

  getUsers(): Observable<User[]> {
    return runInInjectionContext(this.injector, () => {
      return collectionData(this.userCollection, {idField: 'id'}) as Observable<User[]>
    })
      .pipe(catchError((err) => {
        console.log(err)
        return of([] as User[])
      }))

  }

  async uploadImage(file: Blob | File, path: string): Promise<string> {
    const storageRef = ref(getStorage(), path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef); // return public URL
  }

  /**
   * Authenticates a user using email and password credentials.
   *
   * @param {Object} param - An object containing user login information.
   * @param {string} param.email - The email address of the user.
   * @param {string} param.password - The password of the user.
   * @return {Promise<void>} A promise that resolves when authentication is successful or logs an error if it fails.
   */
  async loginWithEmailAndPassword({email, password}: UserLoginForm): Promise<void> {
    await setPersistence(this.auth, browserLocalPersistence);
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async onLogout() {
    await runInInjectionContext(this.injector, async () => {
      await this.setOffline(this.$signedInUser()!)
      await signOut(this.auth)
    })
  }

  /**
   * Updates the profile photo for the currently authenticated user.
   *
   * @param {Object} param - An object containing the parameters for updating the profile photo.
   * @param {string} param.photoURL - The URL of the new profile photo.
   * @return {Promise<void>} A promise that resolves when the profile photo has been successfully updated.
   */
  async updateProfilePhoto(param: { photoURL: string }): Promise<void> {
    if (!this.auth.currentUser) return;
    await updateProfile(this.auth.currentUser!, param);
    await updateDoc(this.$userDocRef(), param)
  }

  /**
   * Updates the currently authenticated user with the provided user information.
   *
   * @param {Object} user - The new user data to update. Must contain the updated details such as email and profile information.
   * @return {Promise<void>} A promise that resolves when the user update is successfully completed.
   */
  async updateUser(user: any): Promise<void> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) return;

    await updateProfile(currentUser, user);
    await updateEmail(currentUser, user.email);
    await updateDoc(this.$userDocRef(), user);
    this.$refreshUser.update((val) => !val);
  }

  /**
   * Checks for updates to the application and provides a confirmation dialog
   * to the user regarding the availability of updates.
   * If an update is available and accepted, the application will activate the update
   * and reload the page.
   *
   * @return {Promise<void>} A promise that resolves when the update check and any related actions are completed.
   */
  async checkForUpdates() {

    // TODO: Add more logic to this
    const update = this.swUpdate.isEnabled ? (await this.swUpdate.checkForUpdate()) : false;
    this.confirmService.confirm({
      message: update ? 'New version available' : 'No new version available',
      header: 'Update',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: update ? 'Update' : "Close",
      rejectLabel: 'Later',
      rejectVisible: update,
      accept: async () => {
        await this.swUpdate.activateUpdate();
        document.location.reload();
      }
    });
  }
}
