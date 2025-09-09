import {
  computed,
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
  Signal,
  signal,
  WritableSignal
} from '@angular/core';
import {DateTime} from 'luxon';
import {BibleReadingSchedule} from '../data/br.schedule.data';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  Firestore,
  getDocs,
  getDocsFromServer,
  orderBy,
  query,
  setDoc,
  where
} from '@angular/fire/firestore';
import {UserEngine} from './user.engine';
import {from, Observable, of, switchMap} from 'rxjs';

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
  reading: {
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
  injector = inject(EnvironmentInjector);

  private bibleReadingSchedules = collection(this.firestore, 'bible-reading-schedules')
  private bibleBooksCollection = collection(this.firestore, 'bible-books');
  private bibleReadingProgress = collection(this.firestore, 'progress');
  private gemsCollection = collection(this.firestore, 'gems');

  $currentDate = signal(DateTime.now());
  $bibleReadingStartDate = signal(DateTime.fromISO('2025-09-08').startOf('day'));

  $bibleBooks: WritableSignal<BibleBooks[]> = signal([] as BibleBooks[]);

  $bibleReadingSchedules: WritableSignal<BibleReadingScheduleRef[]> = signal([]);
  $bibleReadingSchedule: Signal<BibleReadingRef[]> = computed(() => {
    if (!this.$bibleReadingSchedules()) return [] as BibleReadingRef[];
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
    return this.$bibleReadingSchedule().filter(r => r?.date >= this.$currentDate().startOf("week") && r.date <= this.$currentDate().endOf("week"))
  })

  constructor() {
    setInterval(() => {
      this.$currentDate.set(DateTime.now());
    }, 100);
  }

  private async updateSchedule() {
    await runInInjectionContext(this.injector, async () => {
      let d = doc(this.bibleReadingSchedules, '0')
      await setDoc(d, {
        scheduleId: 0,
        schedule: BibleReadingSchedule.readings
      })
    })
  }

  async getSchedules() {
    await runInInjectionContext(this.injector, async () => {
      let docs = await getDocs(this.bibleReadingSchedules)
      if (!docs.empty) {
        this.$bibleReadingSchedules.set(docs.docs.map(d => d.data() as BibleReadingScheduleRef))
      }
    })
  }

  getGems() {
    return runInInjectionContext(this.injector, () => {
      let q = query(
        this.gemsCollection,
        where('groupId', '==', 0),
      )
      return collectionData(q, {idField: 'id'}) as Observable<any[]>;
    })
  }

  async addGem(groupId: number, reading: BibleReadingRef, gem: any) {
    await runInInjectionContext(this.injector, async () => {
      await addDoc(this.gemsCollection, {
        userId: this.user.$signedInUser()?.uid,
        createdAt: DateTime.now().toISO(),
        reading,
        groupId,
        ...gem
      })
    })
  }

  async getBibleBooks() {
    await runInInjectionContext(this.injector, async () => {
      let q = query(this.bibleBooksCollection, orderBy('id', 'asc'))
      let data = await getDocs(q);
      this.$bibleBooks.set(data.docs.map(d => d.data() as BibleBooks))
    })

  }

  getProgress(scheduleId: number, groupId: number, day: number) {
    return runInInjectionContext(this.injector, () => {
      const q = query(
        this.bibleReadingProgress,
        where('scheduleId', '==', scheduleId),
        where('groupId', '==', groupId),
        where('userId', '==', this.user.$signedInUser()?.uid ?? ''),
        where('day', '==', day)
      )

      return from(getDocsFromServer(q)).pipe(
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
    })

  }

  async updateProgress(scheduleId: number, groupId: number, day: number, progress: "PREPARING" | "READING" | "COMPLETE") {
    await runInInjectionContext(this.injector, async () => {
      const q = query(
        this.bibleReadingProgress,
        where('scheduleId', '==', scheduleId),
        where('groupId', '==', groupId),
        where('day', '==', day),
        where('userId', '==', this.user.$signedInUser()?.uid)
      )
      const docs = await getDocs(q);

      if (docs.empty) {
        if (this.user.$signedInUser()?.uid) {
          const progObj: BibleReadingProgressObject = {
            groupId,
            scheduleId,
            progress,
            day,
            userId: this.user.$signedInUser()!.uid,
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
        scheduleId,
        groupId,
        userId: this.user.$signedInUser()?.uid,
        day,
        progress,
        readingCompleted: progress === "COMPLETE" ? DateTime.now().toISO() : docData.readingCompleted,
        readingStarted: progress === "READING" ? DateTime.now().toISO() : docData.readingStarted
      })
      return;
    })
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
