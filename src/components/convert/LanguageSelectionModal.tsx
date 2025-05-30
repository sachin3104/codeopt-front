import React from 'react';
import { X, ArrowRight, FileCode, Code2, Database, BarChart3 } from 'lucide-react';

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (targetLanguage: 'python' | 'r' | 'sas') => void;
  sourceLanguage: 'python' | 'r' | 'sas';
  isConverting: boolean;
  selectedLanguage: 'python' | 'r' | 'sas' | null;
  onLanguageSelect: (language: 'python' | 'r' | 'sas') => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onConvert,
  sourceLanguage,
  isConverting,
  selectedLanguage,
  onLanguageSelect
}) => {
  const languages = [
    { 
      id: 'python' as const, 
      name: 'Python', 
      icon: Code2, 
      gradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-400'
    },
    { 
      id: 'r' as const, 
      name: 'R', 
      icon: BarChart3, 
      gradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-400'
    },
    { 
      id: 'sas' as const, 
      name: 'SAS', 
      icon: Database, 
      gradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-400'
    }
  ];

  // Filter out the source language from target options
  const availableLanguages = languages.filter(lang => lang.id !== sourceLanguage);

  const handleConvert = () => {
    if (selectedLanguage && selectedLanguage !== sourceLanguage) {
      onConvert(selectedLanguage);
    }
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .glass-modal-overlay {
          backdrop-filter: blur(8px);
          background: rgba(0, 0, 0, 0.6);
        }
        
        .glass-modal-container {
          backdrop-filter: blur(20px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 25px 45px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        .glass-modal-close-btn {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .glass-modal-close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        
        .glass-language-card {
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        
        .glass-language-card:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%);
          border-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .glass-language-card.selected {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.2) 0%, 
            rgba(37, 99, 235, 0.1) 100%);
          border-color: rgba(59, 130, 246, 0.6);
          box-shadow: 
            0 0 20px rgba(59, 130, 246, 0.3),
            0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .glass-icon-container {
          backdrop-filter: blur(8px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-source-display {
          backdrop-filter: blur(10px);
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 100%);
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        
        .glass-button {
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .glass-button-cancel {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-button-cancel:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.15) 0%, 
            rgba(255, 255, 255, 0.08) 100%);
          transform: translateY(-1px);
        }
        
        .glass-button-convert {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.8) 0%, 
            rgba(37, 99, 235, 0.9) 100%);
          border: 1px solid rgba(59, 130, 246, 0.5);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
        
        .glass-button-convert:hover:not(:disabled) {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 0.9) 0%, 
            rgba(37, 99, 235, 1) 100%);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
        }
        
        .glass-button-convert:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .glass-selection-indicator {
          background: linear-gradient(135deg, 
            rgba(59, 130, 246, 1) 0%, 
            rgba(37, 99, 235, 1) 100%);
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.6);
        }
      `}</style>

      <div className="fixed inset-0 glass-modal-overlay flex items-center justify-center z-50">
        <div className="glass-modal-container rounded-2xl p-8 w-full max-w-md mx-4 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 glass-modal-close-btn rounded-full p-2"
            disabled={isConverting}
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Modal content */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3 text-white">
              <div className="glass-icon-container rounded-xl p-2">
                <FileCode className="w-6 h-6 text-blue-400" />
              </div>
              Convert Code
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Transform your code into a different programming language while maintaining functionality and structure.
            </p>
          </div>

          {/* Source language display */}
          <div className="mb-6 glass-source-display rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-2 font-medium">From:</div>
            <div className="font-semibold text-white text-lg">
              {sourceLanguage === 'r' ? 'R' : sourceLanguage.charAt(0).toUpperCase() + sourceLanguage.slice(1)}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-6">
            <div className="glass-icon-container rounded-full p-3">
              <ArrowRight className="w-6 h-6 text-gray-300" />
            </div>
          </div>

          {/* Target language selection */}
          <div className="mb-8">
            <div className="text-sm text-gray-400 mb-4 font-medium">To:</div>
            <div className="space-y-3">
              {availableLanguages.length > 0 ? (
                availableLanguages.map((lang) => {
                  const IconComponent = lang.icon;
                  return (
                    <button
                      key={lang.id}
                      onClick={() => onLanguageSelect(lang.id)}
                      disabled={isConverting}
                      className={`w-full p-4 rounded-xl glass-language-card flex items-center gap-4 ${
                        selectedLanguage === lang.id ? 'selected' : ''
                      } ${isConverting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="glass-icon-container w-12 h-12 rounded-xl flex items-center justify-center">
                        <IconComponent className={`w-6 h-6 ${lang.iconColor}`} />
                      </div>
                      <span className="font-semibold text-white text-lg flex-1 text-left">{lang.name}</span>
                      {selectedLanguage === lang.id && (
                        <div className="glass-selection-indicator w-3 h-3 rounded-full"></div>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="text-center text-gray-400 py-8 glass-source-display rounded-xl">
                  <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No other languages available for conversion</p>
                </div>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isConverting}
              className="flex-1 px-6 py-3 glass-button glass-button-cancel rounded-xl font-semibold text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleConvert}
              disabled={!selectedLanguage || isConverting}
              className="flex-1 px-6 py-3 glass-button glass-button-convert rounded-xl font-semibold text-white flex items-center justify-center gap-2"
            >
              {isConverting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Converting...
                </>
              ) : (
                <>
                  <Code2 className="w-5 h-5" />
                  Convert
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LanguageSelectionModal;