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
      setLoading(true)
      setError(null)
      try {
        const data = await convertCode(code, from, to)
        setResult(data)
      } catch (e: any) {
        setError(e.message || 'Code conversion failed.')
      } finally {
        setLoading(false)
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
  
 