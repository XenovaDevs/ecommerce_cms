import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/product.service'
import { ProductFormData } from '../types/product.types'
import { useToast } from '@/store/ToastContext'

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (data: ProductFormData) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast('Producto creado exitosamente', 'success')
    },
    onError: () => {
      showToast('Error al crear el producto', 'error')
    },
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductFormData> }) =>
      productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast('Producto actualizado exitosamente', 'success')
    },
    onError: () => {
      showToast('Error al actualizar el producto', 'error')
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  return useMutation({
    mutationFn: (id: number) => productService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      showToast('Producto eliminado exitosamente', 'success')
    },
    onError: () => {
      showToast('Error al eliminar el producto', 'error')
    },
  })
}
