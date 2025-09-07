import {Component, inject} from '@angular/core';
import {InputGroup} from 'primeng/inputgroup';
import {InputText} from 'primeng/inputtext';
import {InputGroupAddon} from 'primeng/inputgroupaddon';
import {Button} from 'primeng/button';
import {FloatLabel} from 'primeng/floatlabel';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {UserEngine, UserLoginForm} from '../../services/user.engine';

@Component({
  selector: 'app-login',
  imports: [
    InputGroup,
    InputText,
    InputGroupAddon,
    Button,
    FloatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  protected readonly fb = inject(FormBuilder);
  protected readonly userEngine = inject(UserEngine);
  protected userLoginForm = this.fb.group({
    email: '',
    password: ''
  })

  onLogin() {
    this.userEngine.loginWithEmailAndPassword(this.userLoginForm.getRawValue() as UserLoginForm)
  }
}
