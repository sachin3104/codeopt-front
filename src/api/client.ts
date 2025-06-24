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

    if (status === 401 && !alreadyLoggingOut) {
      alreadyLoggingOut = true
      toast.error('Session expired. Please log in again.')
      unauthorizedHandlers.forEach(fn => fn())
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
