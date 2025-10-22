import { Page } from '@playwright/test';

export async function clickRandomCategory(page: Page) {
  // Wait for categories to be rendered
  await page.waitForSelector('.categoryCard', { timeout: 10000 });

  // Locate category elements
  const categories = page.locator('.categoryCard');
  const count = await categories.count();

  if (count === 0) {
    throw new Error('❌ No categories found on the page');
  }

  // Pick a random category
  const randomIndex = Math.floor(Math.random() * count);
  const category = categories.nth(randomIndex);

  // Click the image inside that category card
  const img = category.locator('img');
  const name = await img.getAttribute('alt');
  console.log(`🟢 Selected category: ${name}`);

  await img.click();
  await page.waitForLoadState('networkidle');
}
