import { test, expect } from './fixtures/start.fixture';

test.describe('Start Page', () => {
  test('has starting text', async ({ startPage }) => {
    await expect(startPage.startingMessage).toContainText('اختر الفئة');
  });

  test('has starting sub text', async ({ startPage }) => {
    await expect(startPage.subText).toContainText(
      'اختر فئة المنتجات التي تريد تصفحها'
    );
  });

  test('cart should be initially empty', async ({ startPage }) => {
    await expect(startPage.emptyCartMessage).toContainText('السلة فارغة');
  });

  test('displays all availiable categories', async ({ startPage }) => {
    await expect(startPage.categories).toHaveCount(10);
  });

  test('navigates the user to the correct category on clicking on it', async ({
    startPage,
  }) => {
    const categoryCard = await startPage.getCategoryCard('ورقيات 2منتج');

    await categoryCard.click();
    await expect(startPage.Page).toHaveURL(
      'http://localhost:4200/categories/1753550377977-5792'
    );

    const categoryName = startPage.Page.getByText('ورقيات');
    await expect(categoryName).toBeVisible();
  });
});
