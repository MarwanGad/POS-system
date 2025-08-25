import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Categories } from './categories/categories';
import { Category } from './category/category';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'shared/shared-module';



@NgModule({
  declarations: [
    Categories,
    Category
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: 'categories/:categoryId' , component: Category},
      { path: '' , component: Categories},
    ])
  ],
  exports: [

  ]
})
export class ShoppingModule { }
