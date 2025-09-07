import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {BibleReadingEngine} from './services/bible-reading.engine';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('BS3CC');
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);

  menuItems: MenuItem[] = [
    {icon: 'pi pi-book', label: 'Bible Reading Schedule', routerLink: ['/']},
  ]
}
