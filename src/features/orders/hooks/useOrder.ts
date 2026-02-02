import { useQuery } from '@tanstack/react-query'
import { orderService } from '../services/order.service'

/**
 * Hook for fetching a single order by ID
 * Includes status history and full details
 */
export function useOrder(id: number) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => orderService.get(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
