import apiClient, { setAuthTokens, clearAuthTokens } from '@/services/api'
import { API_ENDPOINTS } from '@/services/apiEndpoints'
import { LoginCredentials, LoginResponse, AuthUser } from '../types/auth.types'

interface RefreshResponse {
  access_token: string
}

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

  async refreshAccessToken(): Promise<void> {
    const { data } = await apiClient.post<RefreshResponse>(API_ENDPOINTS.AUTH.REFRESH, {})
    setAuthTokens(data.access_token)
  },

  setTokens(accessToken: string): void {
    setAuthTokens(accessToken)
  },

  clearTokens(): void {
    clearAuthTokens()
  },
}
