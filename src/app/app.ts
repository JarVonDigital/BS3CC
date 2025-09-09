import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {BibleReadingEngine} from './services/bible-reading.engine';
import {DatePipe} from '@angular/common';
import {Navigation} from './components/navigation/navigation';
import {Footer} from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, DatePipe, Navigation, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BS3CC');
}
