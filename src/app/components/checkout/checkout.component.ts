import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalsService } from '../../services/helpers/globals.service';
import { DatabaseService } from '../../services/helpers/database.service';
import { Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  selectedTip = 0;
  customTip: number | null = null;
  tipAmount = 0;
  grandTotal = 0;

  constructor(
    public cartService: CartService,
    private toastr: ToastrService,
    private productsService: ProductsService,
    public globals: GlobalsService,
    private router: Router,
    private db: DatabaseService
  ) {}

  ngOnInit(): void {
    this.cartService.loadCart().subscribe(() => this.updateTotals());
  }

  /** When user clicks a tip option */
  selectTip(percent: number): void {
    this.selectedTip = percent;
    this.customTip = null;
    this.updateTotals();
  }

  /** When user types a custom tip */
  updateCustomTip(): void {
    this.selectedTip = this.customTip ? this.customTip : 0;
    this.updateTotals();
  }

  /** Recalculate tip and totals */
  updateTotals(): void {
    const total = this.cartService.total;
    this.tipAmount = Number(((total * this.selectedTip) / 100).toFixed(2));
    this.grandTotal = Number((total + this.tipAmount).toFixed(2));
  }

  /**
   * Places a new table order in Firebase.
   *
   * This function:
   * 1. Validates the cart.
   * 2. Generates a sequential numeric order ID (00001, 00002, 00003...).
   * 3. Saves the order to Firebase under that numeric key.
   * 4. Clears the cart, updates stock, and navigates to the order page.
   */
  placeOrder(): void {
    // Step 1: Validate cart
    if (this.cartService.cartItems.length === 0) {
      this.toastr.warning('Add items before placing an order.');
      return;
    }

    const projectId = this.globals.ProjectId;
    const orderPath = `projects/${projectId}/tableOrders`;
    const cart = `projects/${projectId}/table/${this.globals.tableNumber}/cart`;

    // Step 2: Get next numeric order ID
    this.db.getDatabase(orderPath).subscribe((orders) => {
      let nextNumber = 1;

      if (orders) {
        const existingNumbers = Object.keys(orders)
          .map((key) => parseInt(key, 10))
          .filter((num) => !isNaN(num));

        if (existingNumbers.length > 0) {
          nextNumber = Math.max(...existingNumbers) + 1;
        }
      }

      const id = nextNumber.toString().padStart(4, '0');

      // Step 3: Build order data
      const orderData = {
        id,
        tableNumber: this.globals.tableNumber,
        createdAt: new Date().toLocaleDateString(),
        status: 'Processing',
        subtotal: Number(this.cartService.total.toFixed(2)),
        tipPercentage: this.selectedTip,
        tipAmount: Number(this.tipAmount.toFixed(2)),
        grandTotal: Number(this.grandTotal.toFixed(2)),
        items: this.cartService.cartItems.map((item) => ({
          productId: item.product.Id,
          name: item.product.productName,
          sku: item.product.productSKU,
          regularPrice: Number(item.product.regularPrice) || 0,
          salePrice: Number(item.product.salePrice) || 0,
          quantity: item.quantity,
          img: item.product.imageUrl || item.product.imageUrl[0],
        })),
      };

      // Step 4: Save order under numeric key
      this.db.setDatabase(`${orderPath}/${id}`, orderData).subscribe(
        () => {
          this.db.removeDatabaseEndpoint(cart).subscribe(() => {
            this.productsService.reduceProductStock(orderData.items).subscribe(() => {
              this.cartService.cartItems = [];
              this.cartService.total = 0;
              this.toastr.success(`Order ${id} placed successfully!`);
              this.cartService.initCartLength();
              this.router.navigate(['/order', id], { queryParamsHandling: 'preserve' });
            });
          });
        },
        (err) => {
          console.error('Failed to place order:', err);
          this.toastr.error('Failed to place the order. Please try again.');
        }
      );
    });
  }
}
