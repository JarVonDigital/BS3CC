import {Component, inject, input} from '@angular/core';
import {Card} from 'primeng/card';
import {GemsEngine} from '../../../services/gems.engine';
import {UserEngine} from '../../../services/user.engine';
import {BibleReadingEngine} from '../../../services/bible-reading.engine';
import {Button} from 'primeng/button';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-gem-card',
  imports: [
    Card,
    Button,
    DatePipe
  ],
  templateUrl: './gem-card.html',
  styleUrl: './gem-card.scss'
})
export class GemCard {

  item = input.required<any>()

  protected gemsEngine = inject(GemsEngine);
  protected readonly userEngine = inject(UserEngine);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);

  getBook(item: any) {
    return this.bibleReadingEngine.$bibleBooks()
      .find((b) => b.id === item.book);
  }
}
