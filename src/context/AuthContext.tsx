import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { registerUnauthorized } from '@/api/client'
import { auth } from '@/api/auth'
import type { User, LoginParams, SignupParams } from '@/types/auth'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (params: LoginParams) => Promise<void>
  signup: (params: SignupParams) => Promise<void>
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
    sessionStorage.clear()
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
    const current = await auth.signup(params)
    setUser(current)
    setIsAuthenticated(true)
    setLoading(false)
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
      console.error('Failed to refresh user:', error);
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
        loginWithGoogle, 
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


