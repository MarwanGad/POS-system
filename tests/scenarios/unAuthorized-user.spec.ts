import { test, expect } from '@playwright/test';
import { StartPage } from '../start/pages/start.page';
import { CategoryPage } from '../category/pages/category.page';

test('unAuthorized start → category', async ({ page }) => {
  const startPage = new StartPage(page);
  await startPage.goto();

  const category = await page
    .locator('category-card')
    .filter({ hasText: 'ورقيات 2منتج' })
    .locator('div')
    .first();
  await category.click();
  const categoryPage = await new CategoryPage(page);
  await expect(page).toHaveURL(
    'http://localhost:4200/categories/1753550377977-5792'
  );

  await expect(page.getByText('ورقيات')).toBeVisible();
  const products = await page.locator('product-card');
  await expect(products).toHaveCount(2);
  const addToCartButton = await page.getByTestId('addToCartButton');

  await expect(addToCartButton).not.toBeVisible();
});
