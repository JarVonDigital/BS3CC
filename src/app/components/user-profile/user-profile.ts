import {Component, inject, signal} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../services/user.engine';
import {AvatarGroup} from 'primeng/avatargroup';
import {AsyncPipe, DatePipe} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {from} from 'rxjs';
import {Divider} from 'primeng/divider';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'app-user-profile',
  imports: [
    Avatar,
    AvatarGroup,
    AsyncPipe,
    Divider,
    DatePipe,
    Tooltip
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile{
  user: UserEngine = inject(UserEngine);
  $users = toSignal(from(this.user.getUsers()))


}
