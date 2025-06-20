import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart3, Zap, FileCode, FileText } from 'lucide-react'
import { useAnalyze } from '@/hooks/use-analyze'
import { useOptimize } from '@/hooks/use-optimize'
import { useConvert } from '@/hooks/use-convert'
import { useDocument } from '@/hooks/use-document'

// Valid actions
export type ActionKey = 'analyze' | 'optimize' | 'convert' | 'document'

// Design variants
export type ActionVariant = 'homepage' | 'layout'

// Descriptor for each action
interface ActionDescriptor {
  label: string
  icon: React.ComponentType<any>
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

  const descriptors: Record<ActionKey, ActionDescriptor> = {
    analyze: {
      label: 'Analyze',
      icon: BarChart3,
      isLoading: isAnalyzing,
      run: async () => {
        await analyze()
        navigate('/results/analyze')
      },
    },

    optimize: {
      label: 'Optimize',
      icon: Zap,
      isLoading: isOptimizing,
      run: async () => {
        await optimize()
        navigate('/results/optimize')
      },
    },

    convert: {
      label: 'Convert',
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
      label: 'Document',
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
const getButtonStyles = (variant: ActionVariant) => {
  if (variant === 'homepage') {
    return `
      flex items-center gap-2 px-6 py-4 rounded-xl
      bg-white/10 hover:bg-white/20
      text-white
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
    `
  } else {
    // Layout variant - smaller, more compact
    return `
      flex items-center gap-2 px-4 py-2 rounded-lg
      bg-white/10 hover:bg-white/20
      text-white
      disabled:opacity-50 disabled:cursor-not-allowed
      transition-colors
    `
  }
}

// Get icon size based on variant
const getIconSize = (variant: ActionVariant) => {
  return variant === 'homepage' ? 'w-6 h-6' : 'w-4 h-4'
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
  const descriptors = useActionDescriptors(onOverride ? { [action]: onOverride } : {})
  const { label, icon: Icon, isLoading, run } = descriptors[action]

  return (
    <button
      onClick={run}
      disabled={isLoading}
      className={getButtonStyles(variant)}
    >
      <Icon className={getIconSize(variant)} />
      <span>{isLoading ? `${label}…` : label}</span>
    </button>
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
  const descriptors = useActionDescriptors(onOverrides)

  // Container styles based on variant
  const containerStyles = variant === 'homepage' 
    ? "flex items-center justify-center gap-4 p-4"
    : "flex items-center gap-4"

  const innerContainerStyles = variant === 'homepage'
    ? "flex gap-4 p-4"
    : "flex gap-4"

  return (
    <div className={containerStyles}>
      <div className={innerContainerStyles}>
        {actions.map(key => {
          const { label, icon: Icon, isLoading, run } = descriptors[key]
          return (
            <button
              key={key}
              onClick={run}
              disabled={isLoading}
              className={getButtonStyles(variant)}
            >
              <Icon className={getIconSize(variant)} />
              <span>{isLoading ? `${label}…` : label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}