import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { API_BASE_URL, TOKEN_KEYS } from '@/lib/constants'

/**
 * Axios instance with interceptors
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

/**
 * Get access token from cookies
 */
export function getAccessToken(): string | undefined {
  return Cookies.get(TOKEN_KEYS.ACCESS_TOKEN)
}

/**
 * Get refresh token from cookies
 */
export function getRefreshToken(): string | undefined {
  return Cookies.get(TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Set auth tokens in cookies
 */
export function setAuthTokens(accessToken: string, refreshToken: string): void {
  Cookies.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, {
    expires: 7, // 7 days
    secure: true,
    sameSite: 'strict',
  })
  Cookies.set(TOKEN_KEYS.REFRESH_TOKEN, refreshToken, {
    expires: 30, // 30 days
    secure: true,
    sameSite: 'strict',
  })
}

/**
 * Clear auth tokens from cookies
 */
export function clearAuthTokens(): void {
  Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN)
  Cookies.remove(TOKEN_KEYS.REFRESH_TOKEN)
}

/**
 * Request interceptor - Add auth token to requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * Response interceptor - Handle token refresh on 401
 */
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return apiClient(originalRequest)
          })
          .catch(err => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearAuthTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        })

        const { access_token, refresh_token: newRefreshToken } = data

        setAuthTokens(access_token, newRefreshToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }

        processQueue(null, access_token)

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null)
        clearAuthTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient
