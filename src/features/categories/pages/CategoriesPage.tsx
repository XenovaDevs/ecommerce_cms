/**
 * CategoriesPage Component
 *
 * Main page for category management.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for page composition and user interaction orchestration
 * - Delegates rendering to child components
 * - Delegates data operations to hooks
 *
 * Follows Dependency Inversion Principle:
 * - Depends on component abstractions
 * - Depends on hook abstractions for state management
 */

import { useState } from 'react'
import { CategoryList } from '../components/CategoryList'
import { CategoryModal } from '../components/CategoryModal'
import { useDeleteCategory } from '../hooks/useCategoryMutations'
import type { CategoryTreeNode } from '../types/category.types'
import { Modal, ModalFooter } from '@/components/ui/Modal/Modal'
import { Button } from '@/components/ui/Button/Button'
import { AlertTriangle } from 'lucide-react'

/**
 * Main categories management page
 *
 * Responsibilities:
 * - Manage modal states (create, edit, delete confirmation)
 * - Coordinate user actions
 * - Compose child components
 */
export default function CategoriesPage() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null)
  const [deletingCategory, setDeletingCategory] = useState<CategoryTreeNode | null>(null)

  // Mutations
  const deleteMutation = useDeleteCategory()

  /**
   * Open modal for creating new category
   */
  const handleCreate = () => {
    setEditingCategoryId(null)
    setIsModalOpen(true)
  }

  /**
   * Open modal for editing existing category
   */
  const handleEdit = (category: CategoryTreeNode) => {
    setEditingCategoryId(category.id)
    setIsModalOpen(true)
  }

  /**
   * Open confirmation dialog for deleting category
   */
  const handleDeleteRequest = (category: CategoryTreeNode) => {
    setDeletingCategory(category)
  }

  /**
   * Execute category deletion
   */
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return

    try {
      await deleteMutation.mutateAsync(deletingCategory.id)
      setDeletingCategory(null)
    } catch (error) {
      // Error is handled in mutation hook
      console.error('Failed to delete category:', error)
    }
  }

  /**
   * Close modal and reset state
   */
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCategoryId(null)
  }

  /**
   * Close delete confirmation dialog
   */
  const handleDeleteCancel = () => {
    setDeletingCategory(null)
  }

  return (
    <div className="space-y-6">
      <CategoryList
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDeleteRequest}
      />

      <CategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        categoryId={editingCategoryId}
      />

      <DeleteConfirmationModal
        isOpen={!!deletingCategory}
        categoryName={deletingCategory?.name || ''}
        hasChildren={deletingCategory?.hasChildren || false}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  )
}

/**
 * Delete Confirmation Modal Component
 *
 * Separate component for better separation of concerns
 * Handles the confirmation UI for category deletion
 */
interface DeleteConfirmationModalProps {
  isOpen: boolean
  categoryName: string
  hasChildren: boolean
  onConfirm: () => void
  onCancel: () => void
  isDeleting: boolean
}

function DeleteConfirmationModal({
  isOpen,
  categoryName,
  hasChildren,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="md"
      closeOnOverlayClick={!isDeleting}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-sage-900">
              Eliminar Categoría
            </h3>
            <p className="text-sage-600 mt-2">
              ¿Estás seguro de que deseas eliminar la categoría{' '}
              <span className="font-semibold">{categoryName}</span>?
            </p>
            {hasChildren && (
              <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-3">
                <p className="text-sm text-amber-800">
                  <strong>Advertencia:</strong> Esta categoría tiene subcategorías.
                  Al eliminarla, las subcategorías quedarán como categorías raíz.
                </p>
              </div>
            )}
            <p className="text-sm text-sage-500 mt-3">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>
      </div>

      <ModalFooter>
        <Button variant="outline" onClick={onCancel} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={onConfirm}
          isLoading={isDeleting}
          disabled={isDeleting}
        >
          Eliminar
        </Button>
      </ModalFooter>
    </Modal>
  )
}
