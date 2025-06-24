// src/components/analysis/AnalyseLayout.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

import CodeEditor from '../common/editor/CodeEditor'
import AnalysisDetails from './AnalysisDetails'
import AnalysisResultTabs from './AnalysisResultTabs'
import { ActionMenu } from '../common/actions/CommonActionButtons'
import LanguageSelectModal from '../common/actions/LanguageSelectModal'

import { useCode } from '@/hooks/use-code'
import { useAnalyze } from '@/hooks/use-analyze'
import { useOptimize } from '@/hooks/use-optimize'
import { useConvert } from '@/hooks/use-convert'
import { useDocument } from '@/hooks/use-document'

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

  // --- Optimization context ---
  const {
    isLoading: isOptimizing,
    error: optimizeError,
    clear: clearOptimize,
    run: runOptimize
  } = useOptimize()

  // --- Conversion context ---
  const {
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
    run: runConvert
  } = useConvert()

  // --- Documentation context ---
  const {
    isLoading: isDocumenting,
    error: documentError,
    clear: clearDocument,
    run: runDocument
  } = useDocument()

  // Combined error
  const error = analyzeError || optimizeError || convertError || documentError

  // Convert modal
  const [showConvertModal, setShowConvertModal] = useState(false)

  // If we landed here without having run analyze yet, kick it off
  useEffect(() => {
    if (initialized && !isAnalyzing && !analysisResult && code) {
      runAnalyze()
    }
  }, [initialized, code, isAnalyzing, analysisResult, runAnalyze])

  // Redirect home if not analyzing and still no result
  useEffect(() => {
    if (initialized && !isAnalyzing && !analysisResult) {
      navigate('/', { replace: true })
    }
  }, [initialized, isAnalyzing, analysisResult, navigate])

  // Handler for convert modal
  const handleConvert = async (from: string, to: string) => {
    try {
      await runConvert(from, to)
      navigate('/results/convert')
    } catch {/* error will show via convertError */}
  }

  const handleGoHome = () => {
    clearAnalyze()
    clearOptimize()
    clearConvert()
    clearDocument()
    navigate('/', { replace: true })
  }

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
    <div className="space-y-6 h-full flex flex-col">
      {/* Header with ActionMenu */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Code Analysis Results</h2>
        <div className="flex items-center gap-4">
          {/* Use ActionMenu for the three actions */}
          <ActionMenu
            actions={['optimize', 'convert', 'document']}
            variant="layout"
            onOverrides={{
              convert: async () => setShowConvertModal(true),
            }}
          />
          
          {/* Back to Home button */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <div className="flex flex-col">
          <div className="flex-1 min-h-0">
            <CodeEditor value={code} isReadOnly height="100%" />
          </div>
        </div>
        <AnalysisDetails analysisResult={analysisResult} />
      </div>

      {/* Tabs */}
      <AnalysisResultTabs />

      {/* Convert Modal */}
      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={handleConvert}
      />

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