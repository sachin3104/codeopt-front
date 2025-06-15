import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, FileCode, FileText } from 'lucide-react';
import { useCode } from '@/context/CodeContext';
import { useNavigate } from 'react-router-dom';
import LanguageSelectModal from '../convert-result/LanguageSelectModal';

const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  const {
    handleAnalyze,
    handleOptimize,
    handleDocument,
    isAnalyzing,
    isOptimizing,
    isDocumenting,
    error,
    clearError,
    documentedCode,
    code,
    optimizationResult,
    analysisResult,
    convertedCode
  } = useCode();

  const [showConvertModal, setShowConvertModal] = useState(false);

  // Effect to navigate to document page when documentation is ready
  useEffect(() => {
    if (documentedCode && !isDocumenting) {
      navigate('/results/document', { state: { documentedCode } });
    }
  }, [documentedCode, isDocumenting, navigate]);

  // Effect to navigate to optimize page when optimization is complete
  useEffect(() => {
    if (optimizationResult && !isOptimizing) {
      navigate('/results/optimize', { state: { optimizationResult } });
    }
  }, [optimizationResult, isOptimizing, navigate]);

  // Effect to navigate to analyse page when analysis is complete
  useEffect(() => {
    if (analysisResult && !isAnalyzing) {
      navigate('/results/analyze', { state: { analysisResult } });
    }
  }, [analysisResult, isAnalyzing, navigate]);

  // Effect to navigate to convert page when conversion is complete
  useEffect(() => {
    if (convertedCode) {
      navigate('/results/convert', { state: { convertedCode } });
    }
  }, [convertedCode, navigate]);

  // Debug log for code state
  useEffect(() => {
    console.log('ActionButtons - Current code state:', {
      hasCode: !!code,
      codeLength: code?.length
    });
  }, [code]);

  return (
    <>
      <div className="flex items-center justify-center gap-4 p-4">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || isOptimizing || isDocumenting || !code}
          className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BarChart3 className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium">
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </span>
        </button>

        <button
          onClick={handleOptimize}
          disabled={isAnalyzing || isOptimizing || isDocumenting || !code}
          className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium">
            {isOptimizing ? 'Optimizing...' : 'Optimize'}
          </span>
        </button>

        <button
          onClick={() => setShowConvertModal(true)}
          disabled={isAnalyzing || isOptimizing || isDocumenting || !code}
          className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileCode className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium">Convert</span>
        </button>

        <button
          onClick={handleDocument}
          disabled={isAnalyzing || isOptimizing || isDocumenting || !code}
          className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium">
            {isDocumenting ? 'Documenting...' : 'Document'}
          </span>
        </button>
      </div>

      <LanguageSelectModal 
        isOpen={showConvertModal} 
        onClose={() => setShowConvertModal(false)} 
      />

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-2 hover:text-white/80"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default ActionButtons; 