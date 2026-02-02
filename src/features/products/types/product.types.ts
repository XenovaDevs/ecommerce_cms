export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  compare_at_price?: number
  cost_price?: number
  sku?: string
  barcode?: string
  stock: number
  low_stock_threshold?: number
  category_id?: number
  category?: {
    id: number
    name: string
  }
  images: ProductImage[]
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  url: string
  alt?: string
  position: number
}

export interface ProductFormData {
  name: string
  slug?: string
  description: string
  short_description?: string
  price: number
  sale_price?: number | null
  compare_at_price?: number | null
  cost_price?: number | null
  sku?: string | null
  barcode?: string | null
  stock: number
  low_stock_threshold?: number | null
  category_id?: number | null
  is_active: boolean
  is_featured: boolean
  track_stock?: boolean
  weight?: number | null
}

export interface ProductFilters {
  search?: string
  category_id?: number
  is_active?: boolean
  is_featured?: boolean
  stock_filter?: 'all' | 'in-stock' | 'low' | 'out'
  page?: number
  per_page?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
