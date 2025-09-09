import {Component, signal} from '@angular/core';
import {DateTime} from 'luxon';
import {Dialog} from 'primeng/dialog';

@Component({
  selector: 'app-footer',
  imports: [
    Dialog
  ],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  $showPrivacyPolicy = signal(false);
  protected readonly DateTime = DateTime;
}
