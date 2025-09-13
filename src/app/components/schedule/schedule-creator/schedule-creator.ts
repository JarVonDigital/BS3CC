import {Component, inject, signal} from '@angular/core';
import {DatePicker} from 'primeng/datepicker';
import {Button} from 'primeng/button';
import {BibleReadingEngine} from '../../../services/bible-reading.engine';
import {FormsModule} from '@angular/forms';
import {InputNumber} from 'primeng/inputnumber';
import {DateTime} from 'luxon';
import {BibleReadingCard} from '../../bible-reading/bible-reading-card/bible-reading-card';
import {Fluid} from 'primeng/fluid';
import {MultiSelect} from 'primeng/multiselect';
import {FloatLabel} from 'primeng/floatlabel';

@Component({
  selector: 'app-schedule-creator',
  imports: [
    DatePicker,
    Button,
    FormsModule,
    InputNumber,
    BibleReadingCard,
    Fluid,
    MultiSelect,
    FloatLabel
  ],
  templateUrl: './schedule-creator.html',
  styleUrl: './schedule-creator.scss'
})
export class ScheduleCreator {
  $startDate = signal(DateTime.now().toJSDate());
  $months = signal<number | null | undefined>(null);
  $linger = signal<number[]>([]);
  $schedule = signal<any[]>([]);
  bibleReadingEngine = inject(BibleReadingEngine)
  protected readonly DateTime = DateTime;
}
