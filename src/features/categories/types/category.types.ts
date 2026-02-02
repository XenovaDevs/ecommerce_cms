/**
 * Category domain types
 *
 * Defines the structure and contracts for category entities.
 * Follows Single Responsibility Principle - only contains type definitions.
 */

/**
 * Core category entity
 */
export interface Category {
  id: number
  name: string
  slug: string
  description: string
  image?: string
  parent_id: number | null
  position: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Extended category with relationships
 */
export interface CategoryWithRelations extends Category {
  parent?: Category | null
  children?: Category[]
  products_count?: number
}

/**
 * Form data for creating/updating categories
 * Excludes auto-generated fields (id, timestamps)
 */
export interface CategoryFormData {
  name: string
  slug: string
  description: string
  image?: string
  parent_id: number | null
  is_active: boolean
}

/**
 * Filter parameters for category list queries
 */
export interface CategoryFilters {
  search?: string
  parent_id?: number | null
  is_active?: boolean
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

/**
 * Category tree node for hierarchical display
 */
export interface CategoryTreeNode extends Category {
  children: CategoryTreeNode[]
  level: number
  hasChildren: boolean
}
