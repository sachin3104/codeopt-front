import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCode, FileText, Zap } from 'lucide-react';
import CodeEditor from '../editor/CodeEditor';
import { useCode } from '@/context/CodeContext';
import AnalysisResultTabs from './AnalysisResultTabs';
import AnalysisDetails from './AnalysisDetails';
import LanguageSelectModal from '../convert-result/LanguageSelectModal';

const AnalyseLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code } = useCode();
  const { analysisResult } = location.state || {};
  const { 
    handleOptimize,
    handleDocument,
    handleConvert,
    clearAllState,
    isOptimizing,
    isDocumenting,
    documentedCode,
    convertedCode,
    optimizationResult
  } = useCode();
  const [showConvertModal, setShowConvertModal] = useState(false);

  const handleGoHome = () => {
    clearAllState();
    navigate('/', { replace: true });
  };

  // Effect to navigate to document page when documentation is ready
  useEffect(() => {
    if (documentedCode && !isDocumenting) {
      navigate('/results/document', { state: { documentedCode } });
    }
  }, [documentedCode, isDocumenting, navigate]);

  // Effect to navigate to convert page when conversion is complete
  useEffect(() => {
    if (convertedCode) {
      navigate('/results/convert', { state: { convertedCode } });
    }
  }, [convertedCode, navigate]);

  // Effect to navigate to optimize page when optimization is complete
  useEffect(() => {
    if (optimizationResult && !isOptimizing) {
      navigate('/results/optimize', { state: { optimizationResult, originalCode: code } });
    }
  }, [optimizationResult, isOptimizing, navigate, code]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header with Action Buttons */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Code Analysis Results</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            <span>{isOptimizing ? 'Optimizing...' : 'Optimize'}</span>
          </button>

          <button
            onClick={() => setShowConvertModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <FileCode className="w-4 h-4" />
            <span>Convert</span>
          </button>

          <button
            onClick={handleDocument}
            disabled={isDocumenting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-4 h-4" />
            <span>{isDocumenting ? 'Documenting...' : 'Document'}</span>
          </button>

          <button 
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Main content area - Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        {/* Left side - Code Editor */}
        <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-3xl border border-white/20 shadow-2xl p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-white/90 mb-4">Original Code</h2>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              isReadOnly={true}
              height="100%"
            />
          </div>
        </div>

        {/* Right side - Analysis Details */}
        <AnalysisDetails analysisResult={analysisResult} />
      </div>

      {/* Bottom section - Analysis Results Tabs */}
      <AnalysisResultTabs />

      <LanguageSelectModal 
        isOpen={showConvertModal} 
        onClose={() => setShowConvertModal(false)} 
      />
    </div>
  );
};

export default AnalyseLayout;