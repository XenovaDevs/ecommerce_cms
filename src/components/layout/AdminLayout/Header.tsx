import { LogOut, User } from 'lucide-react'
import { useAuth } from '@/features/auth/context/AuthContext'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-sage-gray-200 fixed top-0 right-0 left-64 z-10">
      <div className="h-full px-6 flex items-center justify-end">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sage-gold flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-sage-black">{user?.name}</p>
              <p className="text-sage-gray-500">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="p-2 text-sage-gray-600 hover:text-sage-black hover:bg-sage-gray-100 rounded-lg transition-all"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
