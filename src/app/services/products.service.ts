import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { DatabaseService } from './helpers/database.service';
import { GlobalsService } from './helpers/globals.service';
import { HelpersService } from './helpers/helpers.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  public allProducts: any[] = [];
  private fetchingInProgress = false;

  constructor(
    private db: DatabaseService,
    private globals: GlobalsService,
    private helperService: HelpersService
  ) {}

  /**
   * ✅ Get all products
   * - Cached by default
   * - Pass refresh=true to force reload
   */
  getProducts = (refresh: boolean = false) => {
    return new Observable<any>((observer) => {
      // ✅ Return cached data if available and not refreshing
      if (this.allProducts && this.allProducts.length > 0 && !refresh) {
        observer.next(this.allProducts);
        observer.complete();
        return;
      }

      // ✅ prevent multiple requests
      if (this.fetchingInProgress) return;
      this.fetchingInProgress = true;

      // ✅ Fetch from Firebase
      this.db.getDatabase(`projects/${this.globals.ProjectId}/products/`).subscribe(
        (response) => {
          this.fetchingInProgress = false;

          if (!response) {
            console.log('No data available');
            observer.next([]);
            observer.complete();
            return;
          }

          const modifiedResponse = Object.keys(response).map((key) => ({
            Id: key,
            ...response[key],
          }));

          this.allProducts = modifiedResponse;
          observer.next(modifiedResponse);
          observer.complete();
        },
        (error) => {
          this.fetchingInProgress = false;
          observer.error(error);
        }
      );
    });
  };

  //getting product by the category id and returning an array containing the matched products
  getProductsByCatId(catId: string) {
    return this.getProducts().pipe(
      map((products: any[]) =>
        products.filter((p) => p.categoriesIds && p.categoriesIds.includes(catId))
      )
    );
  }

  getProductById(productId: string): Observable<any> {
    return new Observable((observer) => {
      this.db.getDatabase(`projects/${this.globals.ProjectId}/products/${productId}`).subscribe((product) => {
          if (product) {
            const formattedProduct = {
              Id: productId,
              ...product,
            };
            observer.next(formattedProduct);
          } else {
            observer.next(null);
          }
          observer.complete();
        });
    });
  }

  /**
   * ✅ Reduce product stock in the database
   * - Takes an array of order items
   * - Decreases each product's stock by the ordered quantity
   */
  reduceProductStock(orderItems: any[]): Observable<void> {
    const updateTasks: Observable<any>[] = [];

    for (const item of orderItems) {
      const productPath = `projects/${this.globals.ProjectId}/products/${item.productId}`;
      const product = this.allProducts.find((p) => p.Id === item.productId);

      if (product.productStock > 0) {
        const newStock = Math.max(product.productStock - item.quantity, 0);
        const updatedProduct = { ...product, productStock: newStock };

        updateTasks.push(this.db.setDatabase(productPath, updatedProduct));
      }
    }

    return new Observable((observer) => {
      if (updateTasks.length === 0) {
        observer.next();
        observer.complete();
        return;
      }

      forkJoin(updateTasks).subscribe({
        next: () => {
          observer.next();
          observer.complete();
        },
        error: (err) => {
          console.error('❌ Error updating product stock:', err);
          observer.error(err);
        },
      });
    });
  }
}
