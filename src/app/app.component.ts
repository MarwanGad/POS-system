import { Component, OnInit } from '@angular/core';
import { ProductsService } from './services/products.service';
import { LoaderService } from './services/helpers/loader.service';
import { CategoriesService } from './services/categories.service';
import { CartService } from './services/cart.service';
import { SettingsService } from './services/helpers/settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public productsService: ProductsService,
    public loader: LoaderService,
    public cartService: CartService,
    public settingsService: SettingsService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadProjectData();
  }
  // https://menu.stacksmarket.co/?projectId=7903&table=1
  loadProjectData() {
    this.loader.show();
    this.settingsService.getProjectSettings().subscribe((settings) => {
      this.productsService.getProducts().subscribe(
        (products) => {
          this.categoryService.getAllCategories().subscribe(
            (categories) => {
              this.cartService.initCartLength();
              this.loader.hide();
            },
            (error) => {
              console.error('Error loading categories:', error);
            }
          );
        },
        (error) => {
          console.error('Error loading products:', error);
        }
      );
    });
  }
}
