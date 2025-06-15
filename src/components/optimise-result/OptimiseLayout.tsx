import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCode, FileText } from 'lucide-react';
import SyncCodeEditors from '@/components/editor/SyncCodeEditors';
import OptimisationTabs from './OptimisationTabs';
import { type OptimizationResult } from '@/api/service';
import { useCode } from '@/context/CodeContext';
import LanguageSelectModal from '../convert-result/LanguageSelectModal';

interface OptimizeResultState {
  optimizationResult: OptimizationResult;
  originalCode: string;
}

const OptimiseLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { optimizationResult, originalCode } = location.state as OptimizeResultState;
  const { 
    handleDocument, 
    handleConvert, 
    clearAllState,
    documentedCode,
    isDocumenting,
    convertedCode
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

  return (
    <div className="flex flex-col min-h-screen p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Code Optimization Results</h2>
        <div className="flex items-center gap-4">
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

      {/* Code Editors Section */}
      <div className="w-full h-[600px] overflow-hidden">
        <SyncCodeEditors
          originalCode={originalCode}
          convertedCode={optimizationResult.optimizedCode}
          isReadOnly={true}
        />
      </div>

      {/* Optimization Details Tabs */}
      <div className="w-full">
        <OptimisationTabs
          optimizationResult={optimizationResult}
          originalCode={originalCode}
        />
      </div>

      <LanguageSelectModal 
        isOpen={showConvertModal} 
        onClose={() => setShowConvertModal(false)} 
      />
    </div>
  );
};

export default OptimiseLayout;
