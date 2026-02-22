import { expect, test } from '@playwright/test';
import { CleanupRegistry } from './fixtures/cleanup';
import { buildCategoryPayload, buildProductPayload, buildTinyPng, uniqueSuffix } from './fixtures/dataFactory';
import {
  API_ENDPOINTS,
  type ApiClient,
  expectImplementedEndpoint,
  getFirstCustomerId,
  getFirstOrderId,
  loginAsAdmin,
  newApiContext,
  readJson,
  unwrapData,
  unwrapList,
} from './utils/api-client';
import { E2E_ENV } from './utils/env';

function expectEndpointReachable(response: { status: () => number }, endpointName: string): void {
  expect.soft(response.status(), `${endpointName} should not return 405`).not.toBe(405);
  expect.soft(response.status(), `${endpointName} should not return 5xx`).toBeLessThan(500);
}

test.describe('CMS API contract coverage', () => {
  let adminApi: ApiClient | null = null;
  let cleanup: CleanupRegistry | null = null;
  let firstOrderId: number | null = null;
  let firstCustomerId: number | null = null;

  test.beforeAll(async ({ playwright }) => {
    const auth = await loginAsAdmin(playwright.request);
    adminApi = auth.api;
    cleanup = new CleanupRegistry();

    firstOrderId = await getFirstOrderId(adminApi);
    firstCustomerId = await getFirstCustomerId(adminApi);
  });

  test.afterAll(async () => {
    if (cleanup && adminApi) {
      await cleanup.run(adminApi);
      await adminApi.dispose();
    }
  });

  test('AUTH endpoints: login, refresh, me, logout', async ({ playwright }) => {
    const sessionApi = await newApiContext(playwright.request);

    const loginRes = await sessionApi.post(API_ENDPOINTS.AUTH.LOGIN, {
      data: { email: E2E_ENV.adminEmail, password: E2E_ENV.adminPassword },
    });
    expectImplementedEndpoint(loginRes, 'AUTH.LOGIN');
    expect(loginRes.ok(), 'AUTH.LOGIN should return 2xx').toBeTruthy();

    let refreshRes = await sessionApi.post(API_ENDPOINTS.AUTH.REFRESH, { data: {} });
    if (refreshRes.status() === 429) {
      await new Promise((resolve) => setTimeout(resolve, 1_500));
      refreshRes = await sessionApi.post(API_ENDPOINTS.AUTH.REFRESH, { data: {} });
    }
    expectImplementedEndpoint(refreshRes, 'AUTH.REFRESH');
    expect(
      [200, 201, 204, 401, 429],
      'AUTH.REFRESH should be reachable (2xx preferred; 401/429 can happen depending on cookie/rate-limit state)'
    ).toContain(refreshRes.status());

    const loginBody = await readJson(loginRes);
    const loginToken = loginBody?.data?.access_token ?? loginBody?.access_token;
    expect(loginToken, 'missing token from login').toBeTruthy();

    const tokenApi = await newApiContext(playwright.request, loginToken);
    const meRes = await tokenApi.get(API_ENDPOINTS.AUTH.ME);
    expectImplementedEndpoint(meRes, 'AUTH.ME');
    expect(meRes.ok(), 'AUTH.ME should return 2xx').toBeTruthy();

    const logoutRes = await tokenApi.post(API_ENDPOINTS.AUTH.LOGOUT);
    expectImplementedEndpoint(logoutRes, 'AUTH.LOGOUT');
    expect([200, 204]).toContain(logoutRes.status());

    await tokenApi.dispose();
    await sessionApi.dispose();

    // Ensure remaining contract checks run with a valid admin token even if logout revokes user sessions.
    if (adminApi) {
      await adminApi.dispose();
    }
    const refreshedAdmin = await loginAsAdmin(playwright.request);
    adminApi = refreshedAdmin.api;
  });

  test('DASHBOARD endpoint', async () => {
    const res = await adminApi!.get(API_ENDPOINTS.DASHBOARD.STATS);
    expectImplementedEndpoint(res, 'DASHBOARD.STATS');
    expect(res.ok(), 'DASHBOARD.STATS should return 2xx').toBeTruthy();
  });

  test('CATEGORIES endpoints CRUD', async () => {
    const listRes = await adminApi!.get(API_ENDPOINTS.CATEGORIES.LIST);
    expectImplementedEndpoint(listRes, 'CATEGORIES.LIST');
    expect(listRes.ok()).toBeTruthy();

    const categoryPayload = buildCategoryPayload('cms-contract');
    const createRes = await adminApi!.post(API_ENDPOINTS.CATEGORIES.CREATE, {
      data: categoryPayload,
    });
    expectImplementedEndpoint(createRes, 'CATEGORIES.CREATE');
    expect(createRes.ok(), 'CATEGORIES.CREATE should return 2xx').toBeTruthy();

    const createdCategory = unwrapData<{ id: number }>(await readJson(createRes));
    cleanup!.registerCategory(createdCategory?.id);

    const getRes = await adminApi!.get(API_ENDPOINTS.CATEGORIES.GET(createdCategory.id));
    expectImplementedEndpoint(getRes, 'CATEGORIES.GET');
    expect(getRes.ok()).toBeTruthy();

    const updateRes = await adminApi!.put(API_ENDPOINTS.CATEGORIES.UPDATE(createdCategory.id), {
      data: { name: `${categoryPayload.name} Updated` },
    });
    expectImplementedEndpoint(updateRes, 'CATEGORIES.UPDATE');
    expect(updateRes.ok()).toBeTruthy();

    const deleteRes = await adminApi!.delete(API_ENDPOINTS.CATEGORIES.DELETE(createdCategory.id));
    expectImplementedEndpoint(deleteRes, 'CATEGORIES.DELETE');
    expect([200, 204]).toContain(deleteRes.status());
  });

  test('PRODUCTS endpoints CRUD + uploads + bulk delete', async () => {
    const categoryPayload = buildCategoryPayload('cms-product');
    const categoryRes = await adminApi!.post(API_ENDPOINTS.CATEGORIES.CREATE, {
      data: categoryPayload,
    });
    expectImplementedEndpoint(categoryRes, 'CATEGORIES.CREATE for product');
    expect(categoryRes.ok()).toBeTruthy();
    const category = unwrapData<{ id: number }>(await readJson(categoryRes));
    cleanup!.registerCategory(category?.id);

    const listRes = await adminApi!.get(API_ENDPOINTS.PRODUCTS.LIST);
    expectImplementedEndpoint(listRes, 'PRODUCTS.LIST');
    expect(listRes.ok()).toBeTruthy();

    const productPayload = buildProductPayload(category.id, 'cms-contract');
    const createRes = await adminApi!.post(API_ENDPOINTS.PRODUCTS.CREATE, {
      data: productPayload,
    });
    expectImplementedEndpoint(createRes, 'PRODUCTS.CREATE');
    expect(createRes.ok()).toBeTruthy();

    const created = unwrapData<{ id: number }>(await readJson(createRes));
    cleanup!.registerProduct(created?.id);

    const getRes = await adminApi!.get(API_ENDPOINTS.PRODUCTS.GET(created.id));
    expectImplementedEndpoint(getRes, 'PRODUCTS.GET');
    expect(getRes.ok()).toBeTruthy();

    const updateRes = await adminApi!.put(API_ENDPOINTS.PRODUCTS.UPDATE(created.id), {
      data: {
        name: `${productPayload.name} Updated`,
        price: productPayload.price + 1,
      },
    });
    expectImplementedEndpoint(updateRes, 'PRODUCTS.UPDATE');
    expect(updateRes.ok()).toBeTruthy();

    const uploadByUrlRes = await adminApi!.post(API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGES(created.id), {
      data: { url: 'https://example.com/e2e-image.png', is_primary: true },
    });
    expectImplementedEndpoint(uploadByUrlRes, 'PRODUCTS.UPLOAD_IMAGES');
    expect(uploadByUrlRes.status()).toBeLessThan(500);

    const uploadedProduct = unwrapData<{ images?: Array<{ id?: number }> }>(await readJson(uploadByUrlRes));
    const imageId = uploadedProduct?.images?.[0]?.id;
    if (imageId) {
      const deleteImageRes = await adminApi!.delete(API_ENDPOINTS.PRODUCTS.DELETE_IMAGE(created.id, imageId));
      expectImplementedEndpoint(deleteImageRes, 'PRODUCTS.DELETE_IMAGE');
      expect([200, 204]).toContain(deleteImageRes.status());
    }

    const secondPayload = buildProductPayload(category.id, 'cms-bulk');
    const secondCreateRes = await adminApi!.post(API_ENDPOINTS.PRODUCTS.CREATE, {
      data: secondPayload,
    });
    expectImplementedEndpoint(secondCreateRes, 'PRODUCTS.CREATE (bulk)');
    expect(secondCreateRes.ok()).toBeTruthy();
    const second = unwrapData<{ id: number }>(await readJson(secondCreateRes));

    const bulkDeleteRes = await adminApi!.post(API_ENDPOINTS.PRODUCTS.BULK_DELETE, {
      data: { ids: [second.id] },
    });
    expectImplementedEndpoint(bulkDeleteRes, 'PRODUCTS.BULK_DELETE');
    expect([200, 204]).toContain(bulkDeleteRes.status());
  });

  test('ORDERS endpoints list/get/update-status/stats', async () => {
    const listRes = await adminApi!.get(API_ENDPOINTS.ORDERS.LIST);
    expectImplementedEndpoint(listRes, 'ORDERS.LIST');
    expect(listRes.ok()).toBeTruthy();

    const statsRes = await adminApi!.get(API_ENDPOINTS.ORDERS.STATS);
    expectImplementedEndpoint(statsRes, 'ORDERS.STATS');
    expect(statsRes.status()).toBeLessThan(500);

    const targetOrderId = firstOrderId ?? 99999999;
    const getRes = await adminApi!.get(API_ENDPOINTS.ORDERS.GET(targetOrderId));
    expectEndpointReachable(getRes, 'ORDERS.GET');

    const orderBody = unwrapData<{ status?: string }>(await readJson(getRes));
    const currentStatus = orderBody?.status || 'pending';

    const updateRes = await adminApi!.put(API_ENDPOINTS.ORDERS.UPDATE_STATUS(targetOrderId), {
      data: {
        status: currentStatus,
        notes: firstOrderId ? 'E2E no-op update' : 'E2E endpoint reachability check',
      },
    });
    expectEndpointReachable(updateRes, 'ORDERS.UPDATE_STATUS');
  });

  test('CUSTOMERS endpoints list/get/orders', async () => {
    const listRes = await adminApi!.get(API_ENDPOINTS.CUSTOMERS.LIST);
    expectImplementedEndpoint(listRes, 'CUSTOMERS.LIST');
    expect(listRes.ok()).toBeTruthy();

    const targetCustomerId = firstCustomerId ?? 99999999;

    const getRes = await adminApi!.get(API_ENDPOINTS.CUSTOMERS.GET(targetCustomerId));
    expectEndpointReachable(getRes, 'CUSTOMERS.GET');

    const ordersRes = await adminApi!.get(API_ENDPOINTS.CUSTOMERS.ORDERS(targetCustomerId));
    expectEndpointReachable(ordersRes, 'CUSTOMERS.ORDERS');
  });

  test('REPORTS endpoints sales/products/customers/export', async () => {
    const salesRes = await adminApi!.get(API_ENDPOINTS.REPORTS.SALES, {
      params: { startDate: '2026-01-01', endDate: '2026-12-31' },
    });
    expectImplementedEndpoint(salesRes, 'REPORTS.SALES');
    expect(salesRes.status()).toBeLessThan(500);

    const productsRes = await adminApi!.get(API_ENDPOINTS.REPORTS.PRODUCTS, {
      params: { limit: 5 },
    });
    expectImplementedEndpoint(productsRes, 'REPORTS.PRODUCTS');
    expect(productsRes.status()).toBeLessThan(500);

    const customersRes = await adminApi!.get(API_ENDPOINTS.REPORTS.CUSTOMERS, {
      params: { startDate: '2026-01-01', endDate: '2026-12-31' },
    });
    expectImplementedEndpoint(customersRes, 'REPORTS.CUSTOMERS');
    expect(customersRes.status()).toBeLessThan(500);

    const exportRes = await adminApi!.get(API_ENDPOINTS.REPORTS.EXPORT, {
      params: { type: 'sales', format: 'csv' },
    });
    expectImplementedEndpoint(exportRes, 'REPORTS.EXPORT');
    expect(exportRes.status()).toBeLessThan(500);
  });

  test('SETTINGS endpoints (read + update variants)', async () => {
    const listRes = await adminApi!.get(API_ENDPOINTS.SETTINGS.GET);
    expectImplementedEndpoint(listRes, 'SETTINGS.GET');
    expect(listRes.ok()).toBeTruthy();

    const generalRes = await adminApi!.get(API_ENDPOINTS.SETTINGS.GENERAL);
    expectImplementedEndpoint(generalRes, 'SETTINGS.GENERAL');
    expect(generalRes.status()).toBeLessThan(500);

    const shippingRes = await adminApi!.get(API_ENDPOINTS.SETTINGS.SHIPPING);
    expectImplementedEndpoint(shippingRes, 'SETTINGS.SHIPPING');
    expect(shippingRes.status()).toBeLessThan(500);

    const paymentRes = await adminApi!.get(API_ENDPOINTS.SETTINGS.PAYMENT);
    expectImplementedEndpoint(paymentRes, 'SETTINGS.PAYMENT');
    expect(paymentRes.status()).toBeLessThan(500);

    const key = `e2e_contract_${uniqueSuffix('settings')}`;
    const updateRootRes = await adminApi!.put(API_ENDPOINTS.SETTINGS.UPDATE, {
      data: {
        settings: {
          [key]: '1',
        },
      },
    });
    expectImplementedEndpoint(updateRootRes, 'SETTINGS.UPDATE');
    expect(updateRootRes.status()).toBeLessThan(500);

    const updateByGroupRes = await adminApi!.put(`${API_ENDPOINTS.SETTINGS.GET}/general`, {
      data: {
        settings: {
          [key]: '2',
        },
      },
    });
    expectImplementedEndpoint(updateByGroupRes, 'SETTINGS.UPDATE_GROUP (CMS usage)');
    expect(updateByGroupRes.status()).toBeLessThan(500);
  });

  test('SHIPPING endpoints list/create/track/rates/available-orders', async () => {
    const listRes = await adminApi!.get(API_ENDPOINTS.SHIPPING.LIST);
    expectImplementedEndpoint(listRes, 'SHIPPING.LIST');
    expect(listRes.status()).toBeLessThan(500);

    const ratesRes = await adminApi!.get(API_ENDPOINTS.SHIPPING.RATES);
    expectImplementedEndpoint(ratesRes, 'SHIPPING.RATES');
    expect(ratesRes.status()).toBeLessThan(500);

    const availableOrdersRes = await adminApi!.get(`${API_ENDPOINTS.SHIPPING.LIST}/available-orders`);
    expectImplementedEndpoint(availableOrdersRes, 'SHIPPING.AVAILABLE_ORDERS (CMS usage)');
    expect(availableOrdersRes.status()).toBeLessThan(500);

    const createPayload = {
      order_id: firstOrderId || 99999999,
      carrier: 'andreani',
    };
    const createRes = await adminApi!.post(API_ENDPOINTS.SHIPPING.CREATE, {
      data: createPayload,
    });
    expectImplementedEndpoint(createRes, 'SHIPPING.CREATE');
    expect(createRes.status()).toBeLessThan(500);

    const createdShipment = unwrapData<{ id?: number }>(await readJson(createRes));
    const trackingId = createdShipment?.id || 1;

    const trackingRes = await adminApi!.get(API_ENDPOINTS.SHIPPING.TRACK(trackingId));
    expectEndpointReachable(trackingRes, 'SHIPPING.TRACK');
    expect(trackingRes.status()).toBeLessThan(500);
  });

  test('UPLOAD endpoints image/images', async () => {
    const png = buildTinyPng();

    const uploadImageRes = await adminApi!.post(API_ENDPOINTS.UPLOAD.IMAGE, {
      multipart: {
        image: {
          name: 'e2e-upload.png',
          mimeType: 'image/png',
          buffer: png,
        },
      },
    });
    expectImplementedEndpoint(uploadImageRes, 'UPLOAD.IMAGE');
    expect(uploadImageRes.status()).toBeLessThan(500);

    const uploadImagesRes = await adminApi!.post(API_ENDPOINTS.UPLOAD.IMAGES, {
      multipart: {
        'images[0]': {
          name: 'e2e-upload-0.png',
          mimeType: 'image/png',
          buffer: png,
        },
      },
    });
    expectImplementedEndpoint(uploadImagesRes, 'UPLOAD.IMAGES');
    expect(uploadImagesRes.status()).toBeLessThan(500);
  });

  test('baseline resources remain reachable after contract run', async () => {
    const productsRes = await adminApi!.get(API_ENDPOINTS.PRODUCTS.LIST);
    const categoriesRes = await adminApi!.get(API_ENDPOINTS.CATEGORIES.LIST);

    expect(productsRes.status()).toBeLessThan(500);
    expect(categoriesRes.status()).toBeLessThan(500);

    const productList = unwrapList<{ id: number }>(await readJson(productsRes));
    const categoryList = unwrapList<{ id: number }>(await readJson(categoriesRes));
    expect(productList.length).toBeGreaterThan(0);
    expect(categoryList.length).toBeGreaterThan(0);
  });
});


