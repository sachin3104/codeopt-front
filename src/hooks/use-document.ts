import { useContext } from 'react'
import { DocumentContext, DocumentContextType } from '@/context/DocumentContext'

export const useDocument = (): DocumentContextType => {
    const ctx = useContext(DocumentContext)
    if (!ctx) throw new Error('useDocument must be used within DocumentProvider')
    return ctx
  }