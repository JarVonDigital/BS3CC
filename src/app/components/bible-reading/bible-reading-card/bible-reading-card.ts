import {Component, effect, inject, input, InputSignal, signal, Signal, WritableSignal} from '@angular/core';
import {Card} from 'primeng/card';
import {BibleReadingSchedule} from '../../../data/br.schedule.data';
import {ProgressBar} from 'primeng/progressbar';
import {BibleReadingEngine, BibleReadingProgressObject, BibleReadingRef} from '../../../services/bible-reading.engine';
import {AsyncPipe, DatePipe, JsonPipe} from '@angular/common';
import {AvatarGroup} from 'primeng/avatargroup';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../../services/user.engine';
import {ButtonGroup} from 'primeng/buttongroup';
import {Button} from 'primeng/button';
import {Fluid} from 'primeng/fluid';
import {from} from 'rxjs';
import {toSignal} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-bible-reading-card',
  imports: [
    Card,
    ProgressBar,
    DatePipe,
    AvatarGroup,
    Avatar,
    JsonPipe,
    ButtonGroup,
    Button,
    Button
  ],
  templateUrl: './bible-reading-card.html',
  styleUrl: './bible-reading-card.scss'
})
export class BibleReadingCard {

  $header: InputSignal<any> = input();
  $reading: InputSignal<BibleReadingRef> = input.required();

  protected readonly userEngine = inject(UserEngine)
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  protected readonly BibleReadingSchedule = BibleReadingSchedule;
  protected readonly Math = Math;

  $progress: WritableSignal<BibleReadingProgressObject | null | undefined> = signal(null);
  eff = effect(() => {
    this.userEngine.isUserSignedIn();
    this.bibleReadingEngine.getProgress(this.$reading().scheduleId, 0, this.$reading().day)
      .subscribe(p => {
        this.$progress.set(p);
      })
  })

}
