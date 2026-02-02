import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { LoginCredentials } from '../types/auth.types'

export function useLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  })
}
