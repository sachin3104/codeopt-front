import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnalyze } from './use-analyze'
import { useOptimize } from './use-optimize'
import { useConvert } from './use-convert'
import { useDocument } from './use-document'
import { ActionKey, ActionDescriptor, ACTION_CONFIG } from '@/types/action'

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

  const descriptors: Record<ActionKey, ActionDescriptor> = useMemo(() => ({
    analyze: {
      label: ACTION_CONFIG.analyze.label,
      subname: ACTION_CONFIG.analyze.subname,
      icon: ACTION_CONFIG.analyze.icon,
      isLoading: isAnalyzing,
      run: async () => {
        await analyze()
        navigate('/results/analyze')
      },
    },

    optimize: {
      label: ACTION_CONFIG.optimize.label,
      subname: ACTION_CONFIG.optimize.subname,
      icon: ACTION_CONFIG.optimize.icon,
      isLoading: isOptimizing,
      run: async () => {
        await optimize()
        navigate('/results/optimize')
      },
    },

    convert: {
      label: ACTION_CONFIG.convert.label,
      subname: ACTION_CONFIG.convert.subname,
      icon: ACTION_CONFIG.convert.icon,
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
      label: ACTION_CONFIG.document.label,
      subname: ACTION_CONFIG.document.subname,
      icon: ACTION_CONFIG.document.icon,
      isLoading: isDocumenting,
      run: async () => {
        await documentIt()
        navigate('/results/document')
      },
    },
  }), [
    navigate,
    analyze,
    isAnalyzing,
    optimize,
    isOptimizing,
    convert,
    isConverting,
    documentIt,
    isDocumenting,
    onOverrides.convert
  ])

  return descriptors
} 