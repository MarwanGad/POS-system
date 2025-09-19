import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cartItemInterface } from 'shared/models/cartItem.interface';
import { CategoryInterface } from 'shared/models/category.interface';
import { ProductInterface } from 'shared/models/product.interface';
import { CategoriesService } from 'shared/services/categories-service';
import { ProductService } from 'shared/services/product-service';

@Component({
  selector: 'app-category',
  standalone: false,
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category implements OnInit {
  products: ProductInterface[] = [];
  currentCategory: CategoryInterface | null = null;
  categoryId: string | null = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    if (this.categoryId !== null)
      this.currentCategory =
        this.categoryService.getCategoryById(this.categoryId) || null;
    this.products =
      this.productService.getProductsByCategoryId(this.categoryId!) || [];
  }
}
