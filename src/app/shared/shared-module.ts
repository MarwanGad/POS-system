import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cart } from './components/cart/cart';
import { ProductCard } from './components/product-card/product-card';
import { ProductService } from './services/product-service';
import { CategoriesService } from './services/categories-service';
import { CategoryCard } from './components/category-card/category-card';
import { CartItemCard } from './components/cart-item-card/cart-item-card';
import { Receipt } from './components/receipt/receipt';
import {NgxPrintModule} from 'ngx-print';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Toast } from './components/toast/toast';



@NgModule({
  declarations: [
    ProductCard,
    Cart,
    CategoryCard,
    CartItemCard,
    Receipt,
    Toast,

  ],
  imports: [
    CommonModule,
    NgxPrintModule,
    NgbModule
  ],
  exports: [
    ProductCard,
    Cart,
    CategoryCard,
    CommonModule,
    CartItemCard,
    Receipt,
    NgxPrintModule,
    NgbModule,
    Toast
  ],
  providers: [
    ProductService,
    CategoriesService,
  ]
})
export class SharedModule { }
