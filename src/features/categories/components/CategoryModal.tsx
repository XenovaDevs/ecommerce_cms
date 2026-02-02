/**
 * CategoryModal Component
 *
 * Modal wrapper for category creation and editing.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for modal state and layout
 * - Delegates form logic to CategoryForm
 * - Delegates data fetching to hooks
 *
 * Follows Dependency Inversion Principle:
 * - Depends on Modal abstraction
 * - Depends on form and mutation abstractions
 */

import { useEffect } from 'react'
import { Modal } from '@/components/ui/Modal/Modal'
import { CategoryForm } from './CategoryForm'
import { useCategory } from '../hooks/useCategories'
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategoryMutations'
import type { CategoryFormData } from '../types/category.types'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner/LoadingSpinner'

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  categoryId?: number | null
}

/**
 * Modal for creating or editing categories
 *
 * Mode determination:
 * - If categoryId provided: Edit mode (fetch existing data)
 * - If no categoryId: Create mode (empty form)
 */
export function CategoryModal({ isOpen, onClose, categoryId }: CategoryModalProps) {
  const isEditMode = !!categoryId

  // Fetch existing category data in edit mode
  const { data: category, isLoading: isLoadingCategory } = useCategory(categoryId || 0)

  // Mutations
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  /**
   * Handle form submission
   * Routes to appropriate mutation based on mode
   */
  const handleSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditMode && categoryId) {
        await updateMutation.mutateAsync({ id: categoryId, data })
      } else {
        await createMutation.mutateAsync(data)
      }
      onClose()
    } catch (error) {
      // Error handling is done in mutation hooks
      console.error('Failed to save category:', error)
    }
  }

  /**
   * Reset form state when modal closes
   */
  useEffect(() => {
    if (!isOpen) {
      createMutation.reset()
      updateMutation.reset()
    }
  }, [isOpen, createMutation, updateMutation])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? 'Editar Categoría' : 'Crear Categoría'}
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      {isLoadingCategory && isEditMode ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <CategoryForm
          initialData={
            isEditMode && category
              ? {
                  name: category.name,
                  slug: category.slug,
                  description: category.description,
                  image: category.image,
                  parent_id: category.parent_id,
                  is_active: category.is_active,
                }
              : undefined
          }
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isSubmitting}
          categoryId={categoryId || undefined}
        />
      )}
    </Modal>
  )
}
