import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

const APP_ERROR_HEADING = /unexpected application error/i;

test('reports page renders report tabs', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);

  await page.locator('a[href="/reports"]').click();
  await expect(page).toHaveURL(/\/reports$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: APP_ERROR_HEADING })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /reports/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /sales/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /products/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /customers/i })).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/reports');
});
