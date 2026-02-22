/**
 * Category Mutation Hooks
 *
 * Provides React Query hooks for category mutations (create, update, delete).
 *
 * Follows Single Responsibility Principle:
 * - Each hook handles one mutation type
 * - Delegates data operations to service layer
 * - Manages cache invalidation and user feedback
 *
 * Follows Dependency Inversion Principle:
 * - Depends on service abstraction, not implementation
 * - Depends on toast abstraction for notifications
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { categoryService } from '../services/category.service'
import { CategoryFormData } from '../types/category.types'
import { useToast } from '@/store/ToastContext'
import { categoryKeys } from './useCategories'
import { parseErrorMessage } from '@/lib/utils'

const getMutationErrorMessage = (error: unknown, fallback: string) => {
  const parsedMessage = parseErrorMessage(error)
  return parsedMessage === 'An unexpected error occurred' ? fallback : parsedMessage
}

/**
 * Hook for creating a new category
 *
 * Responsibilities:
 * - Execute create mutation
 * - Show success/error feedback
 * - Invalidate category cache
 */
export function useCreateCategory() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: CategoryFormData) => categoryService.create(data),
    onSuccess: () => {
      // Invalidate all category queries to refresh data
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      showToast('Categoría creada exitosamente', 'success')
    },
    onError: (error: unknown) => {
      const message = getMutationErrorMessage(error, 'Error al crear la categoría')
      showToast(message, 'error')
    },
  })
}

/**
 * Hook for updating an existing category
 *
 * Responsibilities:
 * - Execute update mutation
 * - Show success/error feedback
 * - Invalidate affected cache entries
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CategoryFormData> }) =>
      categoryService.update(id, data),
    onSuccess: (updatedCategory) => {
      // Invalidate list queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
      // Invalidate specific detail query
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(updatedCategory.id) })
      showToast('Categoría actualizada exitosamente', 'success')
    },
    onError: (error: unknown) => {
      const message = getMutationErrorMessage(error, 'Error al actualizar la categoría')
      showToast(message, 'error')
    },
  })
}

/**
 * Hook for deleting a category
 *
 * Responsibilities:
 * - Execute delete mutation
 * - Show success/error feedback
 * - Remove from cache immediately (optimistic update)
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: (_, deletedId) => {
      // Invalidate all category queries
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
      // Remove specific detail from cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) })
      showToast('Categoría eliminada exitosamente', 'success')
    },
    onError: (error: unknown) => {
      const message = getMutationErrorMessage(error, 'Error al eliminar la categoría')
      showToast(message, 'error')
    },
  })
}

/**
 * Hook for batch operations (future use)
 *
 * Could be extended to support:
 * - Bulk delete
 * - Bulk update positions
 * - Bulk activate/deactivate
 */
export function useCategoryMutations() {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()

  return {
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  }
}
