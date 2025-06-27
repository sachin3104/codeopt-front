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

  // DEBUG: Log route changes
  useEffect(() => {
    console.log('🔍 AuthContext Route Debug:', {
      pathname: location.pathname,
      isAdminRoute,
      currentUser: user,
      isAuthenticated,
      loading
    })
  }, [location.pathname, isAdminRoute, user, isAuthenticated, loading])

  // Clear client-side state and redirect
  const doLogout = async () => {
    console.log('🚨 AuthContext: doLogout called')
    try {
      await auth.logout()
    } catch {
      // swallow errors
    }
    // clear in-memory state
    setUser(null)
    setIsAuthenticated(false)
    sessionStorage.clear()
    console.log('🚨 AuthContext: Redirecting to /login')
    navigate('/login', { replace: true })
  }

  // Handle 401s globally
  useEffect(() => {
    console.log('🔍 AuthContext: Registering unauthorized handler')
    registerUnauthorized(doLogout)
    // (no need to unregister unless you want to avoid dupes)
  }, [])

  // Initialize auth state on mount
  useEffect(() => {
    const init = async () => {
      console.log('🔍 AuthContext: Initializing auth state, isAdminRoute:', isAdminRoute)
      
      // Skip auth check on admin routes to prevent conflicts
      if (isAdminRoute) {
        console.log('✅ AuthContext: Skipping auth check on admin route')
        setUser(null)
        setIsAuthenticated(false)
        setLoading(false)
        return
      }

      try {
        console.log('🔍 AuthContext: Checking user auth...')
        const ok = await auth.checkAuth()
        console.log('🔍 AuthContext: Auth check result:', ok)
        
        if (ok) {
          console.log('🔍 AuthContext: User is authenticated, fetching user data...')
          const current = await auth.getCurrentUser()
          console.log('🔍 AuthContext: Current user:', current)
          setUser(current)
          setIsAuthenticated(!!current)
        } else {
          // User is not authenticated - this is normal for public routes
          console.log('🔍 AuthContext: User is not authenticated (normal for public routes)')
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        // If auth check fails, assume user is not authenticated
        // This is expected behavior for public routes
        console.log('🔍 AuthContext: Auth check failed (expected for public routes):', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [isAdminRoute])

  const login = async (params: LoginParams) => {
    console.log('🔍 AuthContext: Login called')
    setLoading(true)
    const current = await auth.login(params)
    
    // Add a small delay to allow the session cookie to be set
    await new Promise(resolve => setTimeout(resolve, 500))
    
    setUser(current)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const signup = async (params: SignupParams) => {
    console.log('🔍 AuthContext: Signup called')
    setLoading(true)
    const current = await auth.signup(params)
    setUser(current)
    setIsAuthenticated(true)
    setLoading(false)
  }

  const loginWithGoogle = async () => {
    console.log('🔍 AuthContext: Google login called')
    await auth.loginWithGoogle()
  }

  const logout = async () => {
    console.log('🔍 AuthContext: Logout called')
    await doLogout()
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


