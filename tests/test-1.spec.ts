import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://pos-system-b97e1.web.app/');
  await page
    .locator('category-card')
    .filter({ hasText: 'اسماك' })
    .getByRole('img')
    .click();

  await expect(
    page.locator('span').filter({ hasText: 'لا توجد منتجات في هذه الفئة' })
  ).toBeVisible();
});
