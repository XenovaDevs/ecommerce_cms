export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthUser {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

export interface AuthTokens {
  access_token: string
  token_type?: string
  expires_in?: number
}

export interface LoginResponse {
  user: AuthUser
  access_token: string
  token_type?: string
  expires_in?: number
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
}
