import { useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import { FileUpload } from '@/components/ui/FileUpload/FileUpload'
import { cn } from '@/lib/utils'
import apiClient from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { ProductImage } from '../types/product.types'
import { useToast } from '@/store/ToastContext'

/**
 * ImageUploader Component
 *
 * Single Responsibility: Handles product image upload and management
 * Interface Segregation: Clean props interface with minimal dependencies
 * Dependency Inversion: Depends on API abstraction (apiClient)
 *
 * Features:
 * - Multiple image upload via drag & drop
 * - Preview existing product images
 * - Delete images from product
 * - Upload progress and error handling
 */

interface ImageUploaderProps {
  productId?: number
  existingImages?: ProductImage[]
  onImagesChange?: (images: ProductImage[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUploader({
  productId,
  existingImages = [],
  onImagesChange,
  maxImages = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [images, setImages] = useState<ProductImage[]>(existingImages)
  const [isUploading, setIsUploading] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  const { showToast } = useToast()

  /**
   * Handles file upload to server
   * Single Responsibility: Only handles upload logic
   */
  const handleUpload = async (files: File[]) => {
    if (!productId) {
      throw new Error('Product ID is required to upload images')
    }

    if (images.length + files.length > maxImages) {
      throw new Error(`Maximum ${maxImages} images allowed`)
    }

    setIsUploading(true)

    try {
      // Upload images one by one
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append('image', file)

        const { data } = await apiClient.post<ProductImage>(
          API_ENDPOINTS.PRODUCTS.UPLOAD_IMAGES(productId),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        )
        return data
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const updatedImages = [...images, ...uploadedImages]

      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      showToast('Imágenes subidas exitosamente', 'success')
    } catch (error) {
      console.error('Error uploading images:', error)
      showToast('Error al subir imágenes', 'error')
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  /**
   * Handles image deletion from server
   * Single Responsibility: Only handles deletion logic
   */
  const handleDelete = async (imageId: number) => {
    if (!productId) {
      showToast('No se puede eliminar la imagen sin un producto asociado', 'error')
      return
    }

    setDeletingIds((prev) => new Set(prev).add(imageId))

    try {
      await apiClient.delete(API_ENDPOINTS.PRODUCTS.DELETE_IMAGE(productId, imageId))

      const updatedImages = images.filter((img) => img.id !== imageId)
      setImages(updatedImages)
      onImagesChange?.(updatedImages)
      showToast('Imagen eliminada exitosamente', 'success')
    } catch (error) {
      console.error('Error deleting image:', error)
      showToast('Error al eliminar la imagen', 'error')
    } finally {
      setDeletingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(imageId)
        return newSet
      })
    }
  }

  const remainingSlots = maxImages - images.length

  return (
    <div className="space-y-4">
      {/* Existing Images Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-square rounded-lg border border-sage-whisper bg-sage-pearl overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.alt || `Product image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Image Position Badge */}
              <div className="absolute top-2 left-2 bg-sage-black/75 text-white text-xs px-2 py-1 rounded">
                #{image.position}
              </div>

              {/* Delete Button */}
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={disabled || deletingIds.has(image.id)}
                className={cn(
                  'absolute top-2 right-2 p-1.5 rounded-lg',
                  'bg-white shadow-md border border-sage-whisper',
                  'opacity-0 group-hover:opacity-100 transition-all duration-200',
                  'hover:bg-red-50 hover:border-red-200 hover:text-red-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
                aria-label="Delete image"
              >
                {deletingIds.has(image.id) ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {remainingSlots > 0 && (
        <div>
          <FileUpload
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={remainingSlots}
            multiple
            onUpload={productId ? handleUpload : undefined}
            showPreview
            disabled={disabled || isUploading}
          />

          {!productId && (
            <p className="mt-2 text-xs text-sage-slate">
              Guarda el producto primero para poder subir imágenes
            </p>
          )}

          {productId && remainingSlots < maxImages && (
            <p className="mt-2 text-xs text-sage-slate">
              {remainingSlots} de {maxImages} imágenes disponibles
            </p>
          )}
        </div>
      )}

      {/* Max Images Reached */}
      {remainingSlots === 0 && (
        <div className="text-center py-4 px-6 bg-sage-pearl rounded-lg border border-sage-whisper">
          <p className="text-sm text-sage-slate">
            Límite máximo de {maxImages} imágenes alcanzado
          </p>
        </div>
      )}
    </div>
  )
}

ImageUploader.displayName = 'ImageUploader'
