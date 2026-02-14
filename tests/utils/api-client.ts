import { expect, type APIRequest, type APIRequestContext, type APIResponse } from '@playwright/test';
import { API_ENDPOINTS } from '../../src/services/apiEndpoints';
import { E2E_ENV } from './env';

type AnyJson = Record<string, any>;
type RequestOptions = Parameters<APIRequestContext['get']>[1];

export interface ApiClient {
  get: (endpoint: string, options?: RequestOptions) => Promise<APIResponse>;
  post: (endpoint: string, options?: RequestOptions) => Promise<APIResponse>;
  put: (endpoint: string, options?: RequestOptions) => Promise<APIResponse>;
  patch: (endpoint: string, options?: RequestOptions) => Promise<APIResponse>;
  delete: (endpoint: string, options?: RequestOptions) => Promise<APIResponse>;
  dispose: () => Promise<void>;
}

export async function readJson(response: APIResponse): Promise<AnyJson> {
  return response.json().catch(() => ({}));
}

export function unwrapData<T>(payload: AnyJson | undefined): T {
  if (!payload) {
    return [] as unknown as T;
  }
  return (payload.data ?? payload) as T;
}

export function unwrapList<T>(payload: AnyJson | undefined): T[] {
  const unwrapped = unwrapData<any>(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }
  if (Array.isArray(unwrapped?.data)) {
    return unwrapped.data;
  }
  return [];
}

function buildApiUrl(endpoint: string): string {
  if (/^https?:\/\//i.test(endpoint)) {
    return endpoint;
  }
  const base = E2E_ENV.apiBaseUrl.replace(/\/+$/, '');
  const path = endpoint.replace(/^\/+/, '');
  return `${base}/${path}`;
}

function wrapContext(raw: APIRequestContext): ApiClient {
  return {
    get: (endpoint, options) => raw.get(buildApiUrl(endpoint), options),
    post: (endpoint, options) => raw.post(buildApiUrl(endpoint), options),
    put: (endpoint, options) => raw.put(buildApiUrl(endpoint), options),
    patch: (endpoint, options) => raw.patch(buildApiUrl(endpoint), options),
    delete: (endpoint, options) => raw.delete(buildApiUrl(endpoint), options),
    dispose: () => raw.dispose(),
  };
}

export async function newApiContext(base: APIRequest, token?: string): Promise<ApiClient> {
  const raw = await base.newContext({
    ignoreHTTPSErrors: true,
    extraHTTPHeaders: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return wrapContext(raw);
}

export async function loginByApi(
  base: APIRequest,
  email = E2E_ENV.adminEmail,
  password = E2E_ENV.adminPassword
): Promise<{ token: string; body: AnyJson; context: ApiClient }> {
  const api = await newApiContext(base);
  let res: APIResponse | null = null;

  for (let attempt = 1; attempt <= 5; attempt++) {
    res = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      data: { email, password },
    });
    if (res.ok()) {
      break;
    }

    if (res.status() === 429 && attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
      continue;
    }

    break;
  }

  expect(res && res.ok(), `login failed for ${email}`).toBeTruthy();
  const body = await readJson(res!);
  const token = body?.data?.access_token ?? body?.access_token;
  expect(token, 'access token missing from login response').toBeTruthy();

  return {
    token,
    body,
    context: api,
  };
}

export async function loginAsAdmin(base: APIRequest): Promise<{ token: string; api: ApiClient }> {
  const auth = await loginByApi(base, E2E_ENV.adminEmail, E2E_ENV.adminPassword);
  const api = await newApiContext(base, auth.token);
  await auth.context.dispose();
  return { token: auth.token, api };
}

export async function getFirstProductId(api: ApiClient): Promise<number | null> {
  const res = await api.get(API_ENDPOINTS.PRODUCTS.LIST);
  if (!res.ok()) {
    return null;
  }
  const list = unwrapList<{ id: number }>(await readJson(res));
  return list[0]?.id ?? null;
}

export async function getFirstOrderId(api: ApiClient): Promise<number | null> {
  const res = await api.get(API_ENDPOINTS.ORDERS.LIST);
  if (!res.ok()) {
    return null;
  }
  const list = unwrapList<{ id: number }>(await readJson(res));
  return list[0]?.id ?? null;
}

export async function getFirstCustomerId(api: ApiClient): Promise<number | null> {
  const res = await api.get(API_ENDPOINTS.CUSTOMERS.LIST);
  if (!res.ok()) {
    return null;
  }
  const list = unwrapList<{ id: number }>(await readJson(res));
  return list[0]?.id ?? null;
}

export async function getFirstCategoryId(api: ApiClient): Promise<number | null> {
  const res = await api.get(API_ENDPOINTS.CATEGORIES.LIST);
  if (!res.ok()) {
    return null;
  }
  const list = unwrapList<{ id: number }>(await readJson(res));
  return list[0]?.id ?? null;
}

export function expectImplementedEndpoint(response: APIResponse, endpointName: string): void {
  expect.soft(response.status(), `${endpointName} should not return 404`).not.toBe(404);
  expect.soft(response.status(), `${endpointName} should not return 405`).not.toBe(405);
  expect.soft(response.status(), `${endpointName} should not return 5xx`).toBeLessThan(500);
}

export { API_ENDPOINTS };
