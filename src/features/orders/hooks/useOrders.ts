import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/order.service'
import { OrderFilters } from '../types/order.types'

/**
 * Hook for fetching paginated list of orders
 * Implements query caching and automatic refetching
 */
export function useOrders(filters?: OrderFilters) {
  return useQuery({
    queryKey: ['orders', filters],
    queryFn: () => orderService.list(filters),
    staleTime: 3 * 60 * 1000, // 3 minutes - orders change more frequently than products
  })
}
