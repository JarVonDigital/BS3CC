import {Component, inject, input} from '@angular/core';
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
  drawerRef = input.required<Drawer>()
  userEngine = inject(UserEngine)
  menuItems: MegaMenuItem[] = [
    {
      icon: 'pi pi-book',
      label: 'Bible Reading Schedule',
      routerLink: ['/'],
      routerLinkActiveOptions: {exact: true}
    },
    {
      icon: 'pi pi-trophy',
      label: 'Community Gems',
      routerLink: ['/gems'],
      routerLinkActiveOptions: {exact: true}
    }
  ]
}
