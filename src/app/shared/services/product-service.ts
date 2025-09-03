import { Injectable } from '@angular/core';
import { ProductInterface } from 'shared/models/product.interface';
import products from 'shared/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  private products: ProductInterface[] = Object.values(products) as ProductInterface[];

  getAllProducts(): ProductInterface[] {
    return this.products;
  }

  getProductsByCategoryId(categoryId: string): ProductInterface[] {
    return this.products.filter(product => product.categoriesIds.includes(categoryId));
  }


  getProductsQuantity(): number {
    return this.products.length;
  }
}
