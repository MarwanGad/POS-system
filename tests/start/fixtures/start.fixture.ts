import { test as base } from '@playwright/test';

import { StartPage } from '../pages/start.page';

export const test = base.extend<{ startPage: StartPage }>({
  startPage: async ({ page }, use) => {
    const startPage: StartPage = new StartPage(page);
    await startPage.goto();

    await use(startPage);
  },
});

export { expect } from '@playwright/test';
