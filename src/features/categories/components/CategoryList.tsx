/**
 * CategoryList Component
 *
 * Displays a hierarchical list of categories in a table format.
 *
 * Follows Single Responsibility Principle:
 * - Only responsible for rendering category data
 * - Delegates data fetching to hooks
 * - Delegates actions to parent component
 *
 * Follows Open/Closed Principle:
 * - Accepts render props for extensibility
 * - Uses composition for actions
 */

import { Folder, Edit, Trash2, Plus } from 'lucide-react'
import { Table, type Column } from '@/components/ui/Table/Table'
import { Button } from '@/components/ui/Button/Button'
import { Badge } from '@/components/ui/Badge/Badge'
import { useCategoriesTree } from '../hooks/useCategories'
import type { CategoryTreeNode } from '../types/category.types'
import { cn } from '@/lib/utils'

interface CategoryListProps {
  onEdit?: (category: CategoryTreeNode) => void
  onDelete?: (category: CategoryTreeNode) => void
  onCreate?: () => void
}

/**
 * Renders hierarchical category tree in table format
 */
export function CategoryList({ onEdit, onDelete, onCreate }: CategoryListProps) {
  const { data: categoryTree, isLoading } = useCategoriesTree()

  /**
   * Flatten tree structure for table display
   * Maintains hierarchy through visual indentation
   */
  const flattenedCategories = flattenCategoryTree(categoryTree || [])

  const columns: Column<CategoryTreeNode>[] = [
    {
      key: 'name',
      header: 'Categoría',
      sortable: false,
      render: (_, category: CategoryTreeNode) => (
        <div
          className="flex items-center gap-2"
          style={{ paddingLeft: `${category.level * 24}px` }}
        >
          <Folder
            className={cn(
              'h-4 w-4',
              category.level === 0 ? 'text-sage-gold' : 'text-sage-gray-400'
            )}
          />
          <span className="font-medium text-sage-900">{category.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descripción',
      sortable: false,
      render: (value) => {
        const description = typeof value === 'string' && value.length > 0 ? value : '—'
        return <span className="text-sage-600 line-clamp-1">{description}</span>
      },
    },
    {
      key: 'parent',
      header: 'Padre',
      sortable: false,
      render: (_, category: CategoryTreeNode) => {
        if (category.level === 0) {
          return <span className="text-sage-400">Raíz</span>
        }
        // Parent name would need to be passed or looked up
        return <span className="text-sage-600">—</span>
      },
    },
    {
      key: 'position',
      header: 'Orden',
      sortable: false,
      className: 'text-center',
      render: (value) => (
        <span className="text-sage-600 font-mono text-sm">{String(value ?? '—')}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Estado',
      sortable: false,
      className: 'text-center',
      render: (value) => {
        const isActive = Boolean(value)
        return (
          <Badge variant={isActive ? 'success' : 'default'}>
            {isActive ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      sortable: false,
      className: 'text-right',
      render: (_, category: CategoryTreeNode) => (
        <div className="flex items-center justify-end gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(category)}
              aria-label={`Editar ${category.name}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(category)}
              aria-label={`Eliminar ${category.name}`}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-sage-900">Categorías</h2>
          <p className="text-sage-600 mt-1">
            Gestiona las categorías de tus productos
          </p>
        </div>
        {onCreate && (
          <Button
            variant="gold"
            onClick={onCreate}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Crear Categoría
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={flattenedCategories}
        loading={isLoading}
        emptyMessage="No hay categorías creadas"
        striped
        hoverable
      />
    </div>
  )
}

/**
 * Utility: Flatten hierarchical tree into array while preserving order
 *
 * Performs depth-first traversal to maintain parent-child proximity
 */
function flattenCategoryTree(nodes: CategoryTreeNode[]): CategoryTreeNode[] {
  const result: CategoryTreeNode[] = []

  function traverse(nodes: CategoryTreeNode[]) {
    nodes.forEach((node) => {
      result.push(node)
      if (node.children.length > 0) {
        traverse(node.children)
      }
    })
  }

  traverse(nodes)
  return result
}
