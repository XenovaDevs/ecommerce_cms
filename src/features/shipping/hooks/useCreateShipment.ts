/**
 * useCreateShipment Hook
 *
 * Custom hook for creating new shipments.
 * Follows SRP: Single responsibility for shipment creation logic.
 * Handles mutation, cache invalidation, and success/error states.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { shippingService } from '../services/shipping.service';
import { shipmentKeys } from './useShipments';
import type { CreateShipmentData, Shipment } from '../types/shipping.types';

/**
 * Hook configuration options
 */
interface UseCreateShipmentOptions {
  onSuccess?: (shipment: Shipment) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook return type
 */
interface UseCreateShipmentReturn {
  createShipment: (data: CreateShipmentData) => void;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  reset: () => void;
}

/**
 * Custom hook to create a new shipment
 *
 * Automatically invalidates shipments cache on success
 * to trigger refetch of the shipments list.
 *
 * @param options - Callbacks for success and error handling
 * @returns Mutation function and state
 *
 * @example
 * ```tsx
 * const { createShipment, isLoading } = useCreateShipment({
 *   onSuccess: (shipment) => {
 *     toast.success(`Shipment created: ${shipment.tracking_number}`);
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   }
 * });
 *
 * createShipment({
 *   order_id: 123,
 *   shipping_address: { ... }
 * });
 * ```
 */
export function useCreateShipment(
  options: UseCreateShipmentOptions = {}
): UseCreateShipmentReturn {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateShipmentData) => shippingService.create(data),
    onSuccess: (shipment) => {
      // Invalidate shipments list to refetch with new data
      queryClient.invalidateQueries({ queryKey: shipmentKeys.lists() });

      // Invalidate available orders since one was just used
      queryClient.invalidateQueries({ queryKey: shipmentKeys.availableOrders() });

      // Call user-provided success callback
      options.onSuccess?.(shipment);
    },
    onError: (error: Error) => {
      // Call user-provided error callback
      options.onError?.(error);
    },
  });

  return {
    createShipment: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    reset: mutation.reset,
  };
}
