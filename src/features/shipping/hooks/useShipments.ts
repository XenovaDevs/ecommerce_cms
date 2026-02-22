/**
 * useShipments Hook
 *
 * Custom hook for fetching and managing shipments list.
 * Follows SRP: Single responsibility for shipments data fetching.
 * Uses React Query for caching and state management.
 */

import { useQuery } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';
import type { ShipmentListResponse } from '../types/shipping.types';
import { parseErrorMessage } from '@/lib/utils';

/**
 * Query key factory for shipments
 * Ensures consistent cache keys across the application
 */
export const shipmentKeys = {
  all: ['shipments'] as const,
  lists: () => [...shipmentKeys.all, 'list'] as const,
  list: (page: number, perPage: number) => [...shipmentKeys.lists(), { page, perPage }] as const,
  tracking: (id: number) => [...shipmentKeys.all, 'tracking', id] as const,
  availableOrders: () => [...shipmentKeys.all, 'available-orders'] as const,
};

/**
 * Hook configuration options
 */
interface UseShipmentsOptions {
  page?: number;
  perPage?: number;
  enabled?: boolean;
}

/**
 * Hook return type
 */
interface UseShipmentsReturn {
  shipments: ShipmentListResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch paginated shipments list
 *
 * @param options - Configuration options for pagination and query behavior
 * @returns Shipments data and query state
 *
 * @example
 * ```tsx
 * const { shipments, isLoading, error } = useShipments({ page: 1, perPage: 20 });
 * ```
 */
export function useShipments(options: UseShipmentsOptions = {}): UseShipmentsReturn {
  const { page = 1, perPage = 10, enabled = true } = options;

  const query = useQuery<ShipmentListResponse, Error>({
    queryKey: shipmentKeys.list(page, perPage),
    queryFn: () => shippingService.list(page, perPage),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry if endpoint doesn't exist (404)
      const message = parseErrorMessage(error);
      if (message.includes('not available yet')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    shipments: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
