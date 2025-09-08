import {Component, computed, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {DatePipe, JsonPipe} from '@angular/common';
import {Button} from 'primeng/button';
import {BibleReadingSchedule} from '../../data/br.schedule.data';
import {BibleReadingCard} from './bible-reading-card/bible-reading-card';

@Component({
  selector: 'app-bible-reading',
  imports: [
    Card,
    DatePipe,
    Button,
    JsonPipe,
    BibleReadingCard
  ],
  templateUrl: './bible-reading.html',
  styleUrl: './bible-reading.scss'
})
export class BibleReading {

  protected bibleReadingEngine = inject(BibleReadingEngine);

  $header = computed(() => {
    const header = 'Bible Reading';
    const current = this.bibleReadingEngine.$currentDate();
    const start = this.bibleReadingEngine.$bibleReadingStartDate()
    if(current <= start) {return `Upcoming ${header}`}
    if(current >= start) {return `${current.toFormat('DD')} | ${header}`}
    return header;
  })
  protected readonly BibleReadingSchedule = BibleReadingSchedule;
}
