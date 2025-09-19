import { test, expect } from './fixtures/category.fixture';

test.describe('Category Page', () => {
  test('has the correct category name', async ({ categoryPage }) => {
    await expect(categoryPage.categoryName).toContainText('ورقيات');
  });

  test('has the correct number of products that belongs to that category', async ({
    categoryPage,
  }) => {
    await expect(categoryPage.products).toHaveCount(2);
  });

  test('when loggedIn user not supposed to the add to cart button', async ({
    categoryPage,
  }) => {
    await expect(categoryPage.addToCartButton).not.toBeVisible();
  });

  test('there supposed to be only button to go back when there is an existing products', ({
    categoryPage,
  }) => {
    expect(categoryPage.goBackButton).toHaveCount(1);
  });

  // test('there supposed to be two button to go back when there is no existing products', ({
  //   categoryPage,
  // }) => {
  //   expect(categoryPage.addToCartButton).toHaveCount(2);
  // });

  test('navigate back to categories when press on back to categories button', async ({
    categoryPage,
  }) => {
    const goBackButton = await categoryPage.goBackButton;

    await goBackButton.click();

    await expect(categoryPage.Page).toHaveURL('http://localhost:4200');
    await expect(
      categoryPage.Page.getByTestId('start-page-text')
    ).toBeVisible();
  });
});
