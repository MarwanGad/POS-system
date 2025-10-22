import { APP_INITIALIZER, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastrModule } from 'ngx-toastr';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SingleCatComponent } from './components/single-cat/single-cat.component';
import { FormsModule } from '@angular/forms';
import { OrderComponent } from './components/order/order.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { GlobalsService } from './services/helpers/globals.service';
import { AuthModule } from '@auth0/auth0-angular';
export function initGlobals(globals: GlobalsService) {
  return () => globals.initializeProjectFromUrl();
}
@NgModule({
  declarations: [
    AppComponent,
    TranslatePipe,
    NavbarComponent,
    CategoriesComponent,
    CategoryCardComponent,
    LoaderComponent,
    CartComponent,
    SingleCatComponent,
    CheckoutComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    AuthModule.forRoot({
      ...environment.auth0,
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true,
      progressBar: true,
    }),
  ],
 providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideDatabase(() => getDatabase()),
    {
      provide: APP_INITIALIZER,
      useFactory: initGlobals,
      deps: [GlobalsService],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
