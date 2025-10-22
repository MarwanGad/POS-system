import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './components/categories/categories.component';
import { LoaderComponent } from './components/loader/loader.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SingleCatComponent } from './components/single-cat/single-cat.component';
import { OrderComponent } from './components/order/order.component';

const routes: Routes = [
  { path: '', component: CategoriesComponent },
  { path: 'loader', component: LoaderComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  // { path: 'categories/:categoryId' , component: CategoryComponent },
  { path: 'categories/:categoryId', component: SingleCatComponent },
  { path: 'order/:id', component:OrderComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
