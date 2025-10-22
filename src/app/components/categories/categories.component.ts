import { Component } from '@angular/core';
import { CategoriesService } from '../../services/categories.service';
import { GlobalsService } from '../../services/helpers/globals.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent {
  constructor(public categoryService: CategoriesService,public globals: GlobalsService,private router: Router) {}

  goToCategory(categoryId: string): void {
    this.router.navigate(['/categories', categoryId], {
      queryParams: {
        projectId: this.globals.ProjectId,
        table: this.globals.tableNumber,
      },
    });
  }
}
