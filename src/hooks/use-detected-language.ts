// src/hooks/use-detected-language.ts
import { useState, useEffect } from 'react'
import { detectLanguage,DetectLanguageResponse } from '@/api/service'


interface UseDetectedLanguageResult {
  language: string
  loading: boolean
  error: string | null
}

export function useDetectedLanguage(code: string): UseDetectedLanguageResult {
  const [language, setLanguage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset immediately on empty
    if (!code) {
      setLanguage('')
      setError(null)
      return
    }

    let cancelled = false
    let debounceTimer: ReturnType<typeof setTimeout>

    // Start loading state
    setLoading(true)
    setError(null)

    // Schedule the API call after 500ms of inactivity
    debounceTimer = setTimeout(async () => {
      try {
        const res: DetectLanguageResponse = await detectLanguage(code)
        if (!cancelled) {
          setLanguage(res.language)
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message ?? 'Failed to detect language')
          setLanguage('')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }, 500)

    // Cleanup on code change or unmount
    return () => {
      cancelled = true
      clearTimeout(debounceTimer)
    }
  }, [code])

  return { language, loading, error }
}
