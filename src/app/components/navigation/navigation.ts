import {Component, inject, signal} from '@angular/core';
import {DatePipe} from "@angular/common";
import {Menubar} from "primeng/menubar";
import {BibleReadingEngine} from '../../services/bible-reading.engine';
import {MegaMenuItem, MenuItem} from 'primeng/api';
import {UserEngine} from '../../services/user.engine';
import {Avatar} from 'primeng/avatar';
import {Button} from 'primeng/button';
import {Popover} from 'primeng/popover';
import {Login} from '../login/login';
import {Drawer} from 'primeng/drawer';
import {MegaMenu} from 'primeng/megamenu';
import {Fluid} from 'primeng/fluid';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {Menu} from './menu/menu';

@Component({
  selector: 'app-navigation',
  imports: [
    DatePipe,
    Menubar,
    Avatar,
    Button,
    Popover,
    Login,
    Drawer,
    MegaMenu,
    Fluid,
    RouterLink,
    RouterLinkActive,
    Menu
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  protected readonly userEngine = inject(UserEngine);
  protected readonly bibleReadingEngine = inject(BibleReadingEngine);

  toggleMenu() {
    this.userEngine.$drawerToggle.update(prev => !prev);
  }
}
