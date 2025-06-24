// src/context/OptimizeContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
  } from 'react'
  import { optimizeCode } from '@/api/service'
  import { useCode } from '@/hooks/use-code'
  import type { OptimizationResult } from '@/types/api'
  import { useLoading } from '@/context/LoadingContext'
  import { useSubscription } from '@/hooks/use-subscription'
  
  export interface OptimizeContextType {
    isLoading: boolean
    result: OptimizationResult | null
    error: string | null
    run: () => Promise<void>
    clear: () => void
    initialized: boolean
  }
  
   export const OptimizeContext = createContext<OptimizeContextType | undefined>(undefined)
  
  export const OptimizeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { code } = useCode()
    const { show, hide } = useLoading()
    const { refresh: refreshSubscription } = useSubscription()
    const [isLoading, setLoading] = useState(false)
    const [result, setResult]     = useState<OptimizationResult | null>(null)
    const [error, setError]       = useState<string | null>(null)
    const [initialized, setInitialized] = useState(false)
  
    useEffect(() => {
      const saved = sessionStorage.getItem('optimizationResult')
      if (saved) {
        setResult(JSON.parse(saved))
      }
      setInitialized(true)
    }, [])
  
    useEffect(() => {
      if (result) sessionStorage.setItem('optimizationResult', JSON.stringify(result))
      else        sessionStorage.removeItem('optimizationResult')
    }, [result])
  
    const run = async () => {
      if (!code) {
        setError('Please enter code to optimize.')
        return
      }
      setError(null)
      setLoading(true)
      show('optimize')
      try {
        const data = await optimizeCode(code)
        setResult(data)
        // Refresh subscription data after successful request to update plan details in header
        try {
          await refreshSubscription()
        } catch (refreshError) {
          // Silently handle refresh errors to avoid breaking the main flow
          console.warn('Failed to refresh subscription data:', refreshError)
        }
      } catch (e: any) {
        setError(e.message || 'Optimization failed.')
      } finally {
        setLoading(false)
        hide()
      }
    }
  
    const clear = () => {
      setResult(null)
      setError(null)
    }
  
    return (
      <OptimizeContext.Provider value={{ isLoading, result, error, run, clear, initialized }}>
        {children}
      </OptimizeContext.Provider>
    )
  }
  
  
  