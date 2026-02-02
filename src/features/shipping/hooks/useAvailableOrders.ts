/**
 * useAvailableOrders Hook
 *
 * Custom hook for fetching orders available for shipment creation.
 * Follows SRP: Single responsibility for available orders data.
 */

import { useQuery } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';
import { shipmentKeys } from './useShipments';
import type { OrderForShipment } from '../types/shipping.types';

/**
 * Hook return type
 */
interface UseAvailableOrdersReturn {
  orders: OrderForShipment[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch orders available for shipment creation
 * Returns only orders that don't have a shipment yet
 *
 * @returns Available orders and query state
 *
 * @example
 * ```tsx
 * const { orders, isLoading } = useAvailableOrders();
 * ```
 */
export function useAvailableOrders(): UseAvailableOrdersReturn {
  const query = useQuery({
    queryKey: shipmentKeys.availableOrders(),
    queryFn: () => shippingService.getAvailableOrders(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false, // Don't retry if endpoint doesn't exist
  });

  return {
    orders: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
