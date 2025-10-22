import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { CartService } from 'shared/services/cart-service';
import { ProductService } from 'shared/services/product-service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit, OnDestroy {
  productsQuantity: number = 0;
  subscription: Subscription | null = null;
  currentCart: cartItemInterface[] = [];
  cartProductsQuantity: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.productsQuantity = this.productService.countAllProducts();

    this.subscription = this.cartService.cart$.subscribe((items) => {
      this.currentCart = items;
      this.cartProductsQuantity = this.currentCart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
