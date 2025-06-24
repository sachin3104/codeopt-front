// src/context/DocumentContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
  } from 'react'
  import { documentCode } from '@/api/service'
  import { useCode } from '@/hooks/use-code'
  import type { DocumentResult } from '@/types/api'
  import { useLoading } from '@/context/LoadingContext'
  import { useSubscription } from '@/hooks/use-subscription'
  
  export interface DocumentContextType {
    isLoading: boolean
    result: DocumentResult | null
    error: string | null
    run: () => Promise<void>    
    clear: () => void
    initialized: boolean
  }
  
  export const DocumentContext = createContext<DocumentContextType | undefined>(undefined)
  
  export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { code } = useCode()
    const { show, hide } = useLoading()
    const { refresh: refreshSubscription } = useSubscription()
    const [isLoading, setLoading] = useState(false)
    const [result, setResult]     = useState<DocumentResult | null>(null)
    const [error, setError]       = useState<string | null>(null)
    const [initialized, setInitialized] = useState(false)
  
    useEffect(() => {
      const saved = sessionStorage.getItem('documentResult')
      if (saved) {
        setResult(JSON.parse(saved))
      }
      setInitialized(true)
    }, [])
  
    useEffect(() => {
      if (result) sessionStorage.setItem('documentResult', JSON.stringify(result))
      else        sessionStorage.removeItem('documentResult')
    }, [result])
  
    const run = async () => {
      if (!code) {
        setError('Please enter code to document.')
        return
      }
      setError(null)
      setLoading(true)
      show('document')
      try {
        const data = await documentCode(code)
        setResult(data)
        // Refresh subscription data after successful request to update plan details in header
        try {
          await refreshSubscription()
        } catch (refreshError) {
          // Silently handle refresh errors to avoid breaking the main flow
          console.warn('Failed to refresh subscription data:', refreshError)
        }
      } catch (e: any) {
        setError(e.message || 'Documentation generation failed.')
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
      <DocumentContext.Provider value={{ isLoading, result, error, run, clear, initialized }}>
        {children}
      </DocumentContext.Provider>
    )
  }
  
  
  