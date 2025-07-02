// src/components/analysis/AnalyseLayout.tsx
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

import CodeEditor from '../common/editor/CodeEditor'
import AnalysisDetails from './AnalysisDetails'
import { OptimizationOpportunities, FunctionalityAnalysis } from './analyze-components'

import { useCode } from '@/hooks/use-code'
import { useAnalyze } from '@/hooks/use-analyze'

const AnalyseLayout: React.FC = () => {
  const navigate = useNavigate()
  const { code } = useCode()

  // --- Analysis context ---
  const {
    result: analysisResult,
    isLoading: isAnalyzing,
    error: analyzeError,
    clear: clearAnalyze,
    run: runAnalyze,
    initialized
  } = useAnalyze()

  // Combined error
  const error = analyzeError

  // If we landed here without having run analyze yet, kick it off
  useEffect(() => {
    if (initialized && !isAnalyzing && !analysisResult && code) {
      runAnalyze()
    }
  }, [initialized, code, isAnalyzing, analysisResult, runAnalyze])

  // Analysis result loaded

  // Redirect home if not analyzing and still no result
  useEffect(() => {
    if (initialized && !isAnalyzing && !analysisResult) {
      navigate('/', { replace: true })
    }
  }, [initialized, isAnalyzing, analysisResult, navigate])

  // Loading state
  if (isAnalyzing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white/80">Analyzing your code…</p>
        </div>
      </div>
    )
  }

  // Error state
  if (analyzeError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Analysis Failed</h3>
          <p className="text-gray-400 mb-4">{analyzeError}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Shouldn't happen—guard above handles it
  if (!analysisResult) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen space-y-4">
      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <div className="flex-1 min-h-0">
            {/* Wrapper div with dashboard component styling */}
            <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-full">
              <CodeEditor value={code} isReadOnly height="100%" variant="results" title="Analyzed Code" />
            </div>
          </div>
        </div>
        <AnalysisDetails analysisResult={analysisResult} />
      </div>

      {/* Analysis Results */}
      <OptimizationOpportunities />
      <FunctionalityAnalysis />

      {/* Combined toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{error}</span>
        </div>
      )}

    </div>
  )
}

export default AnalyseLayout