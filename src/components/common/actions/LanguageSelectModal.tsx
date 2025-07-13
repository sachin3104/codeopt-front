import React, { useState, useEffect, useMemo } from 'react'
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

  // Check if detected language is supported - memoized to prevent unnecessary re-computations
  const isSourceSupported = useMemo(() => 
    SOURCE_LANGUAGES.some(l => l.value === detectedLanguage),
    [detectedLanguage]
  )

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
      <div className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-4 xs:p-5 sm:p-6 md:p-8 lg:p-10 rounded-lg xs:rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-2xl border border-white/20 w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-2 xs:mx-3 sm:mx-4 md:mx-6 lg:mx-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 xs:mb-5 sm:mb-6 md:mb-8 lg:mb-10">
          <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white">Select Languages</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-1 xs:p-1.5 sm:p-2 md:p-2.5 hover:bg-white/10 rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl"
          >
            <X size={20} className="xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8">
          {/* Source dropdown */}
          <div>
            <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-medium text-white/80 mb-2 xs:mb-3 sm:mb-3 md:mb-4">
              Detected Source Language
            </label>
            <div className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-3 sm:py-3 md:py-4 lg:py-5 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white backdrop-blur-sm">
              <div className="flex items-center gap-2 xs:gap-2.5 sm:gap-3">
                {isDetectingLanguage ? (
                  <>
                    <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full bg-blue-400 animate-pulse"></div>
                    <span className="font-medium text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg">Detecting language...</span>
                    <span className="text-white/60 text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base ml-auto">Please wait</span>
                  </>
                ) : (
                  <>
                    <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full ${isSourceSupported ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <span className="font-medium text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg">
                      {getLanguageDisplayName(sourceLanguage)}
                    </span>
                    <span className="text-white/60 text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base ml-auto">
                      {isSourceSupported ? 'Auto-detected' : 'Not supported'}
                    </span>
                  </>
                )}
              </div>
            </div>
            {!isSourceSupported && sourceLanguage && !isDetectingLanguage && (
              <p className="mt-2 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-yellow-400/80">
                Conversion from {getLanguageDisplayName(sourceLanguage)} is not supported. 
                Supported source languages: MATLAB, SPSS, EVIEWS, STATA, JULIA, SAS, PYTHON, R.
              </p>
            )}
          </div>

          {/* Target dropdown */}
          <div>
            <label className="block text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-medium text-white/80 mb-2 xs:mb-3 sm:mb-3 md:mb-4">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              disabled={isConverting || !isSourceSupported}
              className="w-full px-3 xs:px-4 sm:px-4 md:px-5 lg:px-6 py-2 xs:py-3 sm:py-3 md:py-4 lg:py-5 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
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
            <div className="p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg backdrop-blur-sm">
              <div className="font-medium mb-1 xs:mb-2 sm:mb-2 md:mb-3">Network error</div>
              <div className="text-white/80">
                Please contact support@optqo.ai for assistance.
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10">
          <button
            onClick={onClose}
            className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            disabled={isConverting || !sourceLanguage || !targetLanguage || !isSourceSupported}
            className="px-3 xs:px-4 sm:px-5 md:px-6 lg:px-8 py-2 xs:py-2.5 sm:py-3 md:py-3.5 lg:py-4 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-blue-600/90 text-white font-medium hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-500/20 text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
          >
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelectModal
