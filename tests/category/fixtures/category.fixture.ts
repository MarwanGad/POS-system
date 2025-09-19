import { CategoryPage } from './../pages/category.page';
import { test as base } from '@playwright/test';

export const test = base.extend<{ categoryPage: CategoryPage }>({
  categoryPage: async ({ page }, use) => {
    const categoryPage: CategoryPage = new CategoryPage(page);

    await categoryPage.goto();
    await use(categoryPage);
  },
});

export { expect } from '@playwright/test';
