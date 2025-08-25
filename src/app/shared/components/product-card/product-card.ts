import { Component, Input } from '@angular/core';
import { ProductInterface } from 'shared/models/product.interface';
import { CartService } from 'shared/services/cart-service';
import { ToastService } from 'shared/services/toast-service';

@Component({
  selector: 'product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {

  
  @Input('product') product: ProductInterface | null = null;

  constructor(private cartService: CartService, private toastService: ToastService){}

  addToCart(productToAdd: ProductInterface | null){
    if(productToAdd)
      this.cartService.addProduct(productToAdd);

    this.toastService.show({
      header: 'تم إضافة المنتج',
      body: `${productToAdd?.productName}`
    })
  }
  

}
