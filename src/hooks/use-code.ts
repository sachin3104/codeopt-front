import { useContext } from 'react'
import { CodeContext, CodeContextType } from '@/context/CodeContext'



export function useCode(): CodeContextType {
  const context = useContext(CodeContext)
  if (!context) {
    throw new Error('useCode must be used within a CodeProvider')
  }
  return context
}