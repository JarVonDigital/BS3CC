import {computed, Injectable, signal} from '@angular/core';
import {DateTime} from 'luxon';
import {BibleReadingSchedule} from '../data/br.schedule.data';

@Injectable({
  providedIn: 'root'
})
export class BibleReadingEngine {

  $currentDate = signal(DateTime.now());
  $bibleReadingStartDate = signal(DateTime.fromISO('2025-09-08'));

  $bibleReadingSchedule = computed(() => {
    return BibleReadingSchedule.readings.map(r => ({
      ...r,
      date: this.$bibleReadingStartDate().plus({days: (r.day - 1)})
    }))
  })

  $currentReading = computed(() => {
    const daysFromStart = DateTime.now().diff(this.$bibleReadingStartDate()).toObject().days;
    if(this.$currentDate() < this.$bibleReadingStartDate()) { return this.$bibleReadingSchedule()[0]}
    return this.$bibleReadingSchedule().find(r => r.day === daysFromStart)
  })

  $weeklyReadingSchedule = computed(() => {
    if(this.$currentDate() > this.$bibleReadingStartDate()) {
      return this.$bibleReadingSchedule().filter(r => r.day <= 7)
    }
    return this.$bibleReadingSchedule().filter(r => r.date >= this.$currentDate() && r.date <= this.$currentDate().plus({days: 7}))
  })

  constructor() {
    setInterval(() => {
      this.$currentDate.set(DateTime.now());
    }, 100);
  }
}
