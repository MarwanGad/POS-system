import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { ProductInterface } from 'shared/models/product.interface';
import { CartService } from 'shared/services/cart-service';
import { ToastService } from 'shared/services/toast-service';

@Component({
  selector: 'product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard implements OnInit, OnDestroy {
  roles: string[] = [];
  subscription: Subscription | null = null;

  @Input('product') product: ProductInterface | null = null;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private auth: AuthService
  ) {}

  addToCart(productToAdd: ProductInterface | null) {
    if (productToAdd) {
      this.cartService.addProduct(productToAdd);
      this.toastService.show({
        header: 'تم إضافة المنتج',
        body: `${productToAdd?.productName}`,
      });
    }
  }

  ngOnInit(): void {
    this.subscription = this.auth.user$.subscribe((user) => {
      this.roles = user?.['https://auth.myapp.com/roles'] || [];
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
