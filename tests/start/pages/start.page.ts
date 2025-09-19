import type { Locator, Page } from '@playwright/test';

export class StartPage {
  readonly startingMessage: Locator;
  readonly subText: Locator;
  readonly emptyCartMessage: Locator;
  readonly categories: Locator;
  readonly Page: Page;
  constructor(private readonly page: Page) {
    this.startingMessage = page.getByTestId('start-page-text');
    this.subText = page.getByTestId('start-page-subText');
    this.emptyCartMessage = page.getByTestId('emptyCartText');
    this.categories = page.getByTestId('category-item');
    this.Page = page;
  }

  async goto() {
    await this.page.goto('http://localhost:4200');
  }

  async getCategoryCard(name: string) {
    return this.page
      .locator('category-card')
      .filter({ hasText: name })
      .locator('div')
      .first();
  }
}
