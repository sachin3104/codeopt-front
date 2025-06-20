// src/components/LoadingOverlay.tsx
import React from 'react'
import { useLoading, LoadingVariant } from '@/context/LoadingContext'
import { MultiStepLoader } from '@/components/ui/MultiStepLoader'
import type { LoadingState } from '@/components/ui/MultiStepLoader'

// Define step sequences for each action
const STEP_MAP: Record<LoadingVariant, LoadingState[]> = {
  analyze: [
    { text: 'Parsing your code...' },
    { text: 'Running static analysis...' },
    { text: 'Analyzing code quality...' },
    { text: 'Gathering metrics...' },
    { text: 'Finalizing analysis...' },
    { text: 'Rendering results...' },
  ],
  optimize: [
    { text: 'Parsing your code...' },
    { text: 'Inspecting performance hotspots...' },
    { text: 'Creating the flowchart...' },
    { text: 'Refactoring AST nodes...' },
    { text: 'Applying optimization heuristics...' },
    { text: 'Checking for further optimizations...' },
    { text: 'Finalizing optimized code...' },
    { text: 'Rendering results...' },
  ],
  convert: [
    { text: 'Parsing your code...' },
    { text: 'Detecting source language...' },
    { text: 'Mapping syntax tree...' },
    { text: 'Generating target code...' },
    { text: 'Validating syntax...' },
    { text: 'Finalizing conversion...' },
    { text: 'Rendering results...' },
  ],
  document: [
    { text: 'Parsing your code...' },
    { text: 'Scanning code comments...' },
    { text: 'Building doc stubs...' },
    { text: 'Populating descriptions...' },
    { text: 'Finalizing documentation...' },
  ],
}

const LoadingOverlay: React.FC = () => {
  const { isLoading, variant } = useLoading()
  if (!isLoading || !variant) return null

  return (
    <MultiStepLoader
      loadingStates={STEP_MAP[variant]}
      loading={true}
      duration={30000}
      loop={false}
    />
  )
}

export default LoadingOverlay
