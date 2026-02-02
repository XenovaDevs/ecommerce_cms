import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../services/order.service'
import { UpdateOrderStatusPayload } from '../types/order.types'
import toast from 'react-hot-toast'

/**
 * Hook for updating order status
 * Automatically invalidates relevant queries after successful update
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateOrderStatusPayload }) =>
      orderService.updateStatus(id, payload),
    onSuccess: (updatedOrder) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      queryClient.invalidateQueries({ queryKey: ['orders', updatedOrder.id] })

      toast.success('Order status updated successfully')
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update order status')
    },
  })
}
