import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../../services/helpers/database.service';
import { GlobalsService } from '../../services/helpers/globals.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent implements OnInit {
  orderId!: any;
  orderData: any = null;
  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    public globals: GlobalsService
  ) {}

  ngOnInit(): void {
    /** Extract order ID from route parameter */
    this.orderId = this.route.snapshot.paramMap.get('id');
    /** Fetch order details from the database using the order ID */
    this.loadOrder();
  }

  /** Fetch the order details from Firebase Realtime Database */
  loadOrder(): void {
    const orderPath = `projects/${this.globals.ProjectId}/tableOrders/${this.orderId}`;
    this.db.getDatabase(orderPath).subscribe((data) => {
      this.orderData = data;
    });
  }

}
