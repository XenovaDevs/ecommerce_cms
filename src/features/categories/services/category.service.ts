/**
 * Category Service
 *
 * Implements the Repository pattern for category data access.
 * Provides a clean abstraction over the HTTP API.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for category data operations
 * - Delegates HTTP concerns to apiClient
 * - Returns domain types, not API responses
 *
 * Follows Dependency Inversion Principle:
 * - Depends on apiClient abstraction, not concrete HTTP library
 */

import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { Category, CategoryFormData, CategoryFilters } from '../types/category.types'

/**
 * Category service interface defining the contract
 * Follows Interface Segregation Principle - focused on category operations
 */
export interface ICategoryService {
  list(filters?: CategoryFilters): Promise<Category[]>
  get(id: number): Promise<Category>
  create(data: CategoryFormData): Promise<Category>
  update(id: number, data: Partial<CategoryFormData>): Promise<Category>
  delete(id: number): Promise<void>
}

/**
 * Concrete implementation of category service
 */
class CategoryService implements ICategoryService {
  /**
   * Retrieve all categories with optional filters
   */
  async list(filters?: CategoryFilters): Promise<Category[]> {
    const { data } = await apiClient.get<Category[]>(
      API_ENDPOINTS.CATEGORIES.LIST,
      { params: filters }
    )
    return data
  }

  /**
   * Retrieve a single category by ID
   */
  async get(id: number): Promise<Category> {
    const { data } = await apiClient.get<Category>(
      API_ENDPOINTS.CATEGORIES.GET(id)
    )
    return data
  }

  /**
   * Create a new category
   */
  async create(categoryData: CategoryFormData): Promise<Category> {
    const { data } = await apiClient.post<Category>(
      API_ENDPOINTS.CATEGORIES.CREATE,
      categoryData
    )
    return data
  }

  /**
   * Update an existing category
   */
  async update(id: number, categoryData: Partial<CategoryFormData>): Promise<Category> {
    const { data } = await apiClient.put<Category>(
      API_ENDPOINTS.CATEGORIES.UPDATE(id),
      categoryData
    )
    return data
  }

  /**
   * Delete a category
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id))
  }
}

/**
 * Singleton instance export
 * Allows easy mocking for tests while maintaining a single instance
 */
export const categoryService = new CategoryService()
