import { Component, Input } from '@angular/core';
import { CategoryInterface } from 'shared/models/category.interface';

@Component({
  selector: 'category-card',
  standalone: false,
  templateUrl: './category-card.html',
  styleUrl: './category-card.css',
  host: {
    'data-testid': 'categoryCard',
  },
})
export class CategoryCard {
  @Input('category') category: CategoryInterface | null = null;
  @Input('count') count: number = 0;
}
