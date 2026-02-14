# Playwright E2E - CMS

## Scope

- CMS UI routes on `http://localhost:3001`
- CMS-consumed API endpoints on `http://localhost:8000/api/v1`
- Auth/guard behavior for admin panel

## Required env

Defaults are aligned with seeded local data:

- `E2E_CMS_BASE_URL=http://localhost:3001`
- `E2E_API_BASE_URL=http://localhost:8000/api/v1`
- `E2E_ADMIN_EMAIL=superadmin@example.com`
- `E2E_ADMIN_PASSWORD=password`
- `E2E_CUSTOMER_EMAIL=customer@example.com`
- `E2E_CUSTOMER_PASSWORD=password`
- `E2E_STRICT_API=true`
- `E2E_WORKERS=1` (default; increase only if your API auth rate-limit allows parallel logins)

## Commands

```bash
pnpm run test:e2e:list
pnpm run test:e2e
pnpm run test:e2e:headed
pnpm run test:e2e:ui
pnpm run test:e2e:report
```
