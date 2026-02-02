import apiClient, { setAuthTokens, clearAuthTokens } from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { LoginCredentials, LoginResponse, AuthUser } from '../types/auth.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
    return data
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    } finally {
      clearAuthTokens()
    }
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await apiClient.get<AuthUser>(API_ENDPOINTS.AUTH.ME)
    return data
  },

  setTokens(accessToken: string, refreshToken: string): void {
    setAuthTokens(accessToken, refreshToken)
  },

  clearTokens(): void {
    clearAuthTokens()
  },
}
