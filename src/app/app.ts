import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {Navigation} from './components/navigation/navigation';
import {Footer} from './components/footer/footer';
import {filter} from 'rxjs';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, DatePipe, Navigation, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private swUpdate = inject(SwUpdate);

  constructor() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          if(window.confirm('New version available. Reload?')) {
            this.reload();
          }
        });
    }
  }

  reload() {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
