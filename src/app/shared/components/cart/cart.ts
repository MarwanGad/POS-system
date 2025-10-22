import { CartService } from './../../services/cart-service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { ProductInterface } from 'shared/models/product.interface';

@Component({
  selector: 'cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class Cart implements OnInit,OnDestroy {
  totalPrice: number = 0;
  currentCart: cartItemInterface[] = [];
  recepitCart: cartItemInterface[] = [];
  subscription: Subscription | null = null;
  cartProductsQuantity: number = 0;

  constructor(private CartService: CartService){}


  ngOnInit(): void {
    this.subscription = this.CartService.cart$
      .subscribe(items => {
        this.currentCart = items;
        this.totalPrice = this.currentCart
          .reduce( (sum, item) => sum + item.regularPrice * item.quantity,0);

        this.cartProductsQuantity = this.currentCart
          .reduce((total, item) => total + item.quantity, 0);
      })
  }

  clearCart(){
    this.CartService.clearCart();
  }
  
  placeOrder(){
    this.recepitCart = this.currentCart;
    this.CartService.clearCart();
  }


  ngOnDestroy(): void {
    if(this.subscription)
      this.subscription.unsubscribe();
  }

}
