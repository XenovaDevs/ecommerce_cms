import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { authService } from '../services/auth.service'
import { AuthContextType, LoginCredentials, AuthUser } from '../types/auth.types'

const STAFF_ROLES = new Set(['super_admin', 'admin', 'manager', 'support'])

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        try {
          await authService.refreshAccessToken()
          const currentUser = await authService.getCurrentUser()

          if (!STAFF_ROLES.has(currentUser.role)) {
            await authService.logout()
            setUser(null)
            return
          }

          setUser(currentUser)
        } catch (error) {
          authService.clearTokens()
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await authService.login(credentials)
    authService.setTokens(response.access_token)

    if (!STAFF_ROLES.has(response.user.role)) {
      await authService.logout()
      throw new Error('Unauthorized role for CMS access')
    }

    setUser(response.user)
  }, [])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
