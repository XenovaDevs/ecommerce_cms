/**
 * Application constants
 */

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Le Pas Sage CMS'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1'

/**
 * Token storage keys
 */
export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'access_token',
} as const

/**
 * Order status options
 */
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
} as const

export const ORDER_STATUS_LABELS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.PROCESSING]: 'En Proceso',
  [ORDER_STATUS.SHIPPED]: 'Enviado',
  [ORDER_STATUS.DELIVERED]: 'Entregado',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
  [ORDER_STATUS.REFUNDED]: 'Reembolsado',
}

export const ORDER_STATUS_COLORS: Record<string, string> = {
  [ORDER_STATUS.PENDING]: 'yellow',
  [ORDER_STATUS.CONFIRMED]: 'cyan',
  [ORDER_STATUS.PROCESSING]: 'blue',
  [ORDER_STATUS.SHIPPED]: 'purple',
  [ORDER_STATUS.DELIVERED]: 'green',
  [ORDER_STATUS.CANCELLED]: 'red',
  [ORDER_STATUS.REFUNDED]: 'gray',
}

/**
 * Payment status options
 */
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PAID: 'paid',
  APPROVED: 'approved',
  FAILED: 'failed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
} as const

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: 'Pendiente',
  [PAYMENT_STATUS.PROCESSING]: 'Procesando',
  [PAYMENT_STATUS.PAID]: 'Pagado',
  [PAYMENT_STATUS.APPROVED]: 'Aprobado',
  [PAYMENT_STATUS.FAILED]: 'Fallido',
  [PAYMENT_STATUS.REJECTED]: 'Rechazado',
  [PAYMENT_STATUS.CANCELLED]: 'Cancelado',
  [PAYMENT_STATUS.REFUNDED]: 'Reembolsado',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'Reembolsado Parcial',
}

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  [PAYMENT_STATUS.PENDING]: 'yellow',
  [PAYMENT_STATUS.PROCESSING]: 'blue',
  [PAYMENT_STATUS.PAID]: 'green',
  [PAYMENT_STATUS.APPROVED]: 'green',
  [PAYMENT_STATUS.FAILED]: 'red',
  [PAYMENT_STATUS.REJECTED]: 'red',
  [PAYMENT_STATUS.CANCELLED]: 'gray',
  [PAYMENT_STATUS.REFUNDED]: 'purple',
  [PAYMENT_STATUS.PARTIALLY_REFUNDED]: 'purple',
}

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 15,
  PER_PAGE_OPTIONS: [10, 15, 25, 50, 100],
} as const

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'],
  ACCEPTED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
} as const

/**
 * Date format options
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
  API_WITH_TIME: "yyyy-MM-dd'T'HH:mm:ss",
} as const

/**
 * React Query defaults
 */
export const QUERY_CONFIG = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
  RETRY: 1,
} as const

/**
 * Toast notification duration
 */
export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  INFO: 3000,
  WARNING: 4000,
} as const
