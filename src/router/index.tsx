/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, type ComponentType } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { RootLayout } from './RootLayout'

const normalizeBasename = (value: string): string => {
  if (!value || value === '/') {
    return '/'
  }

  return value.endsWith('/') ? value.slice(0, -1) : value
}

const RouteLoader = () => (
  <div className="flex min-h-[30vh] items-center justify-center text-sm text-sage-ivory/70">
    Loading page...
  </div>
)

const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<RouteLoader />}>
    <Component />
  </Suspense>
)

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage').then((module) => ({ default: module.LoginPage })))
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then((module) => ({ default: module.DashboardPage })))
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage').then((module) => ({ default: module.ProductsPage })))
const ProductCreatePage = lazy(() => import('@/features/products/pages/ProductCreatePage').then((module) => ({ default: module.ProductCreatePage })))
const ProductEditPage = lazy(() => import('@/features/products/pages/ProductEditPage').then((module) => ({ default: module.ProductEditPage })))
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage').then((module) => ({ default: module.OrdersPage })))
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage').then((module) => ({ default: module.OrderDetailPage })))
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage'))
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage').then((module) => ({ default: module.CustomersPage })))
const CustomerDetailPage = lazy(() => import('@/features/customers/pages/CustomerDetailPage').then((module) => ({ default: module.CustomerDetailPage })))
const ShippingPage = lazy(() => import('@/features/shipping/pages/ShippingPage').then((module) => ({ default: module.ShippingPage })))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then((module) => ({ default: module.SettingsPage })))

const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: withSuspense(LoginPage),
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
          element: withSuspense(DashboardPage),
        },
        {
          path: 'products',
          element: withSuspense(ProductsPage),
        },
        {
          path: 'products/create',
          element: withSuspense(ProductCreatePage),
        },
        {
          path: 'products/edit/:id',
          element: withSuspense(ProductEditPage),
        },
        {
          path: 'categories',
          element: withSuspense(CategoriesPage),
        },
        {
          path: 'orders',
          element: withSuspense(OrdersPage),
        },
        {
          path: 'orders/:id',
          element: withSuspense(OrderDetailPage),
        },
        {
          path: 'customers',
          element: withSuspense(CustomersPage),
        },
        {
          path: 'customers/:id',
          element: withSuspense(CustomerDetailPage),
        },
        {
          path: 'shipping',
          element: withSuspense(ShippingPage),
        },
        {
          path: 'reports',
          element: withSuspense(ReportsPage),
        },
        {
          path: 'settings',
          element: withSuspense(SettingsPage),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  {
    basename: normalizeBasename(import.meta.env.BASE_URL),
  }
)

export default router
