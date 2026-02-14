import { expect, test } from '@playwright/test';
import { E2E_ENV } from './utils/env';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { loginAsAdminUI } from './utils/session';

const AUTH_GUARD_NOISE = /(401|429)\s*\((unauthorized|too many requests)\)/i;

test.describe('CMS auth and route guards', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('loads login page', async ({ page }) => {
    const monitor = attachNetworkMonitor(page);
    const response = await page.goto('/login', { waitUntil: 'networkidle' });

    expect(response?.ok(), 'login page response').toBeTruthy();
    await expect(page.getByText(/panel de administraci/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/contrase|password/i)).toBeVisible();

    expectNoCriticalClientIssues(monitor.stop(), '/login', {
      ignore: [
        {
          type: 'console',
          detail: AUTH_GUARD_NOISE,
          url: /\/login$/,
        },
      ],
    });
  });

  test('rejects invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(E2E_ENV.adminEmail);
    await page.getByLabel(/contrase|password/i).fill('invalid-password');
    const loginResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().includes('/auth/login') &&
        [401, 422, 429].includes(response.status())
      );
    });

    await page.getByRole('button', { name: /iniciar/i }).click();
    const loginResponse = await loginResponsePromise;

    expect([401, 422, 429]).toContain(loginResponse.status());
    await expect(page).toHaveURL(/\/login/);
  });

  test('logs in with seeded admin and logs out', async ({ page }) => {
    await loginAsAdminUI(page);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await page.locator('button[title*="Cerrar"]').click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('blocks customer role from entering CMS', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(E2E_ENV.customerEmail);
    await page.getByLabel(/contrase|password/i).fill(E2E_ENV.customerPassword);
    await page.getByRole('button', { name: /iniciar/i }).click();

    await page.waitForTimeout(800);
    await expect(page).toHaveURL(/\/login/);
  });

  test('redirects protected route to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
