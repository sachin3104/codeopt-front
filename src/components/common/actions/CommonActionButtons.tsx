import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Zap, FileCode, FileText } from 'lucide-react'
import { useAnalyze } from '@/hooks/use-analyze'
import { useOptimize } from '@/hooks/use-optimize'
import { useConvert } from '@/hooks/use-convert'
import { useDocument } from '@/hooks/use-document'
import { useCode } from '@/hooks/use-code'
import { useCharacterLimit } from '@/hooks/use-character-limit'
import { useRemainingRequests } from '@/hooks/use-remaining-requests'
import { useDetectedLanguage } from '@/hooks/use-detected-language'
import { CharacterLimitModal } from '../CharacterLimitModal'
import { RequestLimitModal } from './RequestLimitModal'
import { LanguageNotSupportedModal } from './LanguageNotSupportedModal'
import { StarBorder } from '@/components/ui/StarBorder'

// Valid actions
export type ActionKey = 'analyze' | 'optimize' | 'convert' | 'document'

// Design variants
export type ActionVariant = 'homepage' | 'layout'

// Supported languages list
const SUPPORTED_LANGUAGES = [
  'MATLAB',
  'SPSS', 
  'EVIEWS',
  'STATA',
  'JULIA',
  'SAS',
  'PYTHON',
  'R'
]

// Helper function to check if language is supported
const isLanguageSupported = (language: string): boolean => {
  return SUPPORTED_LANGUAGES.some(
    supportedLang => supportedLang.toLowerCase() === language.toLowerCase()
  )
}

// Descriptor for each action
interface ActionDescriptor {
  label: string
  icon: React.ComponentType<any>
  subname: string
  isLoading: boolean
  run: () => Promise<void>
}

/**
 * Builds a map of action descriptors. The 'convert' action must be overridden.
 */
export function useActionDescriptors(
  onOverrides: Partial<Record<ActionKey, () => Promise<void>>> = {}
) {
  const navigate = useNavigate()
  const { run: analyze, isLoading: isAnalyzing } = useAnalyze()
  const { run: optimize, isLoading: isOptimizing } = useOptimize()
  const { run: convert, isLoading: isConverting } = useConvert()
  const { run: documentIt, isLoading: isDocumenting } = useDocument()
  const { code } = useCode()
  const { isOverLimit } = useCharacterLimit(code)
  const { language: detectedLanguage } = useDetectedLanguage(code)

  const descriptors: Record<ActionKey, ActionDescriptor> = {
    analyze: {
      label: 'Code Sage',
      subname: 'Analyse',
      icon: BarChart3,
      isLoading: isAnalyzing,
      run: async () => {
        await analyze()
        navigate('/results/analyze')
      },
    },

    optimize: {
      label: 'Optimus',
      subname: 'Optimize',
      icon: Zap,
      isLoading: isOptimizing,
      run: async () => {
        await optimize()
        navigate('/results/optimize')
      },
    },

    convert: {
      label: 'Transform',
      subname: 'Convert',
      icon: FileCode,
      isLoading: isConverting,
      run: async () => {
        // Must be provided via override to supply source/target args
        if (!onOverrides.convert) {
          throw new Error('Convert action requires an override to open the language modal')
        }
        await onOverrides.convert()
      },
    },

    document: {
      label: 'Scribe',
      subname: 'Document',
      icon: FileText,
      isLoading: isDocumenting,
      run: async () => {
        await documentIt()
        navigate('/results/document')
      },
    },
  }

  return descriptors
}

// Get button styles based on variant
const getButtonStyles = (variant: ActionVariant, isDisabled?: boolean) => {
  const baseStyles = variant === 'homepage' 
    ? `
      flex items-center gap-2 px-6 py-4 rounded-xl
      text-white backdrop-blur-md
      transition-all duration-300
    `
    : `
      flex items-center gap-2 px-4 py-2 rounded-lg
      text-white backdrop-blur-md
      transition-all duration-300
    `

  if (isDisabled) {
    return `${baseStyles} opacity-50 cursor-not-allowed bg-black/40 border border-white/20`
  }

  return `${baseStyles} bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30`
}

// Get icon size based on variant
const getIconSize = (variant: ActionVariant) => {
  return variant === 'homepage' ? 'w-6 h-6' : 'w-4 h-4'
}

// Homepage Action Button with StarBorder
const HomepageActionButton: React.FC<{
  onClick: () => void
  disabled: boolean
  icon: React.ComponentType<any>
  label: string
  subname: string
}> = ({ onClick, disabled, icon: Icon, label, subname }) => {
  return (
    <StarBorder
      as="button"
      onClick={onClick}
      disabled={disabled}
      className="w-60 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      color="#878686"
      speed={disabled ? "0s" : "8s"}
    >
      <div className="flex items-center justify-center gap-2 text-white font-medium">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
        <span className="text-gray-400 text-sm">{subname}</span>
      </div>
    </StarBorder>
  )
}

interface ActionButtonProps {
  action: ActionKey
  variant?: ActionVariant
  onOverride?: () => Promise<void>
}

