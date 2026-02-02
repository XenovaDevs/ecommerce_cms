/**
 * API endpoint constants for the CMS
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/admin/dashboard',
  },

  // Products
  PRODUCTS: {
    LIST: '/admin/products',
    CREATE: '/admin/products',
    GET: (id: number) => `/admin/products/${id}`,
    UPDATE: (id: number) => `/admin/products/${id}`,
    DELETE: (id: number) => `/admin/products/${id}`,
    BULK_DELETE: '/admin/products/bulk-delete',
    UPLOAD_IMAGES: (id: number) => `/admin/products/${id}/images`,
    DELETE_IMAGE: (productId: number, imageId: number) =>
      `/admin/products/${productId}/images/${imageId}`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/admin/categories',
    CREATE: '/admin/categories',
    GET: (id: number) => `/admin/categories/${id}`,
    UPDATE: (id: number) => `/admin/categories/${id}`,
    DELETE: (id: number) => `/admin/categories/${id}`,
  },

  // Orders
  ORDERS: {
    LIST: '/admin/orders',
    GET: (id: number) => `/admin/orders/${id}`,
    UPDATE_STATUS: (id: number) => `/admin/orders/${id}/status`,
    STATS: '/admin/orders/stats',
  },

  // Customers
  CUSTOMERS: {
    LIST: '/admin/customers',
    GET: (id: number) => `/admin/customers/${id}`,
    ORDERS: (id: number) => `/admin/customers/${id}/orders`,
  },

  // Shipping (Andreani)
  SHIPPING: {
    LIST: '/admin/shipping',
    CREATE: '/admin/shipping',
    TRACK: (id: number) => `/admin/shipping/${id}/track`,
    RATES: '/admin/shipping/rates',
  },

  // Reports
  REPORTS: {
    SALES: '/admin/reports/sales',
    PRODUCTS: '/admin/reports/products',
    CUSTOMERS: '/admin/reports/customers',
    EXPORT: '/admin/reports/export',
  },

  // Settings
  SETTINGS: {
    GET: '/admin/settings',
    UPDATE: '/admin/settings',
    GENERAL: '/admin/settings/general',
    SHIPPING: '/admin/settings/shipping',
    PAYMENT: '/admin/settings/payment',
  },

  // File Upload
  UPLOAD: {
    IMAGE: '/admin/upload/image',
    IMAGES: '/admin/upload/images',
  },
} as const

export default API_ENDPOINTS
