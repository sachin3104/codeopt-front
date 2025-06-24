import api from './client'
import type { 
  LoginParams, 
  SignupParams, 
  User, 
  AuthResponse, 
  CheckAuthResponse 
} from '../types/auth'

// Authentication API methods
export const auth = {
  /**
   * Log in with username & password. Sets HTTP-only cookie via backend.
   */
  login: async (params: LoginParams): Promise<User> => {
    const response = await api.post<AuthResponse>('/api/auth/login', params)
    return response.data.user
  },

  /**
   * Register a new user account.
   */
  signup: async (params: SignupParams): Promise<User> => {
    const response = await api.post<AuthResponse>('/api/auth/signup', params)
    return response.data.user
  },

  /**
   * Initiate Google OAuth authentication.
   * This will redirect the user to the backend Google OAuth endpoint,
   * which will then redirect back to /auth/success on completion.
   */
  loginWithGoogle: async (): Promise<void> => {
    // Redirect to backend OAuth endpoint
    window.location.href = '/api/auth/google'
  },

  /**
   * Log out the current user. Clears cookie server-side.
   */
  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout')
  },

  /**
   * Fetch the current authenticated user's profile.
   * Returns null if not authenticated.
   */
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await api.get<{ status: string; user: User }>('/api/auth/user')
      return response.data.user
    } catch (err) {
      return null
    }
  },

  /**
   * Check whether the current session is authenticated.
   */
  checkAuth: async (): Promise<boolean> => {
    try {
      const response = await api.get<CheckAuthResponse>('/api/auth/check')
      return response.data.authenticated
    } catch {
      return false
    }
  }
}
