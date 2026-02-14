import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('categories page renders tree/list and create action', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);

  await page.locator('a[href="/categories"]').click();
  await expect(page).toHaveURL(/\/categories$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /categor/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /crear categor/i })).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/categories');
});
