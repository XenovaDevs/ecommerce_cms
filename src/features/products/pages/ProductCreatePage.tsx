import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { ProductForm } from '../components/ProductForm'
import { useCreateProduct } from '../hooks/useProductMutations'
import { ProductFormData } from '../types/product.types'

/**
 * ProductCreatePage Component
 *
 * Single Responsibility: Handles product creation flow
 * Dependency Inversion: Depends on abstractions (hooks, not direct API calls)
 *
 * Features:
 * - Product creation form
 * - Navigation after successful creation
 * - Error handling via toast notifications
 */

export function ProductCreatePage() {
  const navigate = useNavigate()
  const createProduct = useCreateProduct()

  /**
   * Handles form submission
   * Single Responsibility: Coordinates creation and navigation
   */
  const handleSubmit = async (data: ProductFormData) => {
    try {
      await createProduct.mutateAsync(data)
      navigate('/products')
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to create product:', error)
    }
  }

  const handleCancel = () => {
    navigate('/products')
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Volver a Productos
        </Button>

        <h1 className="text-3xl font-serif font-bold text-sage-black">
          Crear Producto
        </h1>
        <p className="mt-2 text-sage-slate">
          Completa la información del nuevo producto
        </p>
      </div>

      {/* Product Form */}
      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={createProduct.isPending}
      />
    </div>
  )
}

ProductCreatePage.displayName = 'ProductCreatePage'
