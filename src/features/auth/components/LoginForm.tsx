import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useLogin } from '../hooks/useLogin'
import { LoginCredentials } from '../types/auth.types'
import { parseErrorMessage } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export function LoginForm() {
  const { mutate: login, isPending, error } = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginCredentials) => {
    login(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-lg border border-sage-gray-300 bg-background px-4 py-3 text-foreground placeholder:text-sage-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sage-gold"
          placeholder="admin@lepasage.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-lg border border-sage-gray-300 bg-background px-4 py-3 text-foreground placeholder:text-sage-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-sage-gold"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            {parseErrorMessage(error)}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-sage-black px-4 py-3 font-medium text-sage-white transition-all hover:bg-sage-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  )
}
