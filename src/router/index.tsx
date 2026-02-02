import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { ProductCreatePage } from '@/features/products/pages/ProductCreatePage'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage'
import { OrdersPage } from '@/features/orders/pages/OrdersPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'
import { ReportsPage } from '@/features/reports'
import { SettingsPage } from '@/features/settings'
import { ShippingPage } from '@/features/shipping'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout/AdminLayout'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'products',
        element: <ProductsPage />,
      },
      {
        path: 'products/create',
        element: <ProductCreatePage />,
      },
      {
        path: 'products/edit/:id',
        element: <ProductEditPage />,
      },
      {
        path: 'categories',
        element: <CategoriesPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'orders/:id',
        element: <OrderDetailPage />,
      },
      {
        path: 'customers',
        element: <div className="p-8 bg-white rounded-lg">Clientes - En construcción</div>,
      },
      {
        path: 'shipping',
        element: <ShippingPage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

export default router
