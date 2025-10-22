import { test, expect, chromium } from '@playwright/test';
import { StartPage } from '../start/pages/start.page';
import { CategoryPage } from '../category/pages/category.page';

test('authorized start → category', async ({ page }) => {
  const browser = await chromium.launch({ headless: false, slowMo: 1000 });

  const startPage = new StartPage(page);
  await startPage.goto();

  const loginButton = page.getByTestId('loginButton');
  expect(loginButton).toBeVisible();
  loginButton.click();

  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    loginButton.click(),
  ]);

  await popup.waitForLoadState();
  await popup.waitForURL(/dev-l6eo3m2i7ghn6zve\.us\.auth0\.com\/u\/login.*/);

  const emailInputField = popup.getByRole('textbox', { name: 'Email address' });
  await expect(emailInputField).toBeVisible();
  await emailInputField.fill('morgan@gmail.com');

  const passwordInputField = popup.getByRole('textbox', { name: 'Password' });
  await expect(passwordInputField).toBeVisible();
  await passwordInputField.fill('MArwan123');

  const continueButton = popup.getByRole('button', {
    name: 'Continue',
    exact: true,
  });
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  await expect(page).toHaveURL('http://localhost:4200/');

  const accountButton = await page.getByTestId('accountButton');
  await expect(accountButton).toBeVisible();

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

  await expect(addToCartButton).toHaveCount(2);
  await expect(page.getByTestId('emptyCartText')).toBeVisible();
  await page
    .locator('product-card')
    .filter({ hasText: 'خس امريكي (كابوتشا) 996 1' })
    .getByTestId('addToCartButton')
    .click();

  await expect(
    page.getByTestId('cart-item').filter({ hasText: 'خس امريكي (كابوتشا)' })
  ).toBeVisible();

  await expect(await page.getByTestId('quantity-to-buy').inputValue()).toEqual(
    '1'
  );

  const incrementItemButton = await page.getByTestId('incrementItem');
  await incrementItemButton.click();

  await expect(await page.getByTestId('quantity-to-buy').inputValue()).toEqual(
    '2'
  );

  const decrementItemButton = await page.getByTestId('decrementItem');
  await decrementItemButton.click();

  await expect(await page.getByTestId('quantity-to-buy').inputValue()).toEqual(
    '1'
  );

  const deleteCartItem = await page.getByTestId('deleteCartItem');
  await deleteCartItem.click();

  expect(page.getByTestId('emptyCartText')).toBeVisible();
});
