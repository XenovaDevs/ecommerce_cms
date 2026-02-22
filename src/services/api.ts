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
 * Set auth tokens in cookies
 */
export function setAuthTokens(accessToken: string): void {
  const isSecure = window.location.protocol === 'https:'
  Cookies.set(TOKEN_KEYS.ACCESS_TOKEN, accessToken, {
    expires: 1 / 96, // 15 minutes
    secure: isSecure,
    sameSite: 'strict',
  })
}

/**
 * Clear auth tokens from cookies
 */
export function clearAuthTokens(): void {
  Cookies.remove(TOKEN_KEYS.ACCESS_TOKEN)
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
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
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
  (response) => {
    const apiData = response.data
    if (apiData && typeof apiData === 'object' && 'success' in apiData) {
      if (apiData.pagination) {
        response.data = {
          data: apiData.data,
          meta: {
            current_page: apiData.pagination.current_page,
            per_page: apiData.pagination.per_page,
            total: apiData.pagination.total,
            last_page: apiData.pagination.total_pages,
            from: apiData.pagination.from,
            to: apiData.pagination.to,
          },
          links: {
            first: null,
            last: null,
            prev: null,
            next: null,
          },
        }
      } else {
        response.data = apiData.data
      }
    }
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const requestUrl = originalRequest?.url || ''

    // If error is 401 and we haven't tried to refresh yet
    if (
      error.response?.status === 401
      && !originalRequest._retry
      && !requestUrl.includes('/auth/refresh')
      && !requestUrl.includes('/auth/login')
    ) {
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

      try {
        const { data: responseData } = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          }
        )

        const payload = responseData.data || responseData
        const accessToken = payload.access_token

        if (!accessToken) {
          throw new Error('Refresh did not return access_token')
        }

        setAuthTokens(accessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }

        processQueue(null, accessToken)

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
