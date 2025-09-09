import { Component, inject } from '@angular/core';
import { Avatar } from 'primeng/avatar';
import { UserEngine } from '../../services/user.engine';
import { AvatarGroup } from 'primeng/avatargroup';
import { DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Divider } from 'primeng/divider';
import { Tooltip } from 'primeng/tooltip';
import { fromBlob } from 'image-resize-compress';
import heic2any from 'heic2any';

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
export class UserProfile {
  user: UserEngine = inject(UserEngine);
  $users = toSignal(this.user.getUsers());

  async updateProfileImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = async () => {
      if (!input.files?.length) return;
      let file = input.files[0];

      try {
        // 🔹 Convert HEIC → JPEG only in Safari/iOS
        if ((file.type === 'image/heic' || file.type === 'image/heif') && this.isSafari()) {
          try {
            const convertedBlob = (await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.9
            })) as Blob;

            file = new File(
              [convertedBlob],
              file.name.replace(/\.[^/.]+$/, '.jpg'),
              { type: 'image/jpeg' }
            );
          } catch (err) {
            console.warn('HEIC conversion failed:', err);
            alert('Could not convert HEIC image. Please try JPEG or PNG.');
            return;
          }
        }

        // ❌ Block HEIC in non-Safari browsers
        if ((file.type === 'image/heic' || file.type === 'image/heif') && !this.isSafari()) {
          alert('HEIC images are not supported in this browser. Please upload JPEG or PNG.');
          return;
        }

        // 🔹 Resize image
        let resizedBlob: Blob;
        try {
          resizedBlob = await fromBlob(file, 80, 'auto', 'auto', 'jpeg');
        } catch (err) {
          console.error('Image resize failed:', err);
          return;
        }

        // 🔹 Upload to Firebase Storage
        const photoURL = await this.user.uploadImage(
          resizedBlob,
          `${this.user.$signedInUser()?.uid}/profile/${file.name}`
        );

        // 🔹 Update Firebase Auth profile
        await this.user.updateProfilePhoto({ photoURL });
        console.log('✅ Profile photo updated:', photoURL);

      } catch (err) {
        console.error('❌ Error uploading image:', err);
      }
    };

    input.click();
  }

  isSafari(): boolean {
    return /safari/i.test(navigator.userAgent) && !/chrome|android/i.test(navigator.userAgent);
  }
}
