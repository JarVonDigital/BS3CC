import {Component, inject, signal} from '@angular/core';
import {Carousel} from 'primeng/carousel';
import {Card} from 'primeng/card';
import {toSignal} from '@angular/core/rxjs-interop';
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {UserEngine} from '../../services/user.engine';
import {Button} from 'primeng/button';
import {DatePipe, JsonPipe} from '@angular/common';
import {GemsEngine} from '../../services/gems.engine';

@Component({
  selector: 'app-gems',
  imports: [
    Carousel,
    Card,
    DatePipe,
    Button,
    JsonPipe,
  ],
  templateUrl: './gems.html',
  styleUrl: './gems.scss'
})
export class Gems {
  protected gemsEngine = inject(GemsEngine);
  protected readonly userEngine = inject(UserEngine);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  items = toSignal(this.bibleReadingEngine.getGems(), {initialValue: []});
  $users = toSignal(this.userEngine.getUsers(), {initialValue: []});
  $gemEditing = signal(false)

  getBook(item: any) {
    return this.bibleReadingEngine.$bibleBooks()
      .find((b) => b.id === item.book);
  }

  async getUser(item: any) {
    return this.$users().find((u) => u.uid === item.userId);
  }
}
