import {Component, inject, signal} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {UserEngine} from '../../services/user.engine';
import {AvatarGroup} from 'primeng/avatargroup';
import {DatePipe} from '@angular/common';
import {toSignal} from '@angular/core/rxjs-interop';
import {from} from 'rxjs';
import {Divider} from 'primeng/divider';
import {Tooltip} from 'primeng/tooltip';
import {OverlayBadge} from 'primeng/overlaybadge';
import {Badge} from 'primeng/badge';
import { fromBlob } from 'image-resize-compress';

@Component({
  selector: 'app-user-profile',
  imports: [
    Avatar,
    AvatarGroup,
    Divider,
    DatePipe,
    Tooltip,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile{
  user: UserEngine = inject(UserEngine);
  $users = toSignal(this.user.getUsers())


  async updateProfileImage() {
    // Create hidden file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    // Listen for file selection
    input.onchange = async () => {
      if (!input.files?.length) return;

      const file = input.files[0];

      // 🔹 Resize image (quality 80%, auto width/height, JPEG output)
      const resizedBlob = await fromBlob(file, 80, 'auto', 'auto', 'jpeg');

      // 🔹 Upload Blob directly (no Base64)
      const downloadURL = await this.user.uploadImage(resizedBlob, `${this.user.$signedInUser()?.uid}/profile/${file.name}`);

      if(downloadURL) {
        await this.user.updateProfilePhoto({
          photoURL: downloadURL
        })
      }

      console.log('✅ Uploaded resized image:', downloadURL);
    };

    // Trigger file picker
    input.click();
  }
}
