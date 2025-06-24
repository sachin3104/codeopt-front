import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import SyncCodeEditors from '@/components/common/editor/SyncCodeEditors';
import { ActionMenu } from '../common/actions/CommonActionButtons';
import LanguageSelectModal from '../common/actions/LanguageSelectModal';

// Direct imports of optimize components
import PerformanceGains from './optimize-components/PerformanceGains';
import PerformanceAnalysis from './optimize-components/PerformanceAnalysis';
import ROIAnalysis from './optimize-components/ROIAnalysis';
import FlowchartComparison from './optimize-components/FlowchartComparison';
import CodeQualityAnalysis from './optimize-components/CodeQualityAnalysis';
import ExecutiveSummary from './optimize-components/ExecutiveSummary';
import NextSteps from './optimize-components/NextSteps';
import IssuesResolvedTable from './optimize-components/IssuesResolvedTable';

import { useOptimize } from '@/hooks/use-optimize';
import { useCode } from '@/hooks/use-code';
import { useConvert } from '@/hooks/use-convert';
import { useDocument } from '@/hooks/use-document';

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

  // --- Conversion context ---
  const {
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
    run: runConvert
  } = useConvert();

  // --- Documentation context ---
  const {
    isLoading: isDocumenting,
    error: documentError,
    clear: clearDocument,
    run: runDocument
  } = useDocument();

  // Combined error
  const error = optimizeError || convertError || documentError;

  const [showConvertModal, setShowConvertModal] = useState(false);

  // If we landed here without having run optimize yet, go back home
  useEffect(() => {
    if (initialized && !isOptimizing && !optimizationResult) {
      navigate('/', { replace: true });
    }
  }, [initialized, isOptimizing, optimizationResult, navigate]);

  // Handler for convert modal
  const handleConvert = async (from: string, to: string) => {
    try {
      await runConvert(from, to);
      navigate('/results/convert');
    } catch {/* error will show via convertError */}
  };

  const handleGoHome = () => {
    clearOptimize();
    clearConvert();
    clearDocument();
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
    <div className="flex flex-col min-h-screen space-y-6">
      {/* Header Section with ActionMenu */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-xl font-semibold text-white">Code Optimization Results</h2>
        <div className="flex items-center gap-4">
          {/* Use ActionMenu for convert and document */}
          <ActionMenu
            actions={['convert', 'document']}
            variant="layout"
            onOverrides={{
              convert: async () => setShowConvertModal(true),
            }}
          />
          
          {/* Back to Home button */}
          <button 
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
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

      {/* Performance Components - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PerformanceGains />
        <ROIAnalysis />
      </div>

      {/* Other Optimization Details */}
      <div className="space-y-8">
        <FlowchartComparison />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <CodeQualityAnalysis />
      <PerformanceAnalysis />
      </div>

      <div className="space-y-8">
        <IssuesResolvedTable />
        <ExecutiveSummary />
        <NextSteps />
      </div>


      

      {/* Convert Modal */}
      <LanguageSelectModal 
        isOpen={showConvertModal} 
        onClose={() => setShowConvertModal(false)} 
        onConvert={handleConvert}
      />

      {/* Combined error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default OptimiseLayout;