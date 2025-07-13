import { BarChart3, Zap, FileCode, FileText } from 'lucide-react'

// Valid actions
export type ActionKey = 'analyze' | 'optimize' | 'convert' | 'document'

// Design variants
export type ActionVariant = 'homepage' | 'layout'

// Supported languages list
export const SUPPORTED_LANGUAGES = [
  'MATLAB',
  'SPSS', 
  'EVIEWS',
  'STATA',
  'JULIA',
  'SAS',
  'PYTHON',
  'R'
] as const

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number]

// Descriptor for each action
export interface ActionDescriptor {
  label: string
  icon: React.ComponentType<any>
  subname: string
  isLoading: boolean
  run: () => Promise<void>
}

// Action configuration
export const ACTION_CONFIG = {
  analyze: {
    label: 'CodeSage',
    subname: 'Analyse',
    icon: BarChart3,
  },
  optimize: {
    label: 'Optimus',
    subname: 'Optimize',
    icon: Zap,
  },
  convert: {
    label: 'Transform',
    subname: 'Convert',
    icon: FileCode,
  },
  document: {
    label: 'Scribe',
    subname: 'Document',
    icon: FileText,
  },
} as const

// Validation result types
export type ValidationResult = 'valid' | 'request-limit' | 'character-limit' | 'language-not-supported'

// Modal types
export type ModalType = 'character-limit' | 'request-limit' | 'language-not-supported' 