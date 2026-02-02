import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { Product, ProductFormData, ProductFilters } from '../types/product.types'
import { PaginatedResponse } from '@/types/api.types'

export const productService = {
  async list(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const { data } = await apiClient.get<PaginatedResponse<Product>>(
      API_ENDPOINTS.PRODUCTS.LIST,
      { params: filters }
    )
    return data
  },

  async get(id: number): Promise<Product> {
    const { data } = await apiClient.get<Product>(API_ENDPOINTS.PRODUCTS.GET(id))
    return data
  },

  async create(productData: ProductFormData): Promise<Product> {
    const { data } = await apiClient.post<Product>(API_ENDPOINTS.PRODUCTS.CREATE, productData)
    return data
  },

  async update(id: number, productData: Partial<ProductFormData>): Promise<Product> {
    const { data } = await apiClient.put<Product>(API_ENDPOINTS.PRODUCTS.UPDATE(id), productData)
    return data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE(id))
  },

  async bulkDelete(ids: number[]): Promise<void> {
    await apiClient.post(API_ENDPOINTS.PRODUCTS.BULK_DELETE, { ids })
  },
}
