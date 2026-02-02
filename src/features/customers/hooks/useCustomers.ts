/**
 * useCustomers Hook
 * Single Responsibility: Manage customer list state and operations
 * Custom hook for reusable customer list logic
 */

import { useQuery } from '@tanstack/react-query';
import { customerService } from '../services/customer.service';
import { CustomerFilters } from '../types/customer.types';

/**
 * Hook for fetching and managing customer list
 * Encapsulates customer list fetching logic and state
 */
export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: ['customers', filters],
    queryFn: () => customerService.list(filters),
    staleTime: 30000, // 30 seconds
    gcTime: 300000, // 5 minutes
  });
}
