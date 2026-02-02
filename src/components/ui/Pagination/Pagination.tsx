import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageSize?: number
  onPageSizeChange?: (size: number) => void
  totalItems?: number
  pageSizeOptions?: number[]
  showPageSize?: boolean
  showTotal?: boolean
  className?: string
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  onPageSizeChange,
  totalItems,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSize = true,
  showTotal = true,
  className,
}: PaginationProps) => {
  const generatePageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = []
    const maxVisiblePages = 7

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = generatePageNumbers()
  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getItemRange = (): string => {
    if (!totalItems) return ''
    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, totalItems)
    return `${start}-${end} of ${totalItems}`
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-between gap-4 flex-wrap', className)}
    >
      <div className="flex items-center gap-4">
        {showTotal && totalItems !== undefined && (
          <p className="text-sm text-sage-600">
            Showing <span className="font-medium">{getItemRange()}</span> items
          </p>
        )}

        {showPageSize && onPageSizeChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="page-size" className="text-sm text-sage-600">
              Show
            </label>
            <select
              id="page-size"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className={cn(
                'px-3 py-1.5 text-sm rounded-lg border border-sage-300 bg-white',
                'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent',
                'transition-all duration-200'
              )}
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrevious}
          aria-label="Go to first page"
          className={cn(
            'p-2 rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
            canGoPrevious
              ? 'text-sage-600 hover:bg-sage-50'
              : 'text-sage-300 cursor-not-allowed'
          )}
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Go to previous page"
          className={cn(
            'p-2 rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
            canGoPrevious
              ? 'text-sage-600 hover:bg-sage-50'
              : 'text-sage-300 cursor-not-allowed'
          )}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-2 text-sm text-sage-400"
                >
                  ...
                </span>
              )
            }

            const isActive = page === currentPage

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                aria-label={`Go to page ${page}`}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg',
                  'transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-sage-600 text-white'
                    : 'text-sage-600 hover:bg-sage-50'
                )}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Go to next page"
          className={cn(
            'p-2 rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
            canGoNext
              ? 'text-sage-600 hover:bg-sage-50'
              : 'text-sage-300 cursor-not-allowed'
          )}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          aria-label="Go to last page"
          className={cn(
            'p-2 rounded-lg transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2',
            canGoNext
              ? 'text-sage-600 hover:bg-sage-50'
              : 'text-sage-300 cursor-not-allowed'
          )}
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
    </nav>
  )
}
