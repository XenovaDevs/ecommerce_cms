import { z } from 'zod'

/**
 * Base product validation schema
 * Follows Single Responsibility Principle - handles only validation logic
 */
const baseProductSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede exceder 255 caracteres'),

  slug: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(val),
      'El slug debe contener solo letras minúsculas, números y guiones'
    ),

  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(10, 'La descripción debe tener al menos 10 caracteres'),

  short_description: z
    .string()
    .max(500, 'La descripción corta no puede exceder 500 caracteres')
    .optional(),

  price: z
    .number({
      required_error: 'El precio es requerido',
      invalid_type_error: 'El precio debe ser un número',
    })
    .positive('El precio debe ser mayor a 0')
    .max(999999.99, 'El precio es demasiado alto'),

  sale_price: z
    .number()
    .positive('El precio de oferta debe ser mayor a 0')
    .optional()
    .nullable(),

  compare_at_price: z
    .number()
    .positive('El precio de comparación debe ser mayor a 0')
    .optional()
    .nullable(),

  cost_price: z
    .number()
    .positive('El costo debe ser mayor a 0')
    .optional()
    .nullable(),

  sku: z
    .string()
    .max(100, 'El SKU no puede exceder 100 caracteres')
    .optional()
    .nullable(),

  barcode: z
    .string()
    .max(100, 'El código de barras no puede exceder 100 caracteres')
    .optional()
    .nullable(),

  stock: z
    .number({
      required_error: 'El stock es requerido',
      invalid_type_error: 'El stock debe ser un número',
    })
    .int('El stock debe ser un número entero')
    .min(0, 'El stock no puede ser negativo'),

  low_stock_threshold: z
    .number()
    .int('El umbral debe ser un número entero')
    .min(0, 'El umbral no puede ser negativo')
    .optional()
    .nullable(),

  category_id: z
    .number()
    .int('El ID de categoría debe ser un número entero')
    .positive('El ID de categoría debe ser positivo')
    .optional()
    .nullable(),

  is_featured: z.boolean().optional().default(false),

  is_active: z.boolean().optional().default(true),

  track_stock: z.boolean().optional().default(true),

  weight: z
    .number()
    .positive('El peso debe ser mayor a 0')
    .optional()
    .nullable(),
})

/**
 * Product creation schema with cross-field validations
 * Validates business rules like sale_price < price
 */
export const createProductSchema = baseProductSchema.refine(
  (data) => {
    if (data.sale_price && data.sale_price >= data.price) {
      return false
    }
    return true
  },
  {
    message: 'El precio de oferta debe ser menor al precio regular',
    path: ['sale_price'],
  }
).refine(
  (data) => {
    if (data.cost_price && data.cost_price >= data.price) {
      return false
    }
    return true
  },
  {
    message: 'El costo debe ser menor al precio de venta',
    path: ['cost_price'],
  }
)

/**
 * Product update schema - all fields optional except validations
 * Allows partial updates following Open/Closed Principle
 */
export const updateProductSchema = baseProductSchema.partial().refine(
  (data) => {
    if (data.sale_price && data.price && data.sale_price >= data.price) {
      return false
    }
    return true
  },
  {
    message: 'El precio de oferta debe ser menor al precio regular',
    path: ['sale_price'],
  }
)

/**
 * Type inference for forms
 */
export type ProductFormInput = z.infer<typeof createProductSchema>
export type ProductUpdateInput = z.infer<typeof updateProductSchema>

/**
 * Helper function to generate slug from name
 * Single Responsibility - handles only slug generation
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

/**
 * Validate if stock is low based on threshold
 */
export function isLowStock(stock: number, threshold?: number | null): boolean {
  if (!threshold) return false
  return stock <= threshold && stock > 0
}

/**
 * Validate if product is out of stock
 */
export function isOutOfStock(stock: number): boolean {
  return stock === 0
}
