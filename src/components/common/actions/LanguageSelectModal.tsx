import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { useCode } from '@/hooks/use-code'
import { useConvert } from '@/hooks/use-convert'
import { useDetectedLanguage } from '@/hooks/use-detected-language'

// Source languages (what users can convert FROM)
const SOURCE_LANGUAGES = [
  { value: 'matlab', label: 'MATLAB' },
  { value: 'spss',   label: 'SPSS' },
  { value: 'eviews', label: 'EVIEWS' },
  { value: 'stata',  label: 'STATA' },
  { value: 'julia',  label: 'JULIA' },
  { value: 'sas',    label: 'SAS' },
  { value: 'python', label: 'PYTHON' },
  { value: 'r',      label: 'R' },
]

// Target languages (what users can convert TO)
const TARGET_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'r',      label: 'R' },
  { value: 'sas',    label: 'SAS' },
]



export interface LanguageSelectModalProps {
  /** Whether modal is visible */
  isOpen: boolean
  /** Close callback */
  onClose: () => void
}

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const { code } = useCode()
  const {
    language: detectedLanguage,
    loading: isDetectingLanguage,
    error: detectLanguageError
  } = useDetectedLanguage(code)
  const {
    run: convertRun,
    isLoading: isConverting,
    error: convertError,
  } = useConvert()

  // Local state for source + target
  const [sourceLanguage, setSourceLanguage] = useState<string>(detectedLanguage || '')
  const [targetLanguage, setTargetLanguage] = useState<string>('')
  const [errorState, setErrorState] = useState<string>('')

  // Check if detected language is supported
  const isSourceSupported = SOURCE_LANGUAGES.some(l => l.value === detectedLanguage)

  // Reset state whenever modal opens
  useEffect(() => {
    if (!isOpen) return
    setErrorState('')

    // Use the actual detected language
    setSourceLanguage(detectedLanguage || '')

    // Pick a default target different from source if source is supported
    if (isSourceSupported && detectedLanguage) {
      const fallback = TARGET_LANGUAGES.find(l => l.value !== detectedLanguage)
      setTargetLanguage(fallback?.value || '')
    } else {
      // If source is not supported, just pick the first supported language as target
      setTargetLanguage(TARGET_LANGUAGES[0]?.value || '')
    }
  }, [isOpen, detectedLanguage, isSourceSupported])

  const handleConvert = async () => {
    setErrorState('')
    try {
      await convertRun(sourceLanguage, targetLanguage)
      onClose()
      navigate('/results/convert')
    } catch (err: any) {
      setErrorState(err.message || 'Conversion failed')
    }
  }

  if (!isOpen) return null

  // Capitalize first letter (or show "Unknown")
  const getLanguageDisplayName = (lang: string) =>
    lang
      ? lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()
      : 'Unknown'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">Select Languages</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6">
          {/* Source dropdown */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Detected Source Language
            </label>
            <div className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white backdrop-blur-sm">
              <div className="flex items-center gap-2">
                {isDetectingLanguage ? (
                  <>
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="font-medium">Detecting language...</span>
                    <span className="text-white/60 text-sm ml-auto">Please wait</span>
                  </>
                ) : (
                  <>
                    <div className={`w-2 h-2 rounded-full ${isSourceSupported ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className="font-medium">
                      {getLanguageDisplayName(sourceLanguage)}
                    </span>
                    <span className="text-white/60 text-sm ml-auto">
                      {isSourceSupported ? 'Auto-detected' : 'Not supported'}
                    </span>
                  </>
                )}
              </div>
            </div>
            {!isSourceSupported && sourceLanguage && !isDetectingLanguage && (
              <p className="mt-2 text-sm text-yellow-400/80">
                Conversion from {getLanguageDisplayName(sourceLanguage)} is not supported. 
                Supported source languages: MATLAB, SPSS, EVIEWS, STATA, JULIA, SAS, PYTHON, R.
              </p>
            )}
          </div>

          {/* Target dropdown */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              disabled={isConverting || !isSourceSupported}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {TARGET_LANGUAGES.filter(l => l.value !== sourceLanguage).map(lang => (
                <option key={lang.value} value={lang.value} className="bg-gray-900">
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error display */}
          {(convertError || errorState || detectLanguageError) && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm">
              <div className="font-medium mb-2">Network error</div>
              <div className="text-white/80">
                Please contact support@optqo.ai for assistance.
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            disabled={isConverting || !sourceLanguage || !targetLanguage || !isSourceSupported}
            className="px-6 py-3 rounded-xl bg-blue-600/90 text-white font-medium hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-500/20"
          >
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelectModal
