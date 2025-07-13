import { useCode } from './use-code'
import { useCharacterLimit } from './use-character-limit'
import { useRemainingRequests } from './use-remaining-requests'
import { useDetectedLanguage } from './use-detected-language'
import { isLanguageSupported } from '@/utils/action-utils'
import { ValidationResult } from '@/types/action'

export function useActionValidation() {
  const { code } = useCode()
  const { isOverLimit } = useCharacterLimit(code)
  const { hasRemainingRequests } = useRemainingRequests()
  const { language: detectedLanguage } = useDetectedLanguage(code)
  
  const isCodeEmpty = !code || code.trim().length === 0
  
  const validateAction = (): ValidationResult => {
    if (!hasRemainingRequests) return 'request-limit'
    if (isOverLimit) return 'character-limit'
    if (detectedLanguage && !isLanguageSupported(detectedLanguage)) return 'language-not-supported'
    return 'valid'
  }
  
  return { 
    validateAction, 
    isCodeEmpty, 
    detectedLanguage,
    isOverLimit,
    hasRemainingRequests,
    code
  }
} 