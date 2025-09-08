import {computed, effect, inject, Injectable, signal, WritableSignal} from '@angular/core';
import {DateTime} from 'luxon';
import {BibleReadingSchedule} from '../data/br.schedule.data';
import {collection, doc, Firestore, getDocs, orderBy, query, setDoc} from '@angular/fire/firestore';
import {UserEngine} from './user.engine';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {from} from 'rxjs';

export interface BibleReadingProgressObject {
  userId: string;
  scheduleId: string;
  groupId: number;
  progress: "UNFINISHED" | "IN_PROGRESS" | "FINISHED";
}

export interface BibleBooks {
  abbr: string
  chapters: number
  id: number
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class BibleReadingEngine {

   user = inject(UserEngine)
   firestore = inject(Firestore);

  $currentDate = signal(DateTime.now());
  $bibleReadingStartDate = signal(DateTime.fromISO('2025-09-08').startOf('day'));

  $bibleBooks: WritableSignal<BibleBooks[]> = signal([] as BibleBooks[]);

  bb = effect(() => console.log(this.$bibleBooks()))

  $bibleReadingSchedule = computed(() => {
    return BibleReadingSchedule.readings.map(r => ({
      ...r,
      date: this.$bibleReadingStartDate().plus({days: (r.day - 1)})
    }))
  })

  $currentReading = computed(() => {
    const daysFromStart = DateTime.now().diff(this.$bibleReadingStartDate()).toObject().days ?? 0;
    if(this.$currentDate() <= this.$bibleReadingStartDate()) { return this.$bibleReadingSchedule()[0]}
    return this.$bibleReadingSchedule().find(r => r.day === (daysFromStart + 1))
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

    this.getBibleBooks();
  }

  public async addDefaultSchedule() {

    try {

      if(!this.user.$isLoggedIn()) return;

      for(let book of BibleReadingSchedule.books) {
        let documentReference = doc(this.firestore, 'bible-books', book.id.toString());
        await setDoc(documentReference, book)
      }

    } catch (e) {
      console.log(e)
    }

  }

  async getBibleBooks() {
    let collect = collection(this.firestore, 'bible-books');
    let q = query(collect, orderBy('id', 'asc'))
    let data = await getDocs(q);
    this.$bibleBooks.set(data?.docs.flatMap(d => d.data()) as BibleBooks[] ?? [] as BibleBooks[])
  }

  // async getProgressByGroupId(groupId: 0) {
  //   const ref = collection(this.firestore, "bible-reading-progress");
  //   return ((await getDocs(ref)).docs as unknown as BibleReadingProgressObject[]).filter(p => p.groupId === groupId);
  // }

  /**
   * Constructs a Bible reading link URL based on the given reading object.
   *
   * @param {Object} reading - An object containing details of the Bible reading.
   * @param {string} reading.bookId - The ID of the book in the Bible.
   * @param {number} reading.fromChapter - The chapter number for the reading.
   * @return {string} The constructed URL for the specified Bible reading.
   */
  bibleReadingLinkURL(reading: any): string {
    const bookId = reading.bookId;
    const chapter = reading.fromChapter;
    return `https://wol.jw.org/en/wol/b/r1/lp-e/nwtsty/${bookId}/${chapter}`;
  }
}
