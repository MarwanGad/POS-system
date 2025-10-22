import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'login-button',
  standalone: false,
  templateUrl: './login-button.html',
  styleUrl: './login-button.scss',
})
export class LoginButton {
  constructor(public auth: AuthService) {}
}
