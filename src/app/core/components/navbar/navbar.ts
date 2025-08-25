import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { CartService } from 'shared/services/cart-service';
import { ProductService } from 'shared/services/product-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit , OnDestroy{
  productsQuantity: number = 0;
  subscription: Subscription | null = null;
  currentCart: cartItemInterface[] = [];

  constructor(private productService: ProductService, private cartService: CartService){}

  ngOnInit(): void {
   this.productsQuantity = this.productService.productsQuantity(); 

   this.subscription = this.cartService.cart$
      .subscribe(items => {
        this.currentCart = items;
    })
  }

  ngOnDestroy(): void {
    if(this.subscription)
      this.subscription.unsubscribe();
  }
}
