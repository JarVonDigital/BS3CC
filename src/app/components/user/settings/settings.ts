import {Component, effect, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserEngine} from '../../../services/user.engine';
import {InputText} from 'primeng/inputtext';
import {Fluid} from 'primeng/fluid';
import {InputGroup} from 'primeng/inputgroup';
import {FloatLabel} from 'primeng/floatlabel';
import {Button} from 'primeng/button';
import {Divider} from 'primeng/divider';
import {toSignal} from '@angular/core/rxjs-interop';
import {from} from 'rxjs';
import {UserProfile} from '../user-profile/user-profile';
import { DynamicDialogRef} from 'primeng/dynamicdialog';

@Component({
  selector: 'app-settings',
  imports: [
    InputText,
    ReactiveFormsModule,
    Fluid,
    InputGroup,
    FloatLabel,
    Button,
    Divider,
    UserProfile
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss'
})
export class Settings {
  private fb = inject(FormBuilder);
  private dialog = inject(DynamicDialogRef);
  userEngine = inject(UserEngine);
  $user = toSignal(from(this.userEngine.$user()), {initialValue: {} as any});

  /**
   * A reactive form group that is used to manage and validate user input fields.
   * Contains the following fields:
   *
   * - `firstName`: A form control to capture the user's first name.
   * - `lastName`: A form control to capture the user's last name.
   * - `phone`: A form control to capture the user's phone number.
   * - `email`: A form control to capture the user's email address.
   * - `displayName`: A form control to capture the user's display name.
   */
  form = this.fb.group({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    displayName: '',
  })

  /**
   * Variable `mockUserData` is an effect function that synchronizes user-provided
   * data with form values. When invoked, it patches the current form's values with
   * the data returned from the `$user` method. This is typically used to integrate
   * or simulate user-related data into the form for testing or initialization purposes.
   */
  mockUserData = effect(() => {
    this.form.patchValue({
      firstName: this.$user()?.firstName ?? '',
      lastName: this.$user()?.lastName ?? '',
      phone: this.$user()?.phone ?? '',
      email: this.$user()?.email ?? '',
      displayName: this.$user()?.displayName ?? '',
    })
  })

  async updateUser() {
    await this.userEngine.updateUser(this.form.getRawValue() as any)
    this.dialog.close()
  }
}
