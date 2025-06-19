// src/components/common/ActionButtons.tsx
import React, { useState } from 'react'
import { BarChart3, Zap, FileCode, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useCode }    from '@/hooks/use-code'
import { useAnalyze } from '@/hooks/use-analyze'
import { useOptimize } from '@/hooks/use-optimize'
import { useConvert }  from '@/hooks/use-convert'
import { useDocument } from '@/hooks/use-document'

import LanguageSelectModal from '../convert/LanguageSelectModal'

const ActionButtons: React.FC = () => {
  const navigate = useNavigate()
  const { code } = useCode()

  // grab each context hook
  const { run: analyze,    isLoading: isAnalyzing,    error: analyzeError,    clear: clearAnalyze }    = useAnalyze()
  const { run: optimize,   isLoading: isOptimizing,   error: optimizeError,   clear: clearOptimize }   = useOptimize()
  const { run: convert,    isLoading: isConverting,   error: convertError,    clear: clearConvert }    = useConvert()
  const { run: documentIt, isLoading: isDocumenting, error: documentError, clear: clearDocument } = useDocument()

  // any one of the 4 errors
  const error = analyzeError || optimizeError || convertError || documentError
  const clearError = () => {
    clearAnalyze()
    clearOptimize()
    clearConvert()
    clearDocument()
  }

  const [showConvertModal, setShowConvertModal] = useState(false)

  // disable if no code or any op in flight
  const busy =  isAnalyzing || isOptimizing || isConverting || isDocumenting

  return (
    <>
      <div className="flex items-center justify-center gap-4 p-4">
        <div className="flex gap-4 p-4 ">
          <button
            onClick={async () => {
              try {
                await analyze()
                navigate('/results/analyze')
              } catch { /* analyzeError will show */}
            }}
            disabled={busy}
            className="
              flex items-center gap-2 px-6 py-4 rounded-xl
              bg-white/10 hover:bg-white/20
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <BarChart3 className="w-6 h-6" />
            <span>{isAnalyzing ? 'Analyzing…' : 'Analyze'}</span>
          </button>
    
          <button
            onClick={async () => {
              try {
                await optimize()
                navigate('/results/optimize')
              } catch {}
            }}
            disabled={busy}
            className="
              flex items-center gap-2 px-6 py-4 rounded-xl
              bg-white/10 hover:bg-white/20
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <Zap className="w-6 h-6" />
            <span>{isOptimizing ? 'Optimizing…' : 'Optimize'}</span>
          </button>
    
          <button
            onClick={() => setShowConvertModal(true)}
            disabled={busy}
            className="
              flex items-center gap-2 px-6 py-4 rounded-xl
              bg-white/10 hover:bg-white/20
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <FileCode className="w-6 h-6" />
            <span>{isConverting ? 'Converting…' : 'Convert'}</span>
          </button>
    
          <button
            onClick={async () => {
              try {
                await documentIt()
                navigate('/results/document')
              } catch {}
            }}
            disabled={busy}
            className="
              flex items-center gap-2 px-6 py-4 rounded-xl
              bg-white/10 hover:bg-white/20
              text-white
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            "
          >
            <FileText className="w-6 h-6" />
            <span>{isDocumenting ? 'Documenting…' : 'Document'}</span>
          </button>
        </div>
      </div>
  
      <LanguageSelectModal
        isOpen={showConvertModal}
        onClose={() => setShowConvertModal(false)}
        onConvert={async (from, to) => {
          await convert(from, to)
          navigate('/results/convert')
        }}
      />
  
      {error && (
        <div className="error-toast">
          <span>{error}</span>
          <button onClick={clearError}>×</button>
        </div>
      )}
    </>
  )
  
}

export default ActionButtons
