export const STATIC_PROTECTED_ROUTES: Array<{ path: string; heading: RegExp }> = [
  { path: '/dashboard', heading: /dashboard/i },
  { path: '/products', heading: /productos/i },
  { path: '/products/create', heading: /crear producto/i },
  { path: '/categories', heading: /categor/i },
  { path: '/orders', heading: /orders/i },
  { path: '/customers', heading: /clientes/i },
  { path: '/shipping', heading: /shipping management/i },
  { path: '/reports', heading: /reports/i },
  { path: '/settings', heading: /settings/i },
];

export const PUBLIC_ROUTES: Array<{ path: string; heading: RegExp }> = [
  { path: '/login', heading: /panel de administraci/i },
];

export const GUARDED_ROUTES = [
  '/dashboard',
  '/products',
  '/categories',
  '/orders',
  '/customers',
  '/shipping',
  '/reports',
  '/settings',
];

