import { cn } from '@/lib/utils'

interface SkeletonProps {
  variant?: 'text' | 'circle' | 'rectangle' | 'card'
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

export const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className,
}: SkeletonProps) => {
  const getSize = (size?: string | number): string | undefined => {
    if (typeof size === 'number') return `${size}px`
    return size
  }

  const getVariantStyles = () => {
    switch (variant) {
      case 'circle':
        return {
          className: 'rounded-full',
          defaultWidth: 40,
          defaultHeight: 40,
        }
      case 'rectangle':
        return {
          className: 'rounded-lg',
          defaultWidth: '100%',
          defaultHeight: 100,
        }
      case 'card':
        return {
          className: 'rounded-lg p-6 space-y-4',
          defaultWidth: '100%',
          defaultHeight: 200,
        }
      case 'text':
      default:
        return {
          className: 'rounded',
          defaultWidth: '100%',
          defaultHeight: 16,
        }
    }
  }

  const variantStyles = getVariantStyles()
  const finalWidth = getSize(width) || variantStyles.defaultWidth
  const finalHeight = getSize(height) || variantStyles.defaultHeight

  const renderSkeleton = (index: number) => {
    if (variant === 'card') {
      return (
        <div
          key={index}
          className={cn(
            'bg-sage-100 animate-pulse',
            variantStyles.className,
            className
          )}
          style={{
            width: finalWidth,
            height: finalHeight,
          }}
          role="status"
          aria-label="Loading..."
          aria-busy="true"
        >
          <div className="space-y-4">
            <div className="h-12 bg-sage-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-4 bg-sage-200 rounded w-3/4"></div>
              <div className="h-4 bg-sage-200 rounded w-1/2"></div>
            </div>
            <div className="flex gap-2">
              <div className="h-8 bg-sage-200 rounded flex-1"></div>
              <div className="h-8 bg-sage-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div
        key={index}
        className={cn(
          'bg-sage-100 animate-pulse',
          variantStyles.className,
          className
        )}
        style={{
          width: finalWidth,
          height: finalHeight,
        }}
        role="status"
        aria-label="Loading..."
        aria-busy="true"
      />
    )
  }

  if (count > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, index) => renderSkeleton(index))}
      </div>
    )
  }

  return renderSkeleton(0)
}
