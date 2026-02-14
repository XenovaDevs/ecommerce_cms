import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('orders page renders list and filters', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);
  await page.getByRole('link', { name: /[óo]rdenes|orders/i }).click();
  await expect(page).toHaveURL(/\/orders$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /orders/i })).toBeVisible();
  await expect(page.getByText(/manage and track customer orders/i)).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/orders');
});
