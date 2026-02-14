import { useQuery } from '@tanstack/react-query'
import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'

/**
 * Category interface for product forms
 */
interface Category {
  id: number
  name: string
  slug: string
}

/**
 * Hook to fetch categories for product forms
 * Single Responsibility: Only handles category data fetching
 */
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await apiClient.get<Category[] | { data?: Category[] }>(
        API_ENDPOINTS.CATEGORIES.LIST,
        { params: { per_page: 100 } } // Get all categories
      )
      if (Array.isArray(data)) {
        return data
      }
      return data.data ?? []
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
