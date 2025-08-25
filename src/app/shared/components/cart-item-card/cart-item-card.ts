import { Component, Input } from '@angular/core';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { ProductInterface } from 'shared/models/product.interface';
import { CartService } from 'shared/services/cart-service';

@Component({
  selector: 'cart-item-card',
  standalone: false,
  templateUrl: './cart-item-card.html',
  styleUrl: './cart-item-card.css'
})
export class CartItemCard {
  @Input('product') product: any;

  constructor(private cartService: CartService){}

  removeFromCart(){
    if(this.product)
      this.cartService.removeProduct(this.product);
  }

  incrementItem(){
    if(this.product)
      this.cartService.addProduct(this.product);
  }

  decrementItem(){
    if(this.product)
      this.cartService.decrementProductQuantity(this.product)
  } 
}
