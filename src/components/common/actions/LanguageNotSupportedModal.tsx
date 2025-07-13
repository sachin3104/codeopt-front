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
      <DialogContent className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 backdrop-blur-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
            <AlertTriangle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-400" />
            Language Not Supported
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          {/* Detected Language */}
          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-medium text-white mb-1 xs:mb-2 sm:mb-2 md:mb-3">Detected Language:</h4>
            <div className="flex items-center gap-2">
              {isLanguageSupported ? (
                <CheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 text-red-400" />
              )}
              <span className={`text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg ${isLanguageSupported ? 'text-green-400' : 'text-red-400'}`}>
                {detectedLanguage || 'Unknown'}
              </span>
            </div>
          </div>

          {/* Supported Languages */}
          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-medium text-white mb-1 xs:mb-2 sm:mb-2 md:mb-3">Supported Languages:</h4>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 xs:gap-2 sm:gap-2 md:gap-3">
              {SUPPORTED_LANGUAGES.map((language) => (
                <div
                  key={language}
                  className={`flex items-center gap-1.5 xs:gap-2 sm:gap-2 md:gap-2.5 p-1.5 xs:p-2 sm:p-2 md:p-2.5 lg:p-3 rounded text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base ${
                    language.toLowerCase() === detectedLanguage.toLowerCase()
                      ? 'bg-green-500/20 border border-green-500/30'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <CheckCircle className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 text-green-400" />
                  <span className="text-white">{language}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-red-500/10 border border-red-500/20">
            <p className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg text-red-300">
              {detectedLanguage 
                ? `Sorry, ${detectedLanguage} is not currently supported. Please use one of the supported languages listed above.`
                : 'Unable to detect the programming language. Please ensure your code is written in one of the supported languages.'
              }
            </p>
          </div>

          {/* Action Button */}
          <div className="flex gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-5 pt-2 xs:pt-3 sm:pt-4 md:pt-5 lg:pt-6">
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-1 xs:gap-2 sm:gap-2 md:gap-3 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
            >
              <span>Got it</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 