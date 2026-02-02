import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-gray-50 to-sage-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-elegant-lg p-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gradient-gold mb-2">
              Le Pas Sage
            </h1>
            <p className="text-sage-gray-600">Panel de Administración</p>
          </div>

          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-sm text-sage-gray-500">
              Sistema de gestión de contenido
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
