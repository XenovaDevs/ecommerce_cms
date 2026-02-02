import { useState, useMemo } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Column {
  key: string
  header: string
  sortable?: boolean
  render?: (value: any, row: any) => React.ReactNode
  className?: string
}

interface TableProps {
  columns: Column[]
  data: any[]
  sortable?: boolean
  selectable?: boolean
  onRowSelect?: (selectedRows: any[]) => void
  loading?: boolean
  emptyMessage?: string
  striped?: boolean
  hoverable?: boolean
  stickyHeader?: boolean
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export const Table = ({
  columns,
  data,
  sortable = false,
  selectable = false,
  onRowSelect,
  loading = false,
  emptyMessage = 'No data available',
  striped = true,
  hoverable = true,
  stickyHeader = false,
  className,
}: TableProps) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortColumn]
      const bVal = b[sortColumn]

      if (aVal === bVal) return 0

      const comparison = aVal > bVal ? 1 : -1
      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [data, sortColumn, sortDirection])

  const handleSort = (columnKey: string) => {
    if (!sortable) return

    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const handleRowSelect = (index: number) => {
    const newSelected = new Set(selectedRows)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedRows(newSelected)
    onRowSelect?.(Array.from(newSelected).map((i) => sortedData[i]))
  }

  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      setSelectedRows(new Set())
      onRowSelect?.([])
    } else {
      const allIndices = new Set(sortedData.map((_, i) => i))
      setSelectedRows(allIndices)
      onRowSelect?.(sortedData)
    }
  }

  const allSelected = selectedRows.size === sortedData.length && sortedData.length > 0
  const someSelected = selectedRows.size > 0 && selectedRows.size < sortedData.length

  if (loading) {
    return (
      <div className={cn('overflow-x-auto rounded-lg border border-sage-200', className)}>
        <table className="w-full">
          <thead className="bg-sage-50 border-b border-sage-200">
            <tr>
              {selectable && <th className="w-12 px-4 py-3"></th>}
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider">
                  <div className="h-4 bg-sage-200 rounded animate-pulse w-20"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-sage-200">
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {selectable && <td className="px-4 py-4"></td>}
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 bg-sage-100 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (sortedData.length === 0) {
    return (
      <div className={cn('overflow-x-auto rounded-lg border border-sage-200 bg-white', className)}>
        <div className="px-6 py-12 text-center">
          <p className="text-sage-500">{emptyMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('overflow-x-auto rounded-lg border border-sage-200', className)}>
      <table className="w-full">
        <thead
          className={cn(
            'bg-sage-50 border-b border-sage-200',
            stickyHeader && 'sticky top-0 z-10'
          )}
        >
          <tr>
            {selectable && (
              <th className="w-12 px-4 py-3">
                <button
                  onClick={handleSelectAll}
                  className={cn(
                    'w-5 h-5 rounded border-2 transition-all duration-200',
                    'flex items-center justify-center',
                    allSelected
                      ? 'bg-sage-600 border-sage-600'
                      : someSelected
                      ? 'bg-sage-300 border-sage-300'
                      : 'border-sage-300 hover:border-sage-400'
                  )}
                  aria-label="Select all rows"
                >
                  {(allSelected || someSelected) && (
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  )}
                </button>
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-left text-xs font-medium text-sage-700 uppercase tracking-wider',
                  col.className
                )}
              >
                {sortable && col.sortable !== false ? (
                  <button
                    onClick={() => handleSort(col.key)}
                    className="flex items-center gap-2 hover:text-sage-900 transition-colors group"
                  >
                    {col.header}
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {sortColumn === col.key ? (
                        sortDirection === 'asc' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )
                      ) : (
                        <ArrowUpDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>
                ) : (
                  col.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-sage-200">
          {sortedData.map((row, index) => (
            <tr
              key={index}
              className={cn(
                'transition-colors duration-150',
                striped && index % 2 === 1 && 'bg-sage-50/50',
                hoverable && 'hover:bg-sage-100/50',
                selectedRows.has(index) && 'bg-gold-50'
              )}
            >
              {selectable && (
                <td className="px-4 py-4">
                  <button
                    onClick={() => handleRowSelect(index)}
                    className={cn(
                      'w-5 h-5 rounded border-2 transition-all duration-200',
                      'flex items-center justify-center',
                      selectedRows.has(index)
                        ? 'bg-sage-600 border-sage-600'
                        : 'border-sage-300 hover:border-sage-400'
                    )}
                    aria-label={`Select row ${index + 1}`}
                  >
                    {selectedRows.has(index) && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </button>
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={cn('px-4 py-4 text-sm text-sage-900', col.className)}
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
