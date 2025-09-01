import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModule } from '@auth0/auth0-angular';

import { environment  } from 'environments/environment';
import { LoginButton } from './components/login-button/login-button';
import { Account } from './components/account/account';

@NgModule({
  declarations: [
    LoginButton,
    Account
  ],
  imports: [
    CommonModule,
    AuthModule.forRoot({
      ...environment.auth,
    })
  ],
  exports: [
    LoginButton,
    Account
  ]
})
export class AppAuthModule { }
