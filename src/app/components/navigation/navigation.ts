import {Component, inject} from '@angular/core';
import {DatePipe} from "@angular/common";
import {Menubar} from "primeng/menubar";
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {MenuItem} from 'primeng/api';
import {UserEngine} from '../../services/user.engine';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {Popover} from 'primeng/popover';
import {Login} from '../login/login';

@Component({
  selector: 'app-navigation',
  imports: [
    DatePipe,
    Menubar,
    Avatar,
    Button,
    Popover,
    Login
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  protected readonly userEngine = inject(UserEngine);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);
  menuItems: MenuItem[] = [
    {icon: 'pi pi-book', label: 'Bible Reading Schedule', routerLink: ['/']},
  ]
}
