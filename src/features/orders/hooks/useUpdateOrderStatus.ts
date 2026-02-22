import { useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '../services/order.service'
import { UpdateOrderStatusPayload } from '../types/order.types'
import toast from 'react-hot-toast'
import { parseErrorMessage } from '@/lib/utils'

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
    onError: (error: unknown) => {
      const message = parseErrorMessage(error)
      toast.error(message === 'An unexpected error occurred' ? 'Failed to update order status' : message)
    },
  })
}
