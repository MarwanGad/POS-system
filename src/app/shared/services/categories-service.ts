import { Injectable } from '@angular/core';
import  categories from 'shared/categories.json';
import { CategoryInterface } from 'shared/models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categoires: CategoryInterface[] = categories;

  getAllCategories(){
    return categories;
  }

  getCategory(categoryId: string){
    return this.categoires.find( category => category.categoryId === categoryId);
  }
}
