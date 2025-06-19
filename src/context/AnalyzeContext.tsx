// src/context/AnalyzeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react'
import { analyzeCode } from '@/api/service'
import { useCode }     from '@/hooks/use-code'
import type { AnalysisResponse } from '@/types/api'

export interface AnalyzeContextType {
  isLoading: boolean
  result: AnalysisResponse | null
  error: string | null
  run: () => Promise<void>
  clear: () => void
  initialized: boolean
}

export const AnalyzeContext = createContext<AnalyzeContextType | undefined>(undefined)

export const AnalyzeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { code } = useCode()
  const [isLoading, setLoading] = useState(false)
  const [result, setResult]     = useState<AnalysisResponse | null>(null)
  const [error, setError]       = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // hydrate from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('analysisResult')
    if (saved) {
      try {
        setResult(JSON.parse(saved))
      } catch {
        sessionStorage.removeItem('analysisResult')
      }
    }
    setInitialized(true)
  }, [])

  // persist to sessionStorage
  useEffect(() => {
    if (result) {
      sessionStorage.setItem('analysisResult', JSON.stringify(result))
    } else {
      sessionStorage.removeItem('analysisResult')
    }
  }, [result])

  const run = async () => {
    if (!code) {
      setError('Please enter code to analyze.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await analyzeCode(code)
      setResult(data)
    } catch (e: any) {
      setError(e.message || 'Analysis failed.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  const clear = () => {
    setResult(null)
    setError(null)
  }

  return (
    <AnalyzeContext.Provider value={{ isLoading, result, error, run, clear, initialized }}>
      {children}
    </AnalyzeContext.Provider>
  )
}


