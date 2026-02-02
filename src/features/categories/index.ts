/**
 * Categories Feature Public API
 *
 * Barrel export file following the Facade pattern.
 * Provides a clean public interface for the categories feature.
 *
 * Benefits:
 * - Single import point for consumers
 * - Hides internal implementation details
 * - Makes refactoring easier (change internals without affecting consumers)
 * - Enforces architectural boundaries
 */

// Types
export type {
  Category,
  CategoryWithRelations,
  CategoryFormData,
  CategoryFilters,
  CategoryTreeNode,
} from './types/category.types'

// Services
export { categoryService } from './services/category.service'
export type { ICategoryService } from './services/category.service'

// Hooks - Queries
export {
  useCategories,
  useCategory,
  useCategoriesTree,
  useCategoriesForParentSelect,
  categoryKeys,
} from './hooks/useCategories'

// Hooks - Mutations
export {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useCategoryMutations,
} from './hooks/useCategoryMutations'

// Components
export { CategoryList } from './components/CategoryList'
export { CategoryForm } from './components/CategoryForm'
export { CategoryModal } from './components/CategoryModal'

// Pages
export { default as CategoriesPage } from './pages/CategoriesPage'
