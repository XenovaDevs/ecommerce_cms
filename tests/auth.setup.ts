import fs from 'node:fs';
import { test, expect } from '@playwright/test';
import { E2E_ENV } from './utils/env';

const authDir = 'tests/.auth';
const authFile = `${authDir}/admin.json`;

test('authenticate admin and save storage state', async ({ page, context }) => {
  fs.mkdirSync(authDir, { recursive: true });

  let authenticated = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    await page.goto('/login');
    await expect(page.getByText(/panel de administraci/i)).toBeVisible();

    await page.getByLabel(/email/i).fill(E2E_ENV.adminEmail);
    await page.getByLabel(/contrase|password/i).fill(E2E_ENV.adminPassword);

    await page.getByRole('button', { name: /iniciar/i }).click();
    try {
      await page.waitForURL('**/dashboard', { timeout: 8_000 });
      authenticated = true;
      break;
    } catch {
      if (attempt < 5) {
        await page.waitForTimeout(1200 * attempt);
      }
    }
  }

  expect(authenticated, 'admin setup login should succeed').toBeTruthy();
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  await context.storageState({ path: authFile });
});
