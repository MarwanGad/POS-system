import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { ProductInterface } from 'shared/models/product.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  
  cartItems: cartItemInterface[] = [];
  cartSubject = new BehaviorSubject<cartItemInterface[]>([]);

  cart$ = this.cartSubject.asObservable();

  addProduct(product: ProductInterface) {
    let existingProduct : any;
    existingProduct = this.cartItems.find(item => item?.productName === product?.productName);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      const newItem: cartItemInterface = { ...product, quantity: 1 };
      this.cartItems.push(newItem); }

    this.cartSubject.next([...this.cartItems]);
  }

  removeProduct(product: ProductInterface){
    const index = this.cartItems.findIndex(item => item.productName === product.productName);
    
    if (index > -1)
      this.cartItems.splice(index, 1);
      this.cartSubject.next([...this.cartItems]); 
  }
    
  decrementProductQuantity(product: cartItemInterface){
    
    const index = this.cartItems.findIndex(item => item.productName === product.productName);
    
    if (index === -1) return;
  
    if(product.quantity > 1)
      product.quantity --;
    else if(product.quantity === 1)
      this.cartItems.splice(index, 1);
      this.cartSubject.next([...this.cartItems]); 
  }

  clearCart(){

  this.cartItems = [];                
  this.cartSubject.next(this.cartItems); 
  }


}
