import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Menubar} from 'primeng/menubar';
import {ConfirmationService, MessageService} from 'primeng/api';
import {DatePipe} from '@angular/common';
import {Navigation} from './components/navigation/navigation';
import {Footer} from './components/footer/footer';
import {filter} from 'rxjs';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {ConfirmDialog} from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar, DatePipe, Navigation, Footer, ConfirmDialog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [ConfirmationService]
})
export class App implements OnInit {
  private swUpdate = inject(SwUpdate);
  private confirmService = inject(ConfirmationService)

  ngOnInit() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          this.confirmService.confirm({
            message: 'New version available',
            header: 'Update Available',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Update',
            rejectLabel: 'Later',
            rejectVisible: true,
            accept: () => this.reload()
          });
        });
    }
  }

  reload() {
    this.swUpdate.activateUpdate().then(() => document.location.reload());
  }
}
