import { expect, test, type Page } from '@playwright/test';
import { attachNetworkMonitor, expectNoCriticalClientIssues } from './utils/networkAssertions';
import { GUARDED_ROUTES, PUBLIC_ROUTES } from './utils/routes';
import { loginAsAdminUI } from './utils/session';

const APP_ERROR_HEADING = /unexpected application error/i;
const AUTH_GUARD_NOISE = /(401|429)\s*\((unauthorized|too many requests)\)/i;

async function expectPageWithoutRuntimeCrash(page: Page, context: string) {
  await expect(
    page.getByRole('heading', { name: APP_ERROR_HEADING }),
    `${context} should not render the React Router error boundary`
  ).toHaveCount(0);
}

function routeRegex(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${escaped}$`);
}

async function openSidebarRouteAndAssert(page: Page, path: string, heading: RegExp) {
  await page.locator(`a[href="${path}"]`).click();
  await expect(page).toHaveURL(routeRegex(path));
  await page.waitForLoadState('networkidle');
  await expectPageWithoutRuntimeCrash(page, path);
  await expect(page.getByRole('heading', { name: heading }).first()).toBeVisible();
}

test.describe('CMS public and guard routes', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('public login route loads', async ({ page }) => {
    const monitor = attachNetworkMonitor(page);
    const response = await page.goto(PUBLIC_ROUTES[0].path, { waitUntil: 'networkidle' });

    expect(response?.ok(), 'login route response').toBeTruthy();
    await expect(page.getByText(PUBLIC_ROUTES[0].heading)).toBeVisible();

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

  test('protected routes redirect unauthenticated users to login', async ({ page }) => {
    for (const route of GUARDED_ROUTES) {
      await page.goto(route, { waitUntil: 'networkidle' });
      await expect(page, `route ${route} should redirect to login`).toHaveURL(/\/login/);
    }
  });
});

test.describe('CMS authenticated navigation', () => {
  test('direct URL access to dashboard after login', async ({ page }) => {
    await loginAsAdminUI(page);
    const monitor = attachNetworkMonitor(page);

    await expect
      .poll(() => page.evaluate(() => document.cookie.includes('access_token=')))
      .toBeTruthy();

    const response = await page.goto('/dashboard', { waitUntil: 'networkidle' });

    expect(response?.ok(), 'dashboard direct URL response').toBeTruthy();
    await expect(page).toHaveURL(/\/dashboard$/);
    await expectPageWithoutRuntimeCrash(page, '/dashboard-direct');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    expectNoCriticalClientIssues(monitor.stop(), '/dashboard-direct');
  });

  test('navigates through all main pages and dynamic pages', async ({ page }) => {
    await loginAsAdminUI(page);
    const monitor = attachNetworkMonitor(page);

    await expect(page).toHaveURL(/\/dashboard$/);
    await expectPageWithoutRuntimeCrash(page, '/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();

    await openSidebarRouteAndAssert(page, '/products', /productos/i);

    await page.locator('a[href="/products/create"]').first().click();
    await expect(page).toHaveURL(/\/products\/create$/);
    await expectPageWithoutRuntimeCrash(page, '/products/create');
    await expect(page.getByRole('heading', { name: /crear producto/i })).toBeVisible();

    const backToProductsLink = page.getByRole('link', { name: /volver a productos/i }).first();
    if (await backToProductsLink.count()) {
      await backToProductsLink.click();
      await expect(page).toHaveURL(/\/products$/);
      await expectPageWithoutRuntimeCrash(page, '/products (after create)');
    }

    const editButton = page.getByRole('button', { name: /editar/i }).first();
    if (await editButton.count()) {
      await editButton.click();
      await expect(page).toHaveURL(/\/products\/edit\/\d+/);
      await expectPageWithoutRuntimeCrash(page, '/products/edit/:id');
      await expect(page.getByRole('heading', { name: /editar producto/i })).toBeVisible();

      const backEditButton = page.getByRole('button', { name: /volver a productos/i }).first();
      if (await backEditButton.count()) {
        await backEditButton.click();
        await expect(page).toHaveURL(/\/products$/);
      }
    }

    await openSidebarRouteAndAssert(page, '/categories', /categor/i);
    await openSidebarRouteAndAssert(page, '/orders', /orders/i);

    const firstOrderRow = page.locator('tbody tr').first();
    if (await firstOrderRow.count()) {
      await firstOrderRow.click();
      await expect(page).toHaveURL(/\/orders\/\d+/);
      await expectPageWithoutRuntimeCrash(page, '/orders/:id');
      await expect(page.getByRole('heading', { name: /order/i }).first()).toBeVisible();

      const backOrdersButton = page.getByRole('button', { name: /back to orders/i }).first();
      if (await backOrdersButton.count()) {
        await backOrdersButton.click();
        await expect(page).toHaveURL(/\/orders$/);
        await expectPageWithoutRuntimeCrash(page, '/orders (after detail)');
      }
    }

    await openSidebarRouteAndAssert(page, '/customers', /clientes/i);
    await expect(page.getByText(/lista de clientes/i)).toBeVisible();

    const firstCustomerRow = page.locator('tbody tr').first();
    if (await firstCustomerRow.count()) {
      await firstCustomerRow.click();
      await expect(page).toHaveURL(/\/customers\/\d+/);
      await expectPageWithoutRuntimeCrash(page, '/customers/:id');

      const backCustomersButton = page.getByRole('button', { name: /volver/i }).first();
      if (await backCustomersButton.count()) {
        await backCustomersButton.click();
        await expect(page).toHaveURL(/\/customers$/);
      }
    }

    await openSidebarRouteAndAssert(page, '/shipping', /shipping management/i);
    await openSidebarRouteAndAssert(page, '/reports', /reports/i);
    await openSidebarRouteAndAssert(page, '/settings', /settings/i);

    expectNoCriticalClientIssues(monitor.stop(), 'authenticated-navigation');
  });
});
