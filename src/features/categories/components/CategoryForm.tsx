/**
 * CategoryForm Component
 *
 * Form for creating and editing categories with validation.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for form UI and validation
 * - Delegates data submission to parent
 * - Delegates slug generation to utility
 *
 * Follows Dependency Inversion Principle:
 * - Depends on form abstraction (react-hook-form)
 * - Accepts validation schema injection (zod)
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input/Input'
import { Textarea } from '@/components/ui/Textarea/Textarea'
import { Select, type SelectOption } from '@/components/ui/Select/Select'
import { Checkbox } from '@/components/ui/Checkbox/Checkbox'
import { Button } from '@/components/ui/Button/Button'
import { useCategoriesForParentSelect } from '../hooks/useCategories'
import type { CategoryFormData } from '../types/category.types'

/**
 * Validation schema using Zod
 * Ensures data integrity before submission
 */
const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  slug: z
    .string()
    .min(1, 'El slug es requerido')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'El slug debe ser válido (ej: mi-categoria)'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres'),
  image: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  parent_id: z.number().nullable(),
  is_active: z.boolean(),
})

interface CategoryFormProps {
  initialData?: Partial<CategoryFormData>
  onSubmit: (data: CategoryFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  categoryId?: number
}

/**
 * Category form component with validation and auto-slug generation
 */
export function CategoryForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  categoryId,
}: CategoryFormProps) {
  const { data: categories } = useCategoriesForParentSelect(categoryId)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      image: initialData?.image || '',
      parent_id: initialData?.parent_id || null,
      is_active: initialData?.is_active ?? true,
    },
  })

  const name = watch('name')
  const slug = watch('slug')

  /**
   * Auto-generate slug from name on creation
   * Only when user hasn't manually edited the slug
   */
  useEffect(() => {
    if (!initialData && name && !slug) {
      const generatedSlug = generateSlug(name)
      setValue('slug', generatedSlug)
    }
  }, [name, slug, initialData, setValue])

  /**
   * Build parent category options
   */
  const parentOptions: SelectOption[] = [
    { value: '', label: 'Sin categoría padre (raíz)' },
    ...(categories || []).map((cat) => ({
      value: String(cat.id),
      label: cat.name,
    })),
  ]

  const handleFormSubmit = (data: CategoryFormData) => {
    // Convert empty string parent_id to null
    const formData = {
      ...data,
      parent_id: data.parent_id || null,
      image: data.image || undefined,
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Nombre"
        placeholder="Ej: Electrónica"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Slug"
        placeholder="Ej: electronica"
        error={errors.slug?.message}
        {...register('slug')}
      />

      <Textarea
        label="Descripción"
        placeholder="Describe la categoría..."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <Select
        label="Categoría Padre"
        options={parentOptions}
        placeholder="Selecciona una categoría padre"
        error={errors.parent_id?.message}
        {...register('parent_id', {
          setValueAs: (value) => (value === '' ? null : Number(value)),
        })}
      />

      <Input
        label="Imagen (URL)"
        type="url"
        placeholder="https://ejemplo.com/imagen.jpg"
        error={errors.image?.message}
        {...register('image')}
      />

      <Checkbox label="Activo" {...register('is_active')} />

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-sage-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button
          type="submit"
          variant="gold"
          isLoading={isLoading}
          disabled={!isDirty || isLoading}
        >
          {initialData ? 'Actualizar' : 'Crear'} Categoría
        </Button>
      </div>
    </form>
  )
}

/**
 * Generate URL-friendly slug from text
 *
 * Algorithm:
 * 1. Convert to lowercase
 * 2. Remove accents/diacritics
 * 3. Replace non-alphanumeric with hyphens
 * 4. Remove consecutive hyphens
 * 5. Trim hyphens from ends
 */
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '') // Trim hyphens from ends
    .replace(/-+/g, '-') // Replace multiple hyphens with single
}
