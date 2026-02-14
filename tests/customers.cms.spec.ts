import { expect, test } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

const APP_ERROR_HEADING = /unexpected application error/i;

test('customers page renders customer management UI', async ({ page }) => {
  await loginAsAdminUI(page);
  const monitor = attachNetworkMonitor(page);

  await page.locator('a[href="/customers"]').click();
  await expect(page).toHaveURL(/\/customers$/);
  await page.waitForLoadState('networkidle');

  await expect(page.getByRole('heading', { name: APP_ERROR_HEADING })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Clientes', exact: true })).toBeVisible();
  await expect(page.getByText(/lista de clientes/i)).toBeVisible();

  expectNoCriticalClientIssues(monitor.stop(), '/customers');
});
