import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useCode } from '@/hooks/use-code'
import { useConvert } from '@/hooks/use-convert'
import { useDetectedLanguage } from '@/hooks/use-detected-language'

// Supported languages list
const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'r',      label: 'R' },
  { value: 'sas',    label: 'SAS' },
  { value: 'sql',    label: 'SQL' },
]

export interface LanguageSelectModalProps {
  /** Whether modal is visible */
  isOpen: boolean
  /** Close callback */
  onClose: () => void
  /** Called with detected or selected source and chosen target */
  onConvert: (from: string, to: string) => Promise<void>
}

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  onConvert,
}) => {
  const { code } = useCode()
  const detected = useDetectedLanguage(code)
  const {
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
  } = useConvert()

  // Local state for source + target
  const [sourceLanguage, setSourceLanguage] = useState<string>(detected || '')
  const [targetLanguage, setTargetLanguage] = useState<string>('')
  const [errorState, setErrorState] = useState<string>('')

  // Reset state whenever modal opens
  useEffect(() => {
    if (!isOpen) return
    clearConvert()
    setErrorState('')

    // Auto-detect or default to python
    const src = detected || 'python'
    setSourceLanguage(src)

    // Pick a default target different from source
    const fallback = SUPPORTED_LANGUAGES.find(l => l.value !== src)
    setTargetLanguage(fallback?.value || '')
  }, [isOpen, detected, clearConvert])

  const handleConvert = async () => {
    setErrorState('')
    try {
      await onConvert(sourceLanguage, targetLanguage)
      onClose()
    } catch (err: any) {
      setErrorState(err.message || 'Conversion failed')
    }
  }

  if (!isOpen) return null

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
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="font-medium">
                {SUPPORTED_LANGUAGES.find(l => l.value === sourceLanguage)?.label || 'Unknown'}
              </span>
              <span className="text-white/60 text-sm ml-auto">Auto-detected</span>
            </div>
          </div>
        </div>

          {/* Target dropdown */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={e => setTargetLanguage(e.target.value)}
              disabled={isConverting}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
            >
              {SUPPORTED_LANGUAGES.filter(l => l.value !== sourceLanguage).map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Error display */}
          {(convertError || errorState) && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm">
              {convertError || errorState}
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
            disabled={isConverting || !sourceLanguage || !targetLanguage}
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
