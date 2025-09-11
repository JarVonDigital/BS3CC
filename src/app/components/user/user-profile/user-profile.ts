import {Component, computed, inject, input, signal} from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { UserEngine } from '../../../services/user.engine';
import { AvatarGroup } from 'primeng/avatargroup';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Divider } from 'primeng/divider';
import { Tooltip } from 'primeng/tooltip';
import { fromBlob } from 'image-resize-compress';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Message} from 'primeng/message';
import {ProgressBar} from 'primeng/progressbar';
import {BibleReadingEngine} from '../../../services/bible-reading.engine';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-user-profile',
  imports: [
    Avatar,
    AvatarGroup,
    Divider,
    DatePipe,
    Tooltip,
    ProgressSpinner,
    Message,
    ProgressBar,
    Button,
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile {

  iconOnly = input(false)
  bibleReadingEngine = inject(BibleReadingEngine);
  user: UserEngine = inject(UserEngine);
  $users = toSignal(this.user.getUsers());
  $progress = toSignal(this.bibleReadingEngine.getUserProgress('COMPLETE'))
  $completed = computed(() => {
    return this.$progress()?.length ?? 0;
  })
  $totalProgress = computed(() => {
    return this.bibleReadingEngine.$bibleReadingSchedule().flatMap(s => s.reading).length ?? 0
  })
  $isUpdatingAvatar = signal(false)

  async updateProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png'; // ✅ restrict to JPG + PNG
    input.style.display = 'none';

    input.onchange = async () => {
      if (!input.files?.length) return;
      this.$isUpdatingAvatar.set(true);
      let file = input.files[0];

      try {
        // 🔹 Resize (quality 80%, keep aspect ratio)
        const resizedBlob = await fromBlob(file, 80, 'auto', 'auto', 'jpeg');

        // 🔹 Upload to Firebase Storage
        const photoURL = await this.user.uploadImage(
          resizedBlob,
          `${this.user.$signedInUser()?.uid}/profile/${file.name}`
        );

        // 🔹 Update Firebase Auth profile
        await this.user.updateProfilePhoto({ photoURL });
        this.$isUpdatingAvatar.set(false);
        console.log('✅ Profile photo updated:', photoURL);
      } catch (err) {
        this.$isUpdatingAvatar.set(false);
        console.error('❌ Error uploading image:', err);
      }
    };

    input.click();
  }

  /**
   * Retrieves the username of the signed-in user. If a username is not available,
   * extracts the prefix of the user's email (before the "@" symbol). Returns an
   * empty string if no username or email is available.
   *
   * @return {string} The username of the signed-in user, email prefix, or an empty string.
   */
  getUserName(): string {
    const userName = this.user.$signedInUser()?.displayName;
    const email = this.user.$signedInUser()?.email;
    if(userName) {
      return userName;
    }
    if(email) {
      return email.split('@')[0];
    }
    return "";
  }
}
