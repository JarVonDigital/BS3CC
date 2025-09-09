import { ResolveFn } from '@angular/router';
import {inject} from '@angular/core';
import {BibleReadingEngine} from '../services/bible-reading.engine';

export const bibleReadingResolver: ResolveFn<Promise<boolean>> = async (route, state) => {
  const bibleEngine = inject(BibleReadingEngine);
  await bibleEngine.getBibleBooks();
  await bibleEngine.getSchedules();
  return true;
};
