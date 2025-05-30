// LanguageWarningBanner.tsx
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface LanguageWarningBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  detectedLanguage?: string;
}

const LanguageWarningBanner: React.FC<LanguageWarningBannerProps> = ({
  isVisible,
  onDismiss,
  detectedLanguage
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-3 mb-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-yellow-200 font-medium text-sm mb-1">
            Unsupported Language Detected
          </h4>
          <p className="text-yellow-100 text-sm">
            {detectedLanguage 
              ? `Detected language: ${detectedLanguage}. `
              : ''
            }
            Code conversion only supports <strong>Python</strong>, <strong>R</strong>, and <strong>SAS</strong> as input languages. 
            Please ensure your code is written in one of these languages to use the conversion feature.
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-yellow-400 hover:text-yellow-300 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default LanguageWarningBanner;