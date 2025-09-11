import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import 'zone.js';
import {register} from 'swiper/element';

register();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
