import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { ProductCreatePage } from '@/features/products/pages/ProductCreatePage'
import { ProductEditPage } from '@/features/products/pages/ProductEditPage'
import { OrdersPage } from '@/features/orders/pages/OrdersPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import CategoriesPage from '@/features/categories/pages/CategoriesPage'
import { CustomersPage } from '@/features/customers/pages/CustomersPage'
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage'
import { ReportsPage } from '@/features/reports'
import { SettingsPage } from '@/features/settings'
import { ShippingPage } from '@/features/shipping'
import { RootLayout } from './RootLayout'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <RootLayout />,
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
        element: <CustomersPage />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetailPage />,
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
