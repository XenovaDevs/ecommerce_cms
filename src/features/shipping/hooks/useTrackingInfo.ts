/**
 * useTrackingInfo Hook
 *
 * Custom hook for fetching shipment tracking information.
 * Follows SRP: Single responsibility for tracking data management.
 */

import { useQuery } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';
import { shipmentKeys } from './useShipments';
import type { TrackingInfo } from '../types/shipping.types';
import { parseErrorMessage } from '@/lib/utils';

/**
 * Hook configuration options
 */
interface UseTrackingInfoOptions {
  shipmentId: number | null;
  enabled?: boolean;
}

/**
 * Hook return type
 */
interface UseTrackingInfoReturn {
  trackingInfo: TrackingInfo | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Custom hook to fetch tracking information for a shipment
 *
 * @param options - Configuration with shipment ID and query behavior
 * @returns Tracking data and query state
 *
 * @example
 * ```tsx
 * const { trackingInfo, isLoading } = useTrackingInfo({
 *   shipmentId: 123
 * });
 * ```
 */
export function useTrackingInfo(
  options: UseTrackingInfoOptions
): UseTrackingInfoReturn {
  const { shipmentId, enabled = true } = options;

  const query = useQuery<TrackingInfo, Error>({
    queryKey: shipmentKeys.tracking(shipmentId!),
    queryFn: () => shippingService.track(shipmentId!),
    enabled: enabled && shipmentId !== null,
    staleTime: 1000 * 60 * 2, // 2 minutes (tracking info updates frequently)
    retry: (failureCount, error: unknown) => {
      const message = parseErrorMessage(error);
      if (message.includes('not available')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  return {
    trackingInfo: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
