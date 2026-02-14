import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('shipping page renders tabs and attempts API integration', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);
  await page.getByRole('link', { name: /env[ií]os|shipping/i }).click();
  await expect(page).toHaveURL(/\/shipping$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /shipping management/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /shipments/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /create shipment/i })).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/shipping');
});
