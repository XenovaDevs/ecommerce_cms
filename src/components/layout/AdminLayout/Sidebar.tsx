import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Productos', href: '/products', icon: Package },
  { name: 'Categorías', href: '/categories', icon: FolderTree },
  { name: 'Órdenes', href: '/orders', icon: ShoppingCart },
  { name: 'Clientes', href: '/customers', icon: Users },
  { name: 'Envíos', href: '/shipping', icon: Truck },
  { name: 'Reportes', href: '/reports', icon: BarChart3 },
  { name: 'Configuración', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <div className="w-64 bg-sage-black text-white h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6 border-b border-sage-gray-800">
        <h1 className="text-2xl font-serif font-bold text-gradient-gold">
          Le Pas Sage
        </h1>
        <p className="text-xs text-sage-gray-400 mt-1">Panel de Administración</p>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-sage-gold text-sage-black font-medium'
                  : 'text-sage-gray-300 hover:bg-sage-gray-900 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sage-gray-800">
        <p className="text-xs text-sage-gray-500 text-center">
          © 2024 Le Pas Sage
        </p>
      </div>
    </div>
  )
}
