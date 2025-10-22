import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { CartService } from '../../services/cart.service';
import { CategoriesService } from '../../services/categories.service';
import { GlobalsService } from '../../services/helpers/globals.service';
import { LoaderService } from '../../services/helpers/loader.service';

@Component({
  selector: 'app-single-cat',
  templateUrl: './single-cat.component.html',
  styleUrl: './single-cat.component.scss',
})
export class SingleCatComponent {
  products: any[] = [];
  categoryId: string | null = '';
  category: any = null;
  constructor(
    private route: ActivatedRoute,
    private productsSerivce: ProductsService,
    public cartService: CartService,
    private loader: LoaderService,
    private categoriesService: CategoriesService,
    public globals: GlobalsService,
  ) {}

  ngOnInit(): void {
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');
    if (this.categoryId) {
      this.categoriesService.getCategoryById(this.categoryId).subscribe((category) => {
        this.category = category;
      });
      this.productsSerivce.getProductsByCatId(this.categoryId).subscribe((products) => {
        this.loader.hide()
        this.products = products;
      });
    }
  }
}
