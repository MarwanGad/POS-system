import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://pos-system-b97e1.web.app/');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: '' }).click();
  const page1 = await page1Promise;
});
