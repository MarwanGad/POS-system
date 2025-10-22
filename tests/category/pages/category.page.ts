import type { Locator, Page } from '@playwright/test';

export class CategoryPage {
  readonly Page: Page;
  readonly products: Locator;
  readonly categoryName: Locator;
  readonly addToCartButton: Locator;
  readonly goBackButton: Locator;
  constructor(private readonly page: Page) {
    this.Page = page;
    this.products = page.getByTestId('product-item');
    this.categoryName = page.getByTestId('categoryName');
    this.addToCartButton = page.getByTestId('addToCartButton');
    this.goBackButton = page.getByTestId('goBackButton');
  }

  async goto() {
    await this.page.goto(`http://localhost:4200/categories/1753550377977-5792`);
  }
}
