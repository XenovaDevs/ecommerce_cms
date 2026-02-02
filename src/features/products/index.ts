/**
 * Products Feature Exports
 *
 * Central export file following Interface Segregation Principle
 * Provides clean imports for consumers of the products feature
 */

// Pages
export { ProductsPage } from './pages/ProductsPage'
export { ProductCreatePage } from './pages/ProductCreatePage'
export { ProductEditPage } from './pages/ProductEditPage'

// Components
export { ProductForm } from './components/ProductForm'
export { ProductFilters } from './components/ProductFilters'
export { ImageUploader } from './components/ImageUploader'

// Hooks
export { useProducts, useProduct } from './hooks/useProducts'
export { useCreateProduct, useUpdateProduct, useDeleteProduct } from './hooks/useProductMutations'
export { useCategories } from './hooks/useCategories'

// Types
export type {
  Product,
  ProductImage,
  ProductFormData,
  ProductFilters as ProductFiltersType,
} from './types/product.types'

// Validation
export {
  createProductSchema,
  updateProductSchema,
  generateSlug,
  isLowStock,
  isOutOfStock,
  type ProductFormInput,
  type ProductUpdateInput,
} from './utils/productValidation'

// Services
export { productService } from './services/product.service'
