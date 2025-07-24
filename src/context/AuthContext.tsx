import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { registerUnauthorized } from '@/api/client'
import { auth } from '@/api/auth'
import type { User, LoginParams, SignupParams, SignupResult } from '@/types/auth'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (params: LoginParams) => Promise<void>
  signup: (params: SignupParams) => Promise<void>
  verifySignupOtp: (otpCode: string) => Promise<void>
  resendOtp: () => Promise<void>
  loginWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<boolean>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [pendingOtp, setPendingOtp] = useState<{
    email: string
    endpoint: string
    extra: { username: string; password: string }
  } | null>(null)

  // Check if current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin/')

  // Route changes are handled automatically

  // Clear client-side state and redirect
  const doLogout = async () => {
    try {
      await auth.logout()
    } catch {
      // swallow errors
    }
    // clear in-memory state
    setUser(null)
    setIsAuthenticated(false)
    setPendingOtp(null)
    sessionStorage.clear()
    sessionStorage.removeItem('pendingOtpData') // Clear pending OTP data
    navigate('/login', { replace: true })
  }

  // Handle 401s globally
  useEffect(() => {
    registerUnauthorized(doLogout)
    // (no need to unregister unless you want to avoid dupes)
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const init = async () => {
      // Skip auth check on admin routes to prevent conflicts
      if (isAdminRoute) {
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      // Restore pending OTP data from sessionStorage if available
      const pendingOtpData = sessionStorage.getItem('pendingOtpData')
      if (pendingOtpData && !pendingOtp) {
        try {
          const data = JSON.parse(pendingOtpData)
          setPendingOtp(data)
        } catch (error) {
    
          sessionStorage.removeItem('pendingOtpData')
        }
      }

      try {
        const ok = await auth.checkAuth()
        
        if (ok) {
          const current = await auth.getCurrentUser()
          setUser(current)
          setIsAuthenticated(!!current)
        } else {
          // User is not authenticated - this is normal for public routes
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        // If auth check fails, assume user is not authenticated
        // This is expected behavior for public routes
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [isAdminRoute])

  const login = async (params: LoginParams) => {
    setLoading(true)
    const current = await auth.login(params)
    
    // Add a small delay to allow the session cookie to be set
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser(current)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const signup = async (params: SignupParams) => {
    setLoading(true)
    const result = await auth.signup(params)

    if ('next_step' in result) {
      // stash the info and redirect
      const pendingOtpData = {
        email: result.data.email,
        endpoint: result.data.verification_endpoint,
        extra: { username: params.username, password: params.password }
      }
      setPendingOtp(pendingOtpData)
      
      // Store in sessionStorage for page refresh resilience
      sessionStorage.setItem('pendingOtpData', JSON.stringify(pendingOtpData))
      
      navigate('/auth/verify-otp', { state: { purpose: 'registration' } })
    } else {
      setUser(result)
      setIsAuthenticated(true)
    }
    setLoading(false)
  }

  const verifySignupOtp = async (otpCode: string) => {
    if (!pendingOtp) {
      throw new Error('No pending OTP verification')
    }

    setLoading(true)
    const current = await auth.verifySignupOtp(
      pendingOtp.email,
      otpCode,
      pendingOtp.extra.username,
      pendingOtp.extra.password
    )
    
    setUser(current)
    setIsAuthenticated(true)
    setPendingOtp(null)
    
    // Clear sessionStorage after successful verification
    sessionStorage.removeItem('pendingOtpData')
    
    setLoading(false)
  }

  const resendOtp = async () => {
    if (!pendingOtp) {
      
      throw new Error('No pending OTP verification')
    }

    
    await auth.requestOtp(pendingOtp.email)
  }

  const loginWithGoogle = async () => {
    await auth.loginWithGoogle()
  }

  const logout = async () => {
    await doLogout()
  }

  // Add this method to refresh user data
  const refreshUser = async () => {
    try {
      const current = await auth.getCurrentUser();
      if (current) {
        setUser(current);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        loading, 
        login, 
        signup, 
        verifySignupOtp,
        resendOtp,
        loginWithGoogle, 
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


