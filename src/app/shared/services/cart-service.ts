import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { ProductInterface } from 'shared/models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  
  private cartItems: cartItemInterface[] = [];
  private cartSubject = new BehaviorSubject<cartItemInterface[]>([]);
  cart$ = this.cartSubject.asObservable();

  addProduct(product: ProductInterface): void {
    const existingProduct = this.cartItems.find(
      (item) => item.productName === product.productName
    );

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const newItem: cartItemInterface = { ...product, quantity: 1 };
      this.cartItems.push(newItem);
    }

    this.updateCart();
  }

  removeProduct(product: ProductInterface): void {
    const index = this.cartItems.findIndex(
      (item) => item.productName === product.productName
    );

    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.updateCart();
    }
  }

  decrementProductQuantity(product: cartItemInterface): void {
    const index = this.cartItems.findIndex(
      (item) => item.productName === product.productName
    );

    if (index === -1) return;

    if (product.quantity > 1) {
      product.quantity--;
    } else {
      this.cartItems.splice(index, 1);
    }

    this.updateCart();
  }

  clearCart(): void {
    this.cartItems = [];
    this.updateCart();
  }

  private updateCart(): void {
    this.cartSubject.next([...this.cartItems]);
  }
}
