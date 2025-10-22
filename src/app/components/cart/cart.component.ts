import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { GlobalsService } from '../../services/helpers/globals.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  constructor(
    public globals: GlobalsService,
    private router: Router,
    public cartService: CartService
  ) {}
  ngOnInit(): void {
    this.cartService.loadCart().subscribe(() => {});
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout'], {
      queryParams: {
        projectId: this.globals.ProjectId,
        table: this.globals.tableNumber,
      },
    });
  }
}
