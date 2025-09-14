import {Component, effect, inject, input, InputSignal, signal} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MegaMenuItem} from 'primeng/api';
import {Drawer} from 'primeng/drawer';
import {UserEngine} from '../../../services/user.engine';

@Component({
  selector: 'app-menu',
  imports: [
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  $orientation = input<'horizontal' | 'vertical'>('vertical')
  $orientationEffect = effect(() => {
    this.menuItems.set([
      {
        icon: 'pi pi-book',
        label: this.orient('Bible Reading Schedule', 'Reading'),
        routerLink: ['/'],
        routerLinkActiveOptions: {exact: true}
      },
      {
        icon: 'pi pi-trophy',
        label: this.orient('Community Gems', 'Gems'),
        routerLink: ['/gems'],
        routerLinkActiveOptions: {exact: true}
      },
      {
        icon: 'pi pi-calendar-plus',
        label: this.orient('Schedule Creator', 'Schedule'),
        routerLink: ['/schedule'],
        routerLinkActiveOptions: {exact: true}
      },
      {
        icon: 'pi pi-cog',
        label: this.orient('Settings', 'Settings'),
        command: () => this.userEngine.openSettingsDialog(),
        routerLinkActiveOptions: {exact: true}
      }
    ])
  })
  userEngine = inject(UserEngine)
  menuItems = signal([] as MegaMenuItem[])

  orient(vertical: any, horizontal: any) {
    return this.$orientation() === 'vertical' ? vertical : horizontal;
  }
}
