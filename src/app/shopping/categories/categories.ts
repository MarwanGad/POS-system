import { CategoryInterface } from 'shared/models/category.interface';
import { Component, NgModule, OnInit } from '@angular/core';
import { CategoriesService } from 'shared/services/categories-service';
import { ProductService } from 'shared/services/product-service';

@Component({
  selector: 'categories',
  standalone: false,
  templateUrl: './categories.html',
  styleUrl: './categories.css'
})
export class Categories implements OnInit {
  categoires: CategoryInterface[] = [];
  categoryCount: { [key:string]: number } = {};

  constructor(private categoiresService: CategoriesService
              ,private productService: ProductService){}

  ngOnInit(): void {
    this.categoires = this.categoiresService.getAllCategories();

    this.productService.getAllProducts()
      .forEach( product => {
        product.categoriesIds.forEach( categoryId => {
          this.categoryCount[categoryId] = (this.categoryCount[categoryId] || 0) + 1;
        })
      })
  }
}
