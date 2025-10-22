import { Component, Input, OnInit } from '@angular/core';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'category-card',
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.scss',
})
export class CategoryCardComponent implements OnInit {
  @Input('category') category: any;
  categoryProductCount: number = 0;
  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService
      .getProductsByCatId(this.category.categoryId)
      .subscribe((products: any[]) => {
        this.categoryProductCount = products.length;
      });
  }
}
