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

    // DEBUG: Log the request that caused the error
    console.log('🔍 API Error Debug:', {
      status,
      url,
      method: error.config?.method,
      isUserAuthCheck: url.includes('/api/auth/check'),
      isUserAuthUser: url.includes('/api/auth/user'),
      isAdminAuthCheck: url.includes('/api/admin/auth/check'),
      isAdminAuthMe: url.includes('/api/admin/auth/me'),
      isAdminAuthLogin: url.includes('/api/admin/auth/login'),
      isAdminAuthLogout: url.includes('/api/admin/auth/logout'),
    })

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
      console.log('🚨 Triggering logout due to 401 on non-auth endpoint:', url)
      alreadyLoggingOut = true
      toast.error('Session expired. Please log in again.')
      unauthorizedHandlers.forEach(fn => fn())
    }
    else if (status === 401 && isAuthEndpoint) {
      console.log('✅ Ignoring 401 on auth endpoint (expected behavior):', url)
    }
    else if (status === 403) {
      toast.error('Access denied.')
    }
    else if (status === 404) {
      toast.error('Resource not found.')
    }
    else if (status === 429) {
      toast.error(
        'You\'ve hit your request limit on the free plan. ' +
        'Please upgrade to continue using this feature.'
      )
    }
    else if (status >= 500) {
      toast.error('Server error. Try again later.')
    }

    return Promise.reject(error)
  }
)

export default api
