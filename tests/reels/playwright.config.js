// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'off',
    video: 'off',
    screenshot: 'off'
  },
  projects: [
    {
      name: 'Desktop Chrome 1440x900',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        channel: 'chrome'
      }
    },
    {
      name: 'Pixel 7 (Chromium mobile)',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome'
      }
    },
    {
      name: 'iPhone 13 (Mobile emulation)',
      use: {
        ...devices['iPhone 13'],
        defaultBrowserType: 'chromium'
      }
    }
  ]
});
