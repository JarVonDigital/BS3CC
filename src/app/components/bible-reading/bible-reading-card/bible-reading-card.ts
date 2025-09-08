import {Component, inject, input, InputSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {BibleReadingSchedule} from '../../../data/br.schedule.data';
import {ProgressBar} from 'primeng/progressbar';
import {BibleReadingEngine} from '../../../services/bible-reading.engine';
import {DatePipe, JsonPipe} from '@angular/common';
import {AvatarGroup} from 'primeng/avatargroup';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../../services/user.engine';

@Component({
  selector: 'app-bible-reading-card',
  imports: [
    Card,
    ProgressBar,
    DatePipe,
    AvatarGroup,
    Avatar,
    JsonPipe
  ],
  templateUrl: './bible-reading-card.html',
  styleUrl: './bible-reading-card.scss'
})
export class BibleReadingCard {

  $header: InputSignal<any> = input();
  $reading: InputSignal<any> = input.required();

  protected readonly userEngine = inject(UserEngine)
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  protected readonly BibleReadingSchedule = BibleReadingSchedule;
}
