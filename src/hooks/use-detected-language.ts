import { useState, useEffect } from 'react'
import { detectLanguage } from '@/lib/languageDetector'

/**
 * Hook that watches a code string and returns
 * either 'r' | 'python' | 'sql' | 'sas' or ''.
 */
export function useDetectedLanguage(code: string): string {
  const [lang, setLang] = useState('')
  useEffect(() => {
    setLang(detectLanguage(code))
  }, [code])
  return lang
}
