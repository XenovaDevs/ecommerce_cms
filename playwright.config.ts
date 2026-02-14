import { defineConfig, devices } from '@playwright/test';

const cmsBaseURL = process.env.E2E_CMS_BASE_URL || 'http://localhost:3001';
const configuredWorkers = Number(process.env.E2E_WORKERS || '1');

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : (Number.isFinite(configuredWorkers) && configuredWorkers > 0 ? configuredWorkers : 1),
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/report.json' }],
  ],
  outputDir: 'test-results',
  use: {
    baseURL: cmsBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      testIgnore: /.*\.setup\.ts/,
    },
  ],
  webServer: process.env.PW_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'pnpm dev --port 3001',
        url: cmsBaseURL,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
