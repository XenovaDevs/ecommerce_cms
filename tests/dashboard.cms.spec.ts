import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

test('dashboard renders stats widgets', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.waitForLoadState('networkidle');
  await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  await expect(page.getByText(/total [óo]rdenes/i).first()).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/dashboard');
});
