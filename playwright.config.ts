import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [
    ['list'],
    ['html'], // keep HTML report (view via `npx playwright show-report`)
    ['./tests/clickup-reporter.cjs'], // our custom reporter
  ],
  use: {
    baseURL: 'http://localhost:4200', // Angular dev server
    headless: false, // show the browser
    launchOptions: {
      slowMo: 200, // 500ms delay between actions
    },
    screenshot: 'on',
    trace: 'retain-on-failure',
    video: {
      mode: 'on'
    },
    contextOptions: {
      recordVideo: {
        dir: 'test-results'
      }
    },
    testIdAttribute: 'test-id',
  },
  projects: [
    {
      name: 'Desktop',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'Tablet',
      use: {
        browserName: 'chromium',
        viewport: { width: 768, height: 1024 },
      },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});

// pk_100606767_JZKG6JPOICFGVNZKSX3ILCL3JAGIZ118
// export CLICKUP_API_TOKEN="pk_100606767_JZKG6JPOICFGVNZKSX3ILCL3JAGIZ118"
// export CLICKUP_LIST_ID="901212752404"
