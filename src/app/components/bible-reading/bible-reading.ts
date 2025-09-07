import {Component, computed, inject} from '@angular/core';
import {Card} from 'primeng/card';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {DatePipe} from '@angular/common';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-bible-reading',
  imports: [
    Card,
    DatePipe,
    Button
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
    if(current >= start) {return `$${current} | ${header}`}
    return header;
  })
}
