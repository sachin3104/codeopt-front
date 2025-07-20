import axios from 'axios'
import { toast } from 'sonner'


const BASE = (import.meta.env.VITE_API_URL as string || '').replace(/\/+$/, '')
if (!BASE) {
  throw new Error('VITE_API_URL environment variable must be defined')
}

// Axios instance with credentials
const api = axios.create({
  baseURL: BASE,
  timeout: 480_000,      // 8 minutes = 8 * 60 * 1000 ms
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let alreadyLoggingOut = false

type UnauthorizedHandler = () => void
const unauthorizedHandlers: UnauthorizedHandler[] = []


export function registerUnauthorized(handler: UnauthorizedHandler): void {
  unauthorizedHandlers.push(handler)
}

// Global response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status
    const url = error.config?.url || ''

    // Don't trigger logout for regular user auth check requests (expected 401 when not logged in)
    // But DO trigger logout for admin auth failures
    const isUserAuthCheck = url.includes('/api/auth/check')
    const isUserAuthUser = url.includes('/api/auth/user')
    const isUserAuthEndpoint = isUserAuthCheck || isUserAuthUser
    
    // Don't trigger logout for admin auth endpoints (expected 401 when not logged in as admin)
    const isAdminAuthCheck = url.includes('/api/admin/auth/check')
    const isAdminAuthMe = url.includes('/api/admin/auth/me')
    const isAdminAuthLogin = url.includes('/api/admin/auth/login')
    const isAdminAuthLogout = url.includes('/api/admin/auth/logout')
    const isAdminAuthEndpoint = isAdminAuthCheck || isAdminAuthMe || isAdminAuthLogin || isAdminAuthLogout
    
    // Don't trigger logout for any auth-related endpoints
    const isAuthEndpoint = isUserAuthEndpoint || isAdminAuthEndpoint
    
    if (status === 401 && !alreadyLoggingOut && !isAuthEndpoint) {
      alreadyLoggingOut = true
      toast.error('Session expired. Please log in again.')
      unauthorizedHandlers.forEach(fn => fn())
    }
    else if (status === 401 && isAuthEndpoint) {
      // Ignore 401 on auth endpoint (expected behavior)
    }
    else if (status === 403) {
      // Don't show generic toast - let components handle with user-friendly messages
    }
    else if (status === 404) {
      // Don't show generic toast - let components handle with user-friendly messages
    }
    else if (status === 429) {
      toast.error(
        'You\'ve hit your request limit on the free plan. ' +
        'Please upgrade to continue using this feature.'
      )
    }
    else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api
