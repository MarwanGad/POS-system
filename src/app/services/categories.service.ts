import { Injectable } from '@angular/core';
import { GlobalsService } from './helpers/globals.service';
import { map, Observable } from 'rxjs';
import { DatabaseService } from './helpers/database.service';
@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private db: DatabaseService, private globals: GlobalsService) {}
  public allCategories: any[] = [];
  private fetchingInProgress = false;
  getAllCategories = (refresh: boolean = false) => {
    return new Observable<any>((observer) => {
      // ✅ Return cached data if available and not refreshing
      if (this.allCategories && this.allCategories.length > 0 && !refresh) {
        observer.next(this.allCategories);
        observer.complete();
        return;
      }

      // ✅ prevent multiple requests
      if (this.fetchingInProgress) return;
      this.fetchingInProgress = true;

      // ✅ Fetch from Firebase
      this.db.getDatabase(`projects/${this.globals.ProjectId}/categories/`).subscribe(
        (response) => {
          this.fetchingInProgress = false;

          if (!response) {
            console.log('No data available');
            observer.next([]);
            observer.complete();
            return;
          }

          this.allCategories = response;
          observer.next(response);
          observer.complete();
        },
        (error) => {
          this.fetchingInProgress = false;
          observer.error(error);
        }
      );
    });
  };

  /**
   * Get a single category by its ID.
   *
   * Uses `getAllCategories()` to fetch categories (from cache or database),
   * then finds and returns the one that matches the given ID.
   *
   * @param categoryId - The category ID to find.
   * @returns An Observable that emits the category object or `null` if not found.
   */
  getCategoryById(categoryId: string): Observable<any | null> {
    return this.getAllCategories().pipe(
      map((categories: any[]) => {
        const found = categories.find((c) => c.categoryId === categoryId);
        return found || null;
      })
    );
  }
}
