/**
 * useCustomer Hook
 * Single Responsibility: Manage single customer detail state
 * Custom hook for reusable customer detail logic
 */

import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';

/**
 * Hook for fetching and managing single customer detail
 * Encapsulates customer detail fetching logic and state
 */
export function useCustomer(id: number | undefined) {
  return useQuery({
    queryKey: ['customer', id],
    queryFn: () => {
      if (!id) throw new Error('Customer ID is required');
      return customerService.get(id);
    },
    enabled: !!id,
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}
