import {Component, inject} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../services/user.engine';

@Component({
  selector: 'app-user-profile',
  imports: [
    Avatar
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile {
  user: UserEngine = inject(UserEngine);
}
