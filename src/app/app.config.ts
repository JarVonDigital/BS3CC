import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {provideAnimations} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {LogLevel, setLogLevel} from '@angular/fire';
import {getStorage, provideStorage} from '@angular/fire/storage';
import {DialogService} from 'primeng/dynamicdialog';
import { provideServiceWorker } from '@angular/service-worker';
import {MyTheme} from './theme/theme';
import {ConfirmationService} from 'primeng/api';

setLogLevel(LogLevel.VERBOSE);

export const appConfig: ApplicationConfig = {
  providers: [
    DialogService,
    ConfirmationService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    providePrimeNG({
      theme: {
        preset: MyTheme,
        options: {
          darkModeSelector: false,
        }
      }
    }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};
