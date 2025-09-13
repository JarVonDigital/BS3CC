import { Component } from '@angular/core';
import {ScheduleCreator} from './schedule-creator/schedule-creator';

@Component({
  selector: 'app-schedule',
  imports: [
    ScheduleCreator
  ],
  templateUrl: './schedule.html',
  styleUrl: './schedule.scss'
})
export class Schedule {

}
