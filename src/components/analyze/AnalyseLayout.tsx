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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center px-4 sm:px-6 md:px-8">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 xs:mb-4 sm:mb-4" />
          <p className="text-white/80 text-sm xs:text-base sm:text-lg">Analyzing your code…</p>
        </div>
      </div>
    )
  }

  // Error state
  if (analyzeError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center max-w-sm xs:max-w-md sm:max-w-lg px-4 sm:px-6 md:px-8">
          <AlertTriangle className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 xs:mb-4 sm:mb-4" />
          <h3 className="text-base xs:text-lg sm:text-xl font-medium text-white mb-2 xs:mb-3 sm:mb-3">Analysis Failed</h3>
          <p className="text-gray-400 text-sm xs:text-base mb-4 xs:mb-4 sm:mb-4">{analyzeError}</p>
          <button
            onClick={() => navigate('/', { replace: true })}
            className="px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm xs:text-base transition-colors"
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
    <div className="flex flex-col min-h-screen space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
      {/* Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        <div className="flex flex-col">
          <div className="flex-1 min-h-0">
            {/* Wrapper div with dashboard component styling */}
            <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden h-[400px] xs:h-[450px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-full">
              <CodeEditor 
                value={code} 
                isReadOnly 
                height="100%" 
                variant="results" 
                title="Analyzed Code" 
                language={analysisResult?.language}
              />
            </div>
          </div>
        </div>
        <AnalysisDetails analysisResult={analysisResult} />
      </div>

      {/* Analysis Results */}
      <div className="space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
        <OptimizationOpportunities />
        <FunctionalityAnalysis />
      </div>

      {/* Combined toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded shadow-lg text-sm xs:text-base z-50">
          <span>{error}</span>
        </div>
      )}

    </div>
  )
}

export default AnalyseLayout