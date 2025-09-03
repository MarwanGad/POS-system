import { Injectable } from '@angular/core';
import  categories from 'shared/categories.json';
import { CategoryInterface } from 'shared/models/category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private categories: CategoryInterface[] = categories;

  getAllCategories(): CategoryInterface[]{
    return this.categories;
  }

  getCategory(categoryId: string): CategoryInterface | undefined{
    return this.categories.find( category => category.categoryId === categoryId);
  }
}
