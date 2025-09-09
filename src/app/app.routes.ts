import { Routes } from '@angular/router';
import {BibleReading} from './components/bible-reading/bible-reading';
import {bibleReadingResolver} from './resolvers/bible-reading-resolver';

export const routes: Routes = [
  {
    title: "BS3CC | Create, organize, and stay consistent with your spiritual goals",
    path: '',
    component: BibleReading,
    resolve: {bibleReading: bibleReadingResolver}
  }
];
