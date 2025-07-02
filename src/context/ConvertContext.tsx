// src/context/ConvertContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
  } from 'react'
  import { convertCode } from '@/api/service'
  import { useCode } from '@/hooks/use-code'
  import type { ConversionResult } from '@/types/api'
  import { useLoading } from '@/context/LoadingContext'
  import { useSubscription } from '@/hooks/use-subscription'
  
  export interface ConvertContextType {
    isLoading: boolean
    result: ConversionResult | null
    error: string | null
    run: (from: string, to: string) => Promise<void>
    clear: () => void
    initialized: boolean
  }
  
  export const ConvertContext = createContext<ConvertContextType | undefined>(undefined)
  
  export const ConvertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { code } = useCode()
    const { show, hide } = useLoading()
    const { refresh: refreshSubscription } = useSubscription()
    const [isLoading, setLoading] = useState(false)
    const [result, setResult]     = useState<ConversionResult | null>(null)
    const [error, setError]       = useState<string | null>(null)
    const [initialized, setInitialized] = useState(false)
  
    useEffect(() => {
      const saved = sessionStorage.getItem('convertedCode')
      if (saved) {
        setResult(JSON.parse(saved))
      }
      setInitialized(true)
    }, [])
  
      useEffect(() => {
    if (result) sessionStorage.setItem('convertedCode', JSON.stringify(result))
    else        sessionStorage.removeItem('convertedCode')
  }, [result])



  const run = async (from: string, to: string) => {
      if (!code) {
        setError('Please enter code to convert.')
        return
      }
      if (!from || !to) {
        setError('Please specify source and target languages.')
        return
      }
      setError(null)
      setLoading(true)
      show('convert')
      try {
        const data = await convertCode(code, from, to)
        setResult(data)
        // Refresh subscription data after successful request to update plan details in header
        try {
          await refreshSubscription()
        } catch (refreshError) {
          // Silently handle refresh errors to avoid breaking the main flow
        }
      } catch (e: any) {
        setError(e.message || 'Code conversion failed.')
        throw e
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
      <ConvertContext.Provider value={{ isLoading, result, error, run, clear, initialized }}>
        {children}
      </ConvertContext.Provider>
    )
  }
  
 