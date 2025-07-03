import React from 'react'
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface LanguageNotSupportedModalProps {
  isOpen: boolean
  onClose: () => void
  detectedLanguage: string
}

// Supported languages list
const SUPPORTED_LANGUAGES = [
  'MATLAB',
  'SPSS', 
  'EVIEWS',
  'STATA',
  'JULIA',
  'SAS',
  'PYTHON',
  'R'
]

export const LanguageNotSupportedModal: React.FC<LanguageNotSupportedModalProps> = ({
  isOpen,
  onClose,
  detectedLanguage,
}) => {
  const isLanguageSupported = SUPPORTED_LANGUAGES.some(
    lang => lang.toLowerCase() === detectedLanguage.toLowerCase()
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Language Not Supported
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Detected Language */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-2">Detected Language:</h4>
            <div className="flex items-center gap-2">
              {isLanguageSupported ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-red-400" />
              )}
              <span className={`text-sm ${isLanguageSupported ? 'text-green-400' : 'text-red-400'}`}>
                {detectedLanguage || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Supported Languages */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-2">Supported Languages:</h4>
            <div className="grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map((language) => (
                <div
                  key={language}
                  className={`flex items-center gap-2 p-2 rounded text-xs ${
                    language.toLowerCase() === detectedLanguage.toLowerCase()
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-white">{language}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-300">
              {detectedLanguage 
                ? `Sorry, ${detectedLanguage} is not currently supported. Please use one of the supported languages listed above.`
                : 'Unable to detect the programming language. Please ensure your code is written in one of the supported languages.'
              }
            </p>
          </div>

          {/* Action Button */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <span>Got it</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 