import React from 'react'
import { CharacterLimitModal } from '../CharacterLimitModal'
import { RequestLimitModal } from './RequestLimitModal'
import { LanguageNotSupportedModal } from './LanguageNotSupportedModal'

interface ActionModalsContainerProps {
  modals: {
    showLimitModal: boolean
    showRequestLimitModal: boolean
    showLanguageModal: boolean
  }
  onClose: (type: 'character-limit' | 'request-limit' | 'language-not-supported') => void
  code: string
  detectedLanguage?: string
}

export const ActionModalsContainer: React.FC<ActionModalsContainerProps> = ({
  modals,
  onClose,
  code,
  detectedLanguage
}) => {
  return (
    <>
      <CharacterLimitModal
        isOpen={modals.showLimitModal}
        onClose={() => onClose('character-limit')}
        currentCode={code}
      />

      <RequestLimitModal
        isOpen={modals.showRequestLimitModal}
        onClose={() => onClose('request-limit')}
      />

      <LanguageNotSupportedModal
        isOpen={modals.showLanguageModal}
        onClose={() => onClose('language-not-supported')}
        detectedLanguage={detectedLanguage}
      />
    </>
  )
} 