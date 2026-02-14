export const E2E_ENV = Object.freeze({
  cmsBaseUrl: process.env.E2E_CMS_BASE_URL || 'http://localhost:3001',
  apiBaseUrl: process.env.E2E_API_BASE_URL || 'http://localhost:8000/api/v1',
  adminEmail: process.env.E2E_ADMIN_EMAIL || 'superadmin@example.com',
  adminPassword: process.env.E2E_ADMIN_PASSWORD || 'password',
  customerEmail: process.env.E2E_CUSTOMER_EMAIL || 'customer@example.com',
  customerPassword: process.env.E2E_CUSTOMER_PASSWORD || 'password',
  strictApi: process.env.E2E_STRICT_API !== 'false',
});

