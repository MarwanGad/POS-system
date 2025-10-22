import { Injectable } from '@angular/core';
import { GlobalsService } from './helpers/globals.service';
import { DatabaseService } from './helpers/database.service';
import { Observable } from 'rxjs';
import { ProductsService } from './products.service';
import { LoaderService } from './helpers/loader.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: any[] = [];
  total: number = 0;
  cartLength: number = 0;
  constructor(
    private globals: GlobalsService,
    private loader: LoaderService,
    private db: DatabaseService,
    private toastr: ToastrService,
    private productsService: ProductsService
  ) {}

  /**
   * Add a product entry to the cart
   * @param product - The product object to add (only its ID is stored)
   * @param quantity - Number of units to add (default: 1)
   *
   * If the product already exists in the cart, its quantity is increased.
   * Only the product ID and quantity are saved in Firebase, not the full product data.
   */
  addToCart(product: any, quantity: number = 1) {
    // Ensure product has stock
    if (product.productStock <= 0) {
      console.warn(`Cannot add "${product.productName}" — out of stock.`);
      return;
    }

    const productInCart = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart/${product.Id}`;

    this.db.getDatabase(productInCart).subscribe((existingData) => {
      let newQuantity = quantity;

      // If product already exists, increase quantity
      if (existingData && existingData.quantity) {
        newQuantity = existingData.quantity + quantity;
      }

      // Check stock limit
      if (newQuantity > product.productStock) {
        console.warn(
          `Cannot add more "${product.productName}" — only ${product.productStock} left in stock.`
        );
        return;
      }

      // Build the cart item
      const cartItem = {
        productId: product.Id,
        quantity: newQuantity,
      };

      // 💾 Save to Firebase
      this.db.setDatabase(productInCart, cartItem).subscribe(() => {
        // 🔁 Update local cart count
        const existingItem = this.cartItems.find((x) => x.product?.Id === product.Id);
        if (existingItem) {
          existingItem.quantity = newQuantity;
        } else {
          this.cartItems.push({ product, quantity: newQuantity });
        }
        this.initCartLength();
        this.calculateTotal();
        this.toastr.success(`${product.productName} added to cart`);
      });
    });
  }
  /**
   * Load all items from the cart
   * @returns Observable<any[]> - Emits an array of cart items with full product data
   *
   * Loads all cart data from Firebase, merges with product info,
   * stores result in `cartItems`, and updates total.
   */
  loadCart(): Observable<any[]> {
    return new Observable((observer) => {
      this.loader.show();
      const cartPath = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart`;

      this.db.getDatabase(cartPath).subscribe(async (cartData) => {
        if (cartData) {
          const productIds = Object.keys(cartData);

          if (productIds.length === 0) {
            this.cartItems = [];
            this.total = 0;
            this.loader.hide();
            observer.next([]);
            observer.complete();
            return;
          }

          const loadedItems: any[] = [];

          for (const id of productIds) {
            const item = cartData[id];
            const product = await new Promise((resolve) => {
              this.productsService.getProductById(item.productId).subscribe((p) => resolve(p));
            });

            if (product) {
              loadedItems.push({
                product: product,
                quantity: item.quantity,
              });
            }
          }

          this.cartItems = loadedItems;
          this.calculateTotal();
          this.loader.hide();
          observer.next(loadedItems);
          observer.complete();
        } else {
          this.cartItems = [];
          this.total = 0;
          this.loader.hide();
          observer.next([]);
          observer.complete();
        }
      });
    });
  }

  /**
   * Recalculate total cart amount
   *
   * Loops through `cartItems` and updates `total`
   * based on product price × quantity.
   */
  calculateTotal() {
    let total = 0;
    for (const item of this.cartItems) {
      const price = item.product.salePrice || item.product.regularPrice || 0;
      total += price * item.quantity;
    }
    this.total = total;
  }

  /**
   * Increase product quantity by 1
   * @param item - The cart item object
   *
   * Updates quantity instantly in the UI,
   * then syncs to Firebase.
   */
  increaseQuantity(item: any) {
    const productInCart = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart/${item.product.Id}`;
    const newQuantity = item.quantity + 1;
    item.quantity = newQuantity;
    this.calculateTotal();
    const updatedItem = {
      productId: item.product.Id,
      quantity: newQuantity,
    };
    this.db.setDatabase(productInCart, updatedItem).subscribe(() => {});
  }

  /**
   * Decrease product quantity by 1
   * @param item - The cart item object
   *
   * Decreases quantity but does not delete when it reaches zero.
   * Syncs new quantity to Firebase.
   */
  decreaseQuantity(item: any) {
    const productInCart = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart/${item.product.Id}`;
    const newQuantity = item.quantity - 1;

    item.quantity = newQuantity;
    this.calculateTotal();
    const updatedItem = {
      productId: item.product.Id,
      quantity: newQuantity,
    };
    this.db.setDatabase(productInCart, updatedItem).subscribe(() => {});
  }

  /**
   * Remove an item completely from the cart
   * @param item - The cart item object
   *
   * Deletes the product entry from Firebase,
   * removes it from `cartItems`, and updates total.
   */
  removeItem(item: any) {
    const productInCart = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart/${item.product.Id}`;

    this.db.removeDatabaseEndpoint(productInCart).subscribe(() => {
      this.cartItems = this.cartItems.filter((x) => x.product.Id !== item.product.Id);
      this.initCartLength();
      this.calculateTotal();
      this.toastr.info(`${item.product.productName} removed from cart`);
    });
  }

  initCartLength(): void {
    const cartPath = `projects/${this.globals.ProjectId}/table/${this.globals.tableNumber}/cart`;
    this.db.getDatabase(cartPath).subscribe((cartData) => {
      this.cartLength = Object.keys(cartData).length;
    });
  }
}
