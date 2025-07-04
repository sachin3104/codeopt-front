// src/hooks/use-detected-language.ts
import { useEffect } from 'react'
import { useLanguageDetection } from '@/context/AppProvider'

interface UseDetectedLanguageResult {
  language: string
  loading: boolean
  error: string | null
}

/**
 * Hook to detect programming language from code using the global language detection context.
 * This prevents duplicate API calls across multiple components.
 * 
 * Features:
 * - Uses global context to share detection state
 * - Debounced API calls (500ms delay)
 * - In-memory caching to prevent duplicate requests
 * - Automatic cleanup on unmount
 * 
 * @param code - The code string to detect language for
 * @returns Object containing detected language, loading state, and error
 */
export function useDetectedLanguage(code: string): UseDetectedLanguageResult {
  const { language, loading, error, detectLanguage } = useLanguageDetection()

  useEffect(() => {
    detectLanguage(code)
  }, [code, detectLanguage])

  return { language, loading, error }
}

/**
 * Clear the language detection cache.
 * Useful for testing or when you want to force fresh language detection.
 */
export const clearLanguageCache = () => {
  try {
    const { clearCache } = useLanguageDetection()
    clearCache()
  } catch (error) {
    // If context is not available, just log a warning
    console.warn('Language detection context not available for cache clearing')
  }
}
