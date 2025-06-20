import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileCode, FileText, AlertTriangle } from 'lucide-react';
import SyncCodeEditors from '@/components/common/editor/SyncCodeEditors';
import OptimisationTabs from './OptimisationTabs';
import LanguageSelectModal from '../convert/LanguageSelectModal';
import { useOptimize } from '@/hooks/use-optimize';
import { useCode } from '@/hooks/use-code';

const OptimiseLayout: React.FC = () => {
  const navigate = useNavigate();
  const { code } = useCode();
  const {
    result: optimizationResult,
    isLoading: isOptimizing,
    error: optimizeError,
    clear: clearOptimize,
    initialized
  } = useOptimize();

  const [showConvertModal, setShowConvertModal] = useState(false);

  // If we landed here without having run optimize yet, go back home
  useEffect(() => {
    if (initialized && !isOptimizing && !optimizationResult) {
      navigate('/', { replace: true });
    }
  }, [initialized, isOptimizing, optimizationResult, navigate]);

  const handleGoHome = () => {
    clearOptimize();
    navigate('/', { replace: true });
  };

  // Loading state
  if (isOptimizing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white/80">Optimizing your code…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (optimizeError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Optimization Failed</h3>
          <p className="text-gray-400 mb-4">{optimizeError}</p>
          <button
            onClick={handleGoHome}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Guard against undefined/null result
  if (!optimizationResult) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen  space-y-6">
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
          originalCode={code}
          convertedCode={optimizationResult.optimized_code}
          isReadOnly={true}
          originalTitle="Original Code"
          convertedTitle="Optimized Code"
        />
      </div>

      {/* Optimization Details Tabs */}
      <div className="w-full">
        <OptimisationTabs
          optimizationResult={optimizationResult}
          originalCode={code}
        />
      </div>

      <LanguageSelectModal 
        isOpen={showConvertModal} 
        onClose={() => setShowConvertModal(false)} 
        onConvert={async () => {}} 
      />

      {/* Error toast */}
      {optimizeError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{optimizeError}</span>
        </div>
      )}
    </div>
  );
};

export default OptimiseLayout;
