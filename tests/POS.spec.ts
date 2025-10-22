import { test, expect } from '@playwright/test';
import { clickRandomCategory } from './helper/random';

test('Stacks menu', async ({ page }) => {
  test.setTimeout(130000);
  await page.goto('/?table=16');
  await page.waitForTimeout(1000);

  // onboarding page
  await expect(page.getByText('Welcome')).toBeVisible();
  await expect(page.getByText('Select the category for your')).toBeVisible();

  // waiting for categories to load
  await page.waitForSelector('.categories-container');

  // Click a random category
  await clickRandomCategory(page);

  // Wait for products to load
  await page.waitForSelector('button:has-text("add to cart")');

  const products = page.locator('.card');
  const productCount = await products.count();
  console.log(`🛍 Found ${productCount} products in this category`);

  let addedProducts: { name: string; price: string }[] = [];
  // Loop through each product
  for (let i = 0; i < productCount; i++) {
    const product = products.nth(i);


    // Get product name and price
    const name = await product.locator('.card-text').innerText();
    const price = await product.locator('.productPrice').innerText();

    console.log(`➡️ Product ${i + 1}: ${name} — ${price}`);

    // Click "Add to Cart" if button exists
    const addButton = product.locator('text=/add to cart/i');
    if ((await addButton.count()) > 0) {
      await addButton.scrollIntoViewIfNeeded();
      await addButton.click();
      console.log(`✅ Added "${name}" to cart`);
      // await expect(page.getByText(`${name} added to cart`)).toBeVisible();
      addedProducts.push({ name, price });
    } else {
      console.log(`⚠️ No Add to Cart button for "${name}"`);
    }
  }
  console.log('all product details: ', addedProducts);

  const cart1 = page.locator('.cart-button');
  await cart1.scrollIntoViewIfNeeded();
  await cart1.click();

  await page.waitForSelector('.cart-container'); // adjust selector for your cart

  const cart = page.locator('.cart-container');
  let sumOfProducts = 0;
  for (const product of addedProducts) {
    const { name, price } = product;

    await cart.scrollIntoViewIfNeeded();
    // Verify product name appears in cart
    await expect(cart.getByText(`${name}`).first()).toBeVisible();

    // // Verify price appears in cart
    await expect(cart.getByText(`${price}`).first()).toBeVisible();
    sumOfProducts = sumOfProducts + Number(price);

    console.log(`🧩 Verified "${name}" (${price}) is in the cart`);
  }

  console.log('sum of products', sumOfProducts);

  await expect(page.getByRole('heading', { name: 'Order Summary' })).toBeVisible();
  await expect(page.getByText(`SubTotal: ${sumOfProducts.toFixed(2)} EGP`)).toBeVisible();
  await expect(page.getByText(`Number of items:${productCount}`)).toBeVisible();
  await expect(page.getByText(`Total: ${sumOfProducts.toFixed(2)} EGP`, { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();

  const checkOut = page.getByRole('button', { name: 'Proceed to Checkout' })
  await checkOut.scrollIntoViewIfNeeded();
  await checkOut.click();
  await page.waitForTimeout(1000)

  await expect(page.getByRole('heading', { name: 'How would you rate our' })).toBeVisible();
  await expect(page.getByText('Choose the tip percentage')).toBeVisible();
  await expect(page.getByText('% No Tip')).toBeVisible();
  await expect(page.getByText('% Good Service – 10%')).toBeVisible();
  await expect(page.getByText('% Excellent Service – 15%')).toBeVisible();
  await expect(page.getByText('% Exceptional Service – 20%')).toBeVisible();
  await expect(page.getByText('Or enter a custom percentage')).toBeVisible();
  await expect(page.getByPlaceholder('Enter percentage')).toBeVisible();
  await expect(page.getByText('%', { exact: true })).toBeVisible();

  for (const product of addedProducts) {
    const { name, price } = product;
    await expect(page.getByText(`${name}x1 ${price}`)).toBeVisible()
    console.log(`${name}x1 ${price}`)
  }

  await page.getByRole('button', { name: 'Place Order' }).click();

  await expect(page.getByRole('heading', { name: 'Your order has been confirmed' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Thank you!' })).toBeVisible();
  await expect(page.getByText('Your order has been received')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'assignment Order Details' })).toBeVisible();

  for (const product of addedProducts) {
    const { name, price } = product;
    await expect(page.getByText(`${name}`).first()).toBeVisible()
    await expect(page.getByText(`${price}`).first()).toBeVisible()
    console.log(`${name}x1 ${price}`)
  }

  await page.getByRole('button', { name: 'New Order' }).click();
});
