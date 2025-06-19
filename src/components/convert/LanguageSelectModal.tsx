import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
import { useConvert } from '@/hooks/use-convert';

// Define supported languages
const SUPPORTED_LANGUAGES = [
  { value: 'python', label: 'Python' },
  { value: 'r', label: 'R' },
  { value: 'sas', label: 'SAS' },
  { value: 'sql', label: 'SQL' }
];

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (from: string, to: string) => Promise<void>;
}

const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({ isOpen, onClose, onConvert }) => {
  const { code } = useCode();
  const { isLoading: isConverting, error: convertError, clear: clearConvert } = useConvert();
  const [sourceLanguage, setSourceLanguage] = useState('python');
  const [targetLanguage, setTargetLanguage] = useState('r');
  const [errorState, setErrorState] = useState('');

  // Debug log when modal opens and reset errors
  useEffect(() => {
    if (isOpen) {
      console.log('Modal opened. Current state:', {
        hasCode: !!code,
        codeLength: code?.length,
        isConverting
      });
      // Reset both errors when modal opens
      setErrorState('');
      clearConvert();
    }
  }, [isOpen, code, isConverting, clearConvert]);

  const handleConvertClick = async () => {
    console.log('Starting conversion...', {
      sourceLanguage,
      targetLanguage,
      hasCode: !!code,
      codeLength: code?.length
    });

    try {
      // Call the parent's onConvert function
      await onConvert(sourceLanguage, targetLanguage);
      
      // Close the modal after successful conversion
      console.log('Conversion completed successfully');
      onClose();
      
    } catch (err) {
      console.error('Conversion failed:', err);
      setErrorState(err instanceof Error ? err.message : 'Failed to convert code');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 p-8 rounded-3xl shadow-2xl border border-white/20 w-full max-w-md">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-white">Select Languages</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Source Language
            </label>
            <select
              value={sourceLanguage}
              onChange={(e) => setSourceLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              disabled={isConverting}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">
              Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => setTargetLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 backdrop-blur-sm transition-all duration-300 hover:bg-white/10"
              disabled={isConverting}
            >
              {SUPPORTED_LANGUAGES
                .filter(lang => lang.value !== sourceLanguage)
                .map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
            </select>
          </div>

          {(convertError || errorState) && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm backdrop-blur-sm">
              {convertError || errorState}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => handleConvertClick()}
            disabled={isConverting || !code}
            className="px-6 py-3 rounded-xl bg-blue-600/90 text-white font-medium hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm border border-blue-500/20"
          >
            {isConverting ? 'Converting...' : 'Convert'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectModal;
