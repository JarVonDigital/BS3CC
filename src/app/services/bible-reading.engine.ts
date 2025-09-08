import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {DateTime} from 'luxon';
import {BibleReadingSchedule} from '../data/br.schedule.data';
import {
  addDoc,
  collection,
  doc, docData,
  Firestore,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {UserEngine} from './user.engine';
import {from, map, Observable, of, switchMap} from 'rxjs';
import {BibleReading} from '../components/bible-reading/bible-reading';

export interface BibleReadingProgressObject {
  userId: string;
  scheduleId: number;
  groupId: number;
  day: number;
  progress: "PREPARING" | "READING" | "COMPLETE";
  readingStarted: string;
  readingCompleted: string;
}

export interface BibleBooks {
  abbr: string
  chapters: number
  id: number
  name: string
}

export interface BibleReadingRef {
  day: number
  date: DateTime
  scheduleId: number
  readings: {
    bookId: number
    fromChapter: number
    toChapter: number
  }[]
}

export interface BibleReadingScheduleRef {
  scheduleId: number,
  schedule: BibleReadingRef[]
}

@Injectable({
  providedIn: 'root'
})
export class BibleReadingEngine {

  user = inject(UserEngine)
  firestore = inject(Firestore);

  private bibleReadingSchedules = collection(this.firestore, 'bible-reading-schedules')
  private bibleBooksCollection = collection(this.firestore, 'bible-books');
  private bibleReadingProgress = collection(this.firestore, 'progress');

  $currentDate = signal(DateTime.now());
  $bibleReadingStartDate = signal(DateTime.fromISO('2025-09-08').startOf('day'));

  $bibleBooks: WritableSignal<BibleBooks[]> = signal([] as BibleBooks[]);

  bb = effect(() => console.log(this.$bibleBooks()))

  $bibleReadingSchedules: WritableSignal<BibleReadingScheduleRef[]> = signal([]);
  $bibleReadingSchedule: Signal<BibleReadingRef[]> = computed(() => {
    if(!this.$bibleReadingSchedules()) return [] as BibleReadingRef[];
    const schId = 0;
    return (this.$bibleReadingSchedules().find(s => s.scheduleId === schId)?.schedule ?? [])
      .map(r => ({
        ...r,
        date: this.$bibleReadingStartDate().plus({days: (r.day - 1)}),
        scheduleId: schId
      })) ?? [] as BibleReadingRef[]
  })

  $currentReading = computed(() => {
    const daysFromStart = DateTime.now().diff(this.$bibleReadingStartDate()).toObject().days ?? 0;
    if (this.$currentDate() <= this.$bibleReadingStartDate()) {
      return this.$bibleReadingSchedule()[0]
    }
    return this.$bibleReadingSchedule().find(r => r.day === (daysFromStart + 1))
  })

  $weeklyReadingSchedule = computed(() => {
    if (this.$currentDate() > this.$bibleReadingStartDate()) {
      return this.$bibleReadingSchedule().filter(r => r.day <= 7)
    }
    return this.$bibleReadingSchedule().filter(r => r?.date >= this.$currentDate() && r.date <= this.$currentDate().plus({days: 7}))
  })

  constructor() {
    setInterval(() => {
      this.$currentDate.set(DateTime.now());
    }, 100);

    this.getBibleBooks();
    this.getSchedules()
  }

  private async updateSchedule() {
      let d = doc(this.bibleReadingSchedules, '0')
      await setDoc(d, {
        scheduleId: 0,
        schedule: BibleReadingSchedule.readings
      })
  }

  private async getSchedules() {
    let docs = await getDocs(this.bibleReadingSchedules)
    if(!docs.empty) {
      this.$bibleReadingSchedules.set(docs.docs.map(d => d.data() as BibleReadingScheduleRef))
    }
  }

  async getBibleBooks() {
    let q = query(this.bibleBooksCollection, orderBy('id', 'asc'))
    let data = await getDocs(q);
    this.$bibleBooks.set(data?.docs.flatMap(d => d.data()) as BibleBooks[] ?? [] as BibleBooks[])
  }

  getProgress(scheduleId: number, groupId: number, day: number) {
    const q = query(
      this.bibleReadingProgress,
      where('scheduleId', '==', scheduleId),
      where('groupId', '==', groupId),
      where('userId', '==', this.user.$signedInUser()?.uid ?? ''),
      where('day', '==', day)
    )

    return from(getDocs(q)).pipe(
      switchMap((docs) => {
        if (docs.empty) {
          return of({
            progress: "PREPARING",
            readingStarted: "",
            readingCompleted: ""
          } as BibleReadingProgressObject);
        }
        return docData(docs.docs[0].ref) as Observable<BibleReadingProgressObject>;
      })
    );
  }

  async updateProgress(scheduleId: number, groupId: number, day: number, progress: "PREPARING" | "READING" | "COMPLETE") {
    const q = query(
      this.bibleReadingProgress,
      where('scheduleId', '==', scheduleId),
      where('groupId', '==', groupId),
      where('day', '==', day)
    )
    const docs = await getDocs(q);

    if (docs.empty) {
      if (this.user.$signedInUser()?.uid) {
        const progObj: BibleReadingProgressObject = {
          userId: this.user.$signedInUser()!.uid,
          groupId,
          scheduleId,
          progress,
          day,
          readingCompleted: progress === "COMPLETE" ? DateTime.now().toISO() : "",
          readingStarted: progress === "READING" ? DateTime.now().toISO() : ""
        }

        await addDoc(this.bibleReadingProgress, progObj);
        return;
      }
    }

    let doc = docs.docs[0]
    let docData = doc.data() as BibleReadingProgressObject
    await setDoc(doc.ref, {
      ...docData,
      day,
      progress,
      readingCompleted: progress === "COMPLETE" ? DateTime.now().toISO() : docData.readingCompleted,
      readingStarted: progress === "READING" ? DateTime.now().toISO() : docData.readingStarted
    })
    return;
  }

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
