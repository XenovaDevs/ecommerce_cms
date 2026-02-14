import { expect, type Page } from '@playwright/test';
import { E2E_ENV } from './env';

export async function loginAsAdminUI(page: Page): Promise<void> {
  let done = false;
  for (let attempt = 1; attempt <= 5; attempt++) {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(E2E_ENV.adminEmail);
    await page.getByLabel(/contrase|password/i).fill(E2E_ENV.adminPassword);
    await page.getByRole('button', { name: /iniciar/i }).click();

    try {
      await page.waitForURL('**/dashboard', { timeout: 8_000 });
      done = true;
      break;
    } catch {
      if (attempt < 5) {
        await page.waitForTimeout(1200 * attempt);
      }
    }
  }

  expect(done, 'admin login should succeed').toBeTruthy();
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
}
