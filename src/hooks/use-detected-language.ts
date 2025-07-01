import { useState, useEffect } from 'react'
import { detectLanguage } from '@/lib/languageDetector'


export function useDetectedLanguage(code: string): string {
  const [lang, setLang] = useState('')
  useEffect(() => {
    setLang(detectLanguage(code))
  }, [code])
  return lang
}
