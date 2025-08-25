import { Injectable } from '@angular/core';
import { ProductInterface } from 'shared/models/product.interface';
import products from 'shared/products.json';

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  getProductsById(categoryId: string){
    const productsArray = Object.values(products) as ProductInterface[];

    return productsArray.filter(product => product.categoriesIds.includes(categoryId));
  }

  getAllProducts(){
    return Object.values(products);
  }

  productsQuantity(){
    return Object.values(products).length;
  }
}
