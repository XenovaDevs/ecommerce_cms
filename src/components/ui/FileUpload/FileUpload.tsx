import { useState, useRef, type ChangeEvent, type DragEvent } from 'react'
import { Upload, X, File, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '../Button/Button'

interface FileWithPreview extends File {
  preview?: string
}

interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number // in bytes
  onFilesChange?: (files: File[]) => void
  className?: string
  disabled?: boolean
}

export const FileUpload = ({
  accept,
  multiple = false,
  maxSize,
  onFilesChange,
  className,
  disabled = false,
}: FileUploadProps) => {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): string | null => {
    if (maxSize && file.size > maxSize) {
      return `File ${file.name} exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`
    }
    return null
  }

  const processFiles = (fileList: FileList) => {
    const newFiles: FileWithPreview[] = []
    const errors: string[] = []

    Array.from(fileList).forEach((file) => {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(validationError)
        return
      }

      const fileWithPreview = file as FileWithPreview

      // Create preview for images
      if (file.type.startsWith('image/')) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }

      newFiles.push(fileWithPreview)
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    setError(null)
    const updatedFiles = multiple ? [...files, ...newFiles] : newFiles
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const removeFile = (index: number) => {
    const fileToRemove = files[index]
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview)
    }

    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleBrowseClick = () => {
    inputRef.current?.click()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className={cn('w-full', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 transition-all',
          'flex flex-col items-center justify-center gap-3',
          'cursor-pointer hover:border-sage-gold',
          isDragging && 'border-sage-gold bg-gold-pale',
          disabled && 'opacity-50 cursor-not-allowed hover:border-sage-gray-300',
          !isDragging && 'border-sage-gray-300',
          error && 'border-destructive'
        )}
        onClick={!disabled ? handleBrowseClick : undefined}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
          disabled={disabled}
          className="sr-only"
        />

        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gold-pale transition-colors',
            isDragging && 'bg-sage-gold'
          )}
        >
          <Upload
            className={cn(
              'w-6 h-6 transition-colors',
              isDragging ? 'text-sage-white' : 'text-sage-gold'
            )}
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-sage-black">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-sage-gray-600 mt-1">
            or click to browse
          </p>
          {maxSize && (
            <p className="text-xs text-sage-gray-500 mt-1">
              Max file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
            </p>
          )}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border border-sage-gray-200',
                'bg-sage-gray-50 transition-all hover:shadow-elegant'
              )}
            >
              {file.preview ? (
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-sage-gray-200">
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded flex items-center justify-center bg-sage-gray-200 flex-shrink-0">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="w-6 h-6 text-sage-gray-600" />
                  ) : (
                    <File className="w-6 h-6 text-sage-gray-600" />
                  )}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sage-black truncate">
                  {file.name}
                </p>
                <p className="text-xs text-sage-gray-600">
                  {formatFileSize(file.size)}
                </p>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

FileUpload.displayName = 'FileUpload'
