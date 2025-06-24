import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

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
      try {
        const ok = await auth.checkAuth()
        if (ok) {
          const current = await auth.getCurrentUser()
          setUser(current)
          setIsAuthenticated(!!current)
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}


