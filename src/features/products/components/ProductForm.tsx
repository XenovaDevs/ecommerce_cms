import { useEffect } from 'react'
import { useForm, Controller, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/Button/Button'
import { Input } from '@/components/ui/Input/Input'
import { Textarea } from '@/components/ui/Textarea/Textarea'
import { Select, SelectOption } from '@/components/ui/Select/Select'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox'
import { Card } from '@/components/ui/Card/Card'
import { ImageUploader } from './ImageUploader'
import { useCategories } from '../hooks/useCategories'
import { Product, ProductFormData } from '../types/product.types'
import { createProductSchema, generateSlug } from '../utils/productValidation'

/**
 * ProductForm Component
 *
 * Single Responsibility: Handles product form UI and validation
 * Interface Segregation: Clean props interface separating concerns
 * Dependency Inversion: Depends on abstractions (callbacks, not implementations)
 *
 * Features:
 * - Form validation with Zod
 * - Auto-generate slug from name
 * - Category selection
 * - Image upload integration
 * - Create/Edit mode support
 */

interface ProductFormProps {
  product?: Product
  onSubmit: (data: ProductFormData) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ProductFormProps) {
  const { data: categories = [], isLoading: loadingCategories } = useCategories()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(createProductSchema) as Resolver<ProductFormData>,
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          short_description: '',
          price: product.price,
          sale_price: product.compare_at_price || undefined,
          compare_at_price: product.compare_at_price || undefined,
          cost_price: product.cost_price || undefined,
          sku: product.sku || undefined,
          barcode: product.barcode || undefined,
          stock: product.stock,
          low_stock_threshold: product.low_stock_threshold || undefined,
          category_id: product.category_id || undefined,
          is_featured: product.is_featured,
          is_active: product.is_active,
          track_stock: true,
        }
      : {
          name: '',
          description: '',
          price: 0,
          stock: 0,
          is_featured: false,
          is_active: true,
          track_stock: true,
        },
  })

  // Watch name field to auto-generate slug
  const nameValue = watch('name')
  const slugValue = watch('slug')

  useEffect(() => {
    // Only auto-generate slug if it's empty or hasn't been manually edited
    if (nameValue && !slugValue) {
      setValue('slug', generateSlug(nameValue))
    }
  }, [nameValue, slugValue, setValue])

  const categoryOptions: SelectOption[] = [
    { value: '', label: 'Sin categoría' },
    ...categories.map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-sage-black mb-4">
          Información Básica
        </h2>

        <div className="space-y-4">
          <Input
            label="Nombre del Producto"
            placeholder="Ej: Camisa de lino beige"
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Slug (URL amigable)"
            placeholder="camisa-lino-beige"
            error={errors.slug?.message}
            {...register('slug')}
            helperText="Se generará automáticamente desde el nombre"
          />

          <Textarea
            label="Descripción"
            placeholder="Describe el producto en detalle..."
            rows={5}
            error={errors.description?.message}
            {...register('description')}
          />

          <Textarea
            label="Descripción Corta (Opcional)"
            placeholder="Breve descripción para listados..."
            rows={2}
            error={errors.short_description?.message}
            {...register('short_description')}
          />
        </div>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-sage-black mb-4">
          Precio e Inventario
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Precio Regular"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.price?.message}
            {...register('price', { valueAsNumber: true })}
          />

          <Input
            label="Precio de Oferta (Opcional)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.sale_price?.message}
            {...register('sale_price', { valueAsNumber: true })}
          />

          <Input
            label="Precio de Comparación (Opcional)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.compare_at_price?.message}
            {...register('compare_at_price', { valueAsNumber: true })}
          />

          <Input
            label="Costo (Opcional)"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.cost_price?.message}
            {...register('cost_price', { valueAsNumber: true })}
          />

          <Input
            label="SKU (Opcional)"
            placeholder="PROD-001"
            error={errors.sku?.message}
            {...register('sku')}
          />

          <Input
            label="Código de Barras (Opcional)"
            placeholder="1234567890123"
            error={errors.barcode?.message}
            {...register('barcode')}
          />

          <Input
            label="Stock Disponible"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock', { valueAsNumber: true })}
          />

          <Input
            label="Umbral de Stock Bajo (Opcional)"
            type="number"
            placeholder="10"
            error={errors.low_stock_threshold?.message}
            {...register('low_stock_threshold', { valueAsNumber: true })}
          />
        </div>
      </Card>

      {/* Organization */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-sage-black mb-4">
          Organización
        </h2>

        <div className="space-y-4">
          <Controller
            name="category_id"
            control={control}
            render={({ field }) => (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Categoría
                </label>
                <Select
                  options={categoryOptions}
                  value={field.value ? String(field.value) : ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value ? Number(value) : null)
                  }}
                  disabled={loadingCategories}
                />
                {errors.category_id && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.category_id.message}
                  </p>
                )}
              </div>
            )}
          />

          <div className="space-y-3">
            <Controller
              name="is_featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Producto Destacado"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Producto Activo"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />

            <Controller
              name="track_stock"
              control={control}
              render={({ field }) => (
                <Checkbox
                  label="Rastrear Inventario"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
          </div>
        </div>
      </Card>

      {/* Images */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-sage-black mb-4">
          Imágenes del Producto
        </h2>

        <ImageUploader
          productId={product?.id}
          existingImages={product?.images || []}
          maxImages={10}
          disabled={isSubmitting}
        />
      </Card>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          leftIcon={<X className="w-4 h-4" />}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {product ? 'Actualizar Producto' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  )
}

ProductForm.displayName = 'ProductForm'
