import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/product.service'
import { ProductFilters } from '../types/product.types'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.list(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.get(id),
    enabled: !!id,
  })
}
