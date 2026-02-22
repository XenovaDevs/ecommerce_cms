import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useDeleteProduct } from '../hooks/useProductMutations'
import { useCategories } from '../hooks/useCategories'
import { Button } from '@/components/ui/Button/Button'
import { Card } from '@/components/ui/Card/Card'
import { Table, Column } from '@/components/ui/Table/Table'
import { Badge } from '@/components/ui/Badge/Badge'
import { Pagination } from '@/components/ui/Pagination/Pagination'
import { Modal, ModalFooter } from '@/components/ui/Modal/Modal'
import { ProductFilters } from '../components/ProductFilters'
import { formatCurrency } from '@/lib/utils'
import { Product, ProductFilters as ProductFiltersType } from '../types/product.types'

/**
 * ProductsPage Component
 *
 * Single Responsibility: Manages product listing, filtering, and basic actions
 * Open/Closed Principle: Extensible through filters and actions without modifying core
 * Dependency Inversion: Depends on hooks abstraction, not direct API calls
 *
 * Features:
 * - Product listing with pagination
 * - Advanced filtering
 * - Create, Edit, Delete actions
 * - Confirmation modal for deletion
 */

export function ProductsPage() {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(15)
  const [filters, setFilters] = useState<ProductFiltersType>({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  const { data, isLoading } = useProducts({
    ...filters,
    page,
    per_page: perPage,
  })

  const { data: categories = [] } = useCategories()
  const deleteProduct = useDeleteProduct()

  /**
   * Opens confirmation modal for product deletion
   * Single Responsibility: Only handles modal state
   */
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  /**
   * Confirms and executes product deletion
   * Single Responsibility: Coordinates deletion action
   */
  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    try {
      await deleteProduct.mutateAsync(productToDelete.id)
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (error) {
      // Error handling is done by the mutation hook
      console.error('Failed to delete product:', error)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false)
    setProductToDelete(null)
  }

  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page on filter change
  }

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Producto',
      sortable: true,
      render: (_, product: Product) => (
        <div className="flex items-center gap-3">
          {product.primary_image && (
            <img
              src={product.primary_image.url}
              alt={product.name}
              className="w-10 h-10 rounded-lg object-cover border border-sage-whisper"
            />
          )}
          <div>
            <p className="font-medium text-sage-black">{product.name}</p>
            {product.sku && (
              <p className="text-xs text-sage-gray-500">SKU: {product.sku}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Categoría',
      render: (_, product: Product) => (
        <span className="text-sm text-sage-slate">
          {product.category?.name || '-'}
        </span>
      ),
    },
    {
      key: 'price',
      header: 'Precio',
      sortable: true,
      render: (price) => {
        const numericPrice = typeof price === 'number' ? price : Number(price ?? 0)
        return (
          <span className="font-medium text-sage-black">
            {formatCurrency(numericPrice)}
          </span>
        )
      },
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (stock, product) => {
        const numericStock = typeof stock === 'number' ? stock : Number(stock ?? 0)
        const isLow =
          product.low_stock_threshold && numericStock <= product.low_stock_threshold

        return (
          <Badge variant={numericStock > 10 ? 'success' : isLow ? 'warning' : 'danger'}>
            {numericStock} unidades
          </Badge>
        )
      },
    },
    {
      key: 'is_active',
      header: 'Estado',
      render: (isActive) => {
        const active = Boolean(isActive)
        return (
          <Badge variant={active ? 'success' : 'default'}>
            {active ? 'Activo' : 'Inactivo'}
          </Badge>
        )
      },
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (_, product: Product) => (
        <div className="flex items-center gap-2">
          <Link to={`/products/edit/${product.id}`}>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Pencil className="w-3.5 h-3.5" />}
            >
              Editar
            </Button>
          </Link>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteClick(product)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            className="text-red-600 hover:text-red-700 hover:border-red-300"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-sage-black">
            Productos
          </h1>
          <p className="mt-1 text-sage-slate">
            Gestiona tu catálogo de productos
          </p>
        </div>

        <Link to="/products/create">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Crear Producto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        categories={categories}
        disabled={isLoading}
      />

      {/* Table */}
      <Card>
        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          sortable
          hoverable
          emptyMessage="No se encontraron productos"
        />

        {data && data.meta.total > 0 && (
          <div className="p-4 border-t border-sage-gray-200">
            <Pagination
              currentPage={page}
              totalPages={data.meta.last_page}
              totalItems={data.meta.total}
              pageSize={perPage}
              onPageChange={setPage}
              onPageSizeChange={setPerPage}
            />
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        title="Confirmar Eliminación"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sage-slate">
            ¿Estás seguro de que deseas eliminar el producto{' '}
            <strong className="text-sage-black">{productToDelete?.name}</strong>?
          </p>

          <p className="text-sm text-red-600">
            Esta acción no se puede deshacer. Se eliminarán todas las imágenes y
            datos asociados al producto.
          </p>
        </div>

        <ModalFooter>
          <Button
            variant="outline"
            onClick={handleDeleteCancel}
            disabled={deleteProduct.isPending}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleDeleteConfirm}
            isLoading={deleteProduct.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar Producto
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

ProductsPage.displayName = 'ProductsPage'
