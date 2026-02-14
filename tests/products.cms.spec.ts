import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('products page renders list and primary actions', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);
  await page.getByRole('link', { name: /productos/i }).click();
  await expect(page).toHaveURL(/\/products$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: /productos/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /crear producto/i })).toBeVisible();
  await expect(page.getByText(/producto|precio|stock|estado/i).first()).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/products');
});
