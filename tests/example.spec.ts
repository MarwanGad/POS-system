import { test, expect } from '@playwright/test';

test('Stacks menu', async ({ page }) => {
  await page.goto('/');
  await page.waitForTimeout(1000)
  await expect(page.getByText('نظام نقاط البيع')).toBeVisible();
  await expect(page.getByText('local_dining')).toBeVisible();
  await expect(page.getByRole('button', { name: 'إجمالي المنتجات:' })).toBeVisible()
  await expect(page.getByText('I have Products')).toBeVisible()
  await expect(page.getByText('Category 2')).toBeVisible()
  await expect(page.getByText('Category 3')).toBeVisible()
  await expect(page.getByText('Category 5')).toBeVisible()

  await page.locator('category-card').filter({ hasText: 'I have Products2منتج' }).getByRole('img').click()
  await page.waitForTimeout(500)
  await expect(page.getByRole('button', { name: ' العودة للفئات' })).toBeVisible()
  await page.getByRole('button', { name: '+إضافة للسلة' }).nth(1).click()
});

