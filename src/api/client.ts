// src/api/client.ts
import axios from 'axios'
// import { logoutAndRedirect } from '@/services/auth'
// import { showError } from '@/services/ui'


const BASE = (import.meta.env.VITE_API_URL as string || '').replace(/\/+$/, '')
if (!BASE) {
  throw new Error('VITE_API_URL environment variable must be defined')
}

const api = axios.create({
  baseURL: BASE,
  timeout: 480_000,      // 8 minutes = 8 * 60 * 1000 ms
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
})


api.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status

    if (status === 403) {
      // TODO: once UI service exists, call showError(...)
      // e.g. showError('Access denied...')
      alert('Access denied: you do not have permission to perform this action.')
    } else if (status === 404) {
      alert('Requested resource not found.')
    } else if (status >= 500) {
      alert('Server error occurred. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api
