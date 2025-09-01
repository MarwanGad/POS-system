import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppAuthModule } from 'app/app-auth/app-auth-module';
import { NgxPrintModule } from 'ngx-print';

import { CartItemCard } from './components/cart-item-card/cart-item-card';
import { Cart } from './components/cart/cart';
import { CategoryCard } from './components/category-card/category-card';
import { ProductCard } from './components/product-card/product-card';
import { Receipt } from './components/receipt/receipt';
import { Toast } from './components/toast/toast';
import { CategoriesService } from './services/categories-service';
import { ProductService } from './services/product-service';
import { Loading } from './components/loading/loading';



@NgModule({
  declarations: [
    ProductCard,
    Cart,
    CategoryCard,
    CartItemCard,
    Receipt,
    Toast,
    Loading,

  ],
  imports: [
    CommonModule,
    NgxPrintModule,
    NgbModule,
    AppAuthModule
  ],
  exports: [
    ProductCard,
    Cart,
    CategoryCard,
    CommonModule,
    AppAuthModule,
    CartItemCard,
    Receipt,
    NgxPrintModule,
    NgbModule,
    Toast,
    Loading
  ],
  providers: [
    ProductService,
    CategoriesService,
  ]
})
export class SharedModule { }
