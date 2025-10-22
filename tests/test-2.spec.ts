import { test, expect } from '@playwright/test';

test('unauthorized user', async ({ page }) => {
  await page.goto('https://pos-system-b97e1.web.app/');
  await expect(page.locator('categories')).toContainText('اختر الفئة');
  await expect(page.locator('categories')).toContainText(
    'اختر فئة المنتجات التي تريد تصفحها'
  );
  await page
    .locator('category-card')
    .filter({ hasText: 'اسماك' })
    .getByRole('img')
    .click();
  await expect(page.locator('app-category')).toContainText(
    'لا توجد منتجات في هذه الفئة'
  );
  await expect(page.locator('app-category')).toContainText(
    'العودة لاختيار فئة أخرى'
  );
  await expect(page.locator('app-category')).toContainText('العودة للفئات');
  await expect(page.locator('.bi.bi-box-seam')).toBeVisible();
  await page.getByRole('button', { name: ' العودة للفئات' }).click();

  await page.getByText('2منتج').click();
  expect(page.getByTestId('إضافة للسلة')).not.toBeVisible();

  await page.getByRole('button', { name: ' العودة للفئات' }).click();
});

test('authorized user', async ({ page, context }) => {
  await page.goto('localhost:4200');
  await page.getByTestId('loginButton').click();
  const page1Promise = page.waitForEvent('popup');
  const page1 = await page1Promise;
});
