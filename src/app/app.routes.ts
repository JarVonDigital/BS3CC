import { Routes } from '@angular/router';
import {BibleReading} from './components/bible-reading/bible-reading';
import {bibleReadingResolver} from './resolvers/bible-reading-resolver';
import {CommunityGems} from './components/community-gems/community-gems';
import {ScheduleCreator} from './components/schedule/schedule-creator/schedule-creator';
import {Settings} from './components/user/settings/settings';

export const routes: Routes = [
  {
    title: "BS3CC | Create, organize, and stay consistent with your spiritual goals",
    path: '',
    component: BibleReading,
    resolve: {bibleReading: bibleReadingResolver}
  },
  {
    title: "BS3CC | Community Gems",
    path: 'gems',
    component: CommunityGems,
    resolve: {bibleReading: bibleReadingResolver}
  },
  {
    title: "BS3CC | Schedule Creator",
    path: 'schedule',
    component: ScheduleCreator,
    resolve: {bibleReading: bibleReadingResolver}
  },
  {
    title: "BS3CC | Settings",
    path: 'settings',
    component: Settings,
  }
];