/**
 * Renders a button for a single action.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({ 
  action, 
  variant = 'homepage',
  onOverride 
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showRequestLimitModal, setShowRequestLimitModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const { code } = useCode()
  const { isOverLimit } = useCharacterLimit(code)
  const { hasRemainingRequests } = useRemainingRequests()
  const { language: detectedLanguage } = useDetectedLanguage(code)
  const descriptors = useActionDescriptors(onOverride ? { [action]: onOverride } : {})
  const { label, icon: Icon, isLoading, run } = descriptors[action]

  // Check if code is empty or only contains whitespace
  const isCodeEmpty = !code || code.trim().length === 0

  const handleAction = async () => {
    if (!hasRemainingRequests) {
      setShowRequestLimitModal(true)
      return
    }
    if (isOverLimit) {
      setShowLimitModal(true)
      return
    }
    
    // Check if detected language is supported
    if (detectedLanguage && !isLanguageSupported(detectedLanguage)) {
      setShowLanguageModal(true)
      return
    }
    
    await run()
  }

  // Use HomepageActionButton for homepage variant
  if (variant === 'homepage') {
    return (
      <>
        <HomepageActionButton
          onClick={handleAction}
          disabled={isLoading || isCodeEmpty}
          icon={Icon}
          label={label}
          subname={descriptors[action].subname}
        />

        <CharacterLimitModal
          isOpen={showLimitModal}
          onClose={() => setShowLimitModal(false)}
          currentCode={code}
        />

        <RequestLimitModal
          isOpen={showRequestLimitModal}
          onClose={() => setShowRequestLimitModal(false)}
        />

        <LanguageNotSupportedModal
          isOpen={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          detectedLanguage={detectedLanguage}
        />
      </>
    )
  }

  // Use regular button for layout variant
  return (
    <>
      <button
        onClick={handleAction}
        disabled={isLoading || isCodeEmpty}
        className={getButtonStyles(variant, isLoading || isCodeEmpty)}
      >
        <Icon className={getIconSize(variant)} />
        <span>{isLoading ? `${label}…` : label}</span>
      </button>

      <CharacterLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentCode={code}
      />

      <RequestLimitModal
        isOpen={showRequestLimitModal}
        onClose={() => setShowRequestLimitModal(false)}
      />

      <LanguageNotSupportedModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        detectedLanguage={detectedLanguage}
      />
    </>
  )
}

interface ActionMenuProps {
  actions: ActionKey[]
  variant?: ActionVariant
  /**
   * Supply custom run logic for actions, e.g. convert => open modal
   */
  onOverrides?: Partial<Record<ActionKey, () => Promise<void>>>
}

/**
 * Renders a horizontal set of action buttons.
 */
export const ActionMenu: React.FC<ActionMenuProps> = ({ 
  actions, 
  variant = 'homepage',
  onOverrides 
}) => {
  const [showLimitModal, setShowLimitModal] = useState(false)
  const [showRequestLimitModal, setShowRequestLimitModal] = useState(false)
  const [showLanguageModal, setShowLanguageModal] = useState(false)
  const { code } = useCode()
  const { isOverLimit } = useCharacterLimit(code)
  const { hasRemainingRequests } = useRemainingRequests()
  const { language: detectedLanguage } = useDetectedLanguage(code)
  const descriptors = useActionDescriptors(onOverrides)

  // Check if code is empty or only contains whitespace
  const isCodeEmpty = !code || code.trim().length === 0

  const handleAction = async (run: () => Promise<void>) => {
    if (!hasRemainingRequests) {
      setShowRequestLimitModal(true)
      return
    }
    if (isOverLimit) {
      setShowLimitModal(true)
      return
    }
    
    // Check if detected language is supported
    if (detectedLanguage && !isLanguageSupported(detectedLanguage)) {
      setShowLanguageModal(true)
      return
    }
    
    await run()
  }

  // Container styles based on variant
  const containerStyles = variant === 'homepage' 
    ? "flex items-center justify-center gap-4 p-4"
    : "flex items-center gap-4"

  const innerContainerStyles = variant === 'homepage'
    ? "flex gap-4 p-4"
    : "flex gap-4"

  return (
    <>
      <div className={containerStyles}>
        <div className={innerContainerStyles}>
          {actions.map(key => {
            const { label, icon: Icon, isLoading, run } = descriptors[key]
            
            // Use HomepageActionButton for homepage variant
            if (variant === 'homepage') {
              return (
                <HomepageActionButton
                  key={key}
                  onClick={() => handleAction(run)}
                  disabled={isLoading || isCodeEmpty}
                  icon={Icon}
                  label={label}
                  subname={descriptors[key].subname}
                />
              )
            }

            // Use regular button for layout variant
            return (
              <button
                key={key}
                onClick={() => handleAction(run)}
                disabled={isLoading || isCodeEmpty}
                className={getButtonStyles(variant, isLoading || isCodeEmpty)}
              >
                <Icon className={getIconSize(variant)} />
                <span>{isLoading ? `${label}…` : label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <CharacterLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        currentCode={code}
      />

      <RequestLimitModal
        isOpen={showRequestLimitModal}
        onClose={() => setShowRequestLimitModal(false)}
      />

      <LanguageNotSupportedModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        detectedLanguage={detectedLanguage}
      />
    </>
  )
}