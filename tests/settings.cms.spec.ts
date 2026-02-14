import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('settings page renders all tabs', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);

  await page.locator('a[href="/settings"]').click();
  await expect(page).toHaveURL(/\/settings$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: 'Settings', exact: true })).toBeVisible();
  await expect(page.getByRole('tab', { name: /general/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /shipping/i })).toBeVisible();
  await expect(page.getByRole('tab', { name: /payment/i })).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/settings');
});
