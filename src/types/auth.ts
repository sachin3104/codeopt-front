// Parameters for authentication API calls
export interface LoginParams {
  username: string
  password: string
}

export interface SignupParams {
  username: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  use_otp?: boolean        // optional, defaults to true for mandatory OTP
}

export type SignupResult = 
  | User
  | {
      next_step: 'verify_otp'
      data: {
        email: string
        verification_endpoint: string
        expires_in: number
        max_attempts: number
      }
    }

// The shape of a user returned by the backend
export interface User {
  id: string                // public_id from backend
  username: string
  email: string
  auth_provider: string
  first_name?: string
  last_name?: string
  profile_picture?: string
  is_approved: boolean
  is_active: boolean
  created_at: string        // ISO timestamp
  last_login?: string       // ISO timestamp
}

// Generic response from auth endpoints
export interface AuthResponse {
  status: 'success' | 'error'
  message: string
  user?: User
  data?: {
    email: string
    verification_endpoint: string
    expires_in: number
    max_attempts: number
    next_step: 'verify_otp'
  }
  registration_data?: {
    email: string
    first_name: string | null
    last_name: string | null
    username: string
  }
}

// Response from check endpoint
export interface CheckAuthResponse {
  status: 'success' | 'error'
  authenticated: boolean
  message?: string
} 