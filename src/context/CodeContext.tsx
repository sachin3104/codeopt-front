// src/context/CodeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface CodeContextType {
  code: string
  setCode: (code: string) => void
}

export const CodeContext = createContext<CodeContextType | undefined>(undefined)

export const CodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [code, setCode] = useState<string>(() => {
    const saved = sessionStorage.getItem('code')
    return saved !== null ? saved : ''
  })

  useEffect(() => {
    sessionStorage.setItem('code', code)
  }, [code])

  return (
    <CodeContext.Provider value={{ code, setCode }}>
      {children}
    </CodeContext.Provider>
  )
}

