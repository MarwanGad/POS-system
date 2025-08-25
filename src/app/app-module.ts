import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'shared/shared-module';

import { App } from './app';
import { AppRoutingModule } from './app-routing-module';
import { ShoppingModule } from './shopping/shopping-module';
import { CoreModule } from './core/core-module';



@NgModule({
  declarations: [
    App,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ShoppingModule,
    CoreModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
