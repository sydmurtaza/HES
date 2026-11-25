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
      name: 'Pixel 7',
      use: {
        ...devices['Pixel 7'],
        channel: 'chrome'
      }
    },
    {
      name: 'iPhone 13',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 390, height: 844 },
        defaultBrowserType: 'chromium'
      }
    },
    {
      name: 'Compact 320x568',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 320, height: 568 },
        defaultBrowserType: 'chromium'
      }
    },
    {
      name: 'Landscape 844x390',
      use: {
        ...devices['iPhone 13'],
        viewport: { width: 844, height: 390 },
        defaultBrowserType: 'chromium'
      }
    }
  ]
});
