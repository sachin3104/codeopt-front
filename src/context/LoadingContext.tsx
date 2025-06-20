// src/context/LoadingContext.tsx
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
  } from 'react'
  
  // Enumerate the four action variants you’ll use
  export type LoadingVariant = 'analyze' | 'optimize' | 'convert' | 'document'
  
  interface LoadingContextType {
    isLoading: boolean
    variant: LoadingVariant | null
    show: (variant?: LoadingVariant) => void
    hide: () => void
  }
  
  const LoadingContext = createContext<LoadingContextType | undefined>(undefined)
  
  export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
    children,
  }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [variant, setVariant]   = useState<LoadingVariant | null>(null)
  
    const show = (v?: LoadingVariant) => {
      setVariant(v ?? null)
      setIsLoading(true)
    }
  
    const hide = () => {
      setIsLoading(false)
      setVariant(null)
    }
  
    return (
      <LoadingContext.Provider value={{ isLoading, variant, show, hide }}>
        {children}
      </LoadingContext.Provider>
    )
  }
  
  export function useLoading(): LoadingContextType {
    const ctx = useContext(LoadingContext)
    if (!ctx) {
      throw new Error('useLoading must be used within LoadingProvider')
    }
    return ctx
  }
  