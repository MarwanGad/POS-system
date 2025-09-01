import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-account',
  standalone: false,
  templateUrl: './account.html',
  styleUrl: './account.css'
})
export class Account implements OnInit, OnDestroy {

  loggedInUser: any;
  userSubscription: Subscription | null = null;
  tokenSubscription: Subscription | null = null;

  constructor(public auth: AuthService){}

  ngOnInit(){
    this.tokenSubscription = this.auth.getAccessTokenSilently({
      cacheMode: 'off'
    }).subscribe();
    
    this.userSubscription = this.auth.user$
      .subscribe( userCredentials => {
        this.loggedInUser = userCredentials;
        console.log(this.loggedInUser);
      })
  }

  ngOnDestroy(): void {
    if(this.userSubscription)
      this.userSubscription.unsubscribe();

    if(this.tokenSubscription)
      this.tokenSubscription.unsubscribe();
  }
}
