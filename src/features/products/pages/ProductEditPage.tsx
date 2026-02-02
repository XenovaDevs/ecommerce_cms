import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Skeleton } from '@/components/ui/Skeleton/Skeleton'
import { ProductForm } from '../components/ProductForm'
import { useProduct } from '../hooks/useProducts'
import { useUpdateProduct } from '../hooks/useProductMutations'
import { ProductFormData } from '../types/product.types'

/**
 * ProductEditPage Component
 *
 * Single Responsibility: Handles product editing flow
 * Dependency Inversion: Depends on abstractions (hooks, not direct API calls)
 *
 * Features:
 * - Load existing product data
 * - Update product information
 * - Loading states with skeleton
 * - Error handling
 */

export function ProductEditPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const productId = id ? parseInt(id, 10) : 0

  const { data: product, isLoading, error } = useProduct(productId)
  const updateProduct = useUpdateProduct()

  /**
   * Handles form submission
   * Single Responsibility: Coordinates update and navigation
   */
  const handleSubmit = async (data: ProductFormData) => {
    if (!productId) return

    try {
      await updateProduct.mutateAsync({ id: productId, data })
      navigate('/products')
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to update product:', error)
    }
  }

  const handleCancel = () => {
    navigate('/products')
  }

  // Loading State
  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="w-32 h-8 mb-4" />
          <Skeleton className="w-64 h-9 mb-2" />
          <Skeleton className="w-96 h-5" />
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <Skeleton className="w-48 h-6 mb-4" />
            <div className="space-y-4">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-32" />
            </div>
          </Card>

          <Card className="p-6">
            <Skeleton className="w-48 h-6 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
              <Skeleton className="w-full h-10" />
            </div>
          </Card>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !product) {
    return (
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          className="mb-4"
        >
          Volver a Productos
        </Button>

        <Card className="p-8 text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-sage-black mb-2">
              Producto no encontrado
            </h2>
            <p className="text-sage-slate mb-6">
              El producto que intentas editar no existe o no tienes permisos para acceder a él.
            </p>
            <Button onClick={handleCancel}>Volver a Productos</Button>
          </div>
        </Card>
      </div>
    )
  }

  // Success State - Show Form
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
          Editar Producto
        </h1>
        <p className="mt-2 text-sage-slate">
          Actualiza la información de {product.name}
        </p>
      </div>

      {/* Product Form */}
      <ProductForm
        product={product}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={updateProduct.isPending}
      />
    </div>
  )
}

ProductEditPage.displayName = 'ProductEditPage'
