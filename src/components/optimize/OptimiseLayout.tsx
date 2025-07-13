import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import SyncCodeEditors from '@/components/common/editor/SyncCodeEditors';

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

  // Optimization result loaded

  // If we landed here without having run optimize yet, go back home
  useEffect(() => {
    if (initialized && !isOptimizing && !optimizationResult) {
      navigate('/', { replace: true });
    }
  }, [initialized, isOptimizing, optimizationResult, navigate]);

  const handleGoHome = () => {
    clearOptimize();
    clearConvert();
    clearDocument();
    navigate('/', { replace: true });
  };

  // Loading state
  if (isOptimizing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center px-4 sm:px-6 md:px-8">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 xs:mb-4 sm:mb-4" />
          <p className="text-white/80 text-sm xs:text-base sm:text-lg">Optimizing your code…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (optimizeError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center max-w-sm xs:max-w-md sm:max-w-lg px-4 sm:px-6 md:px-8">
          <AlertTriangle className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 xs:mb-4 sm:mb-4" />
          <h3 className="text-base xs:text-lg sm:text-xl font-medium text-white mb-2 xs:mb-3 sm:mb-3">Optimization Failed</h3>
          <p className="text-gray-400 text-sm xs:text-base mb-4 xs:mb-4 sm:mb-4">{optimizeError}</p>
          <button
            onClick={handleGoHome}
            className="px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm xs:text-base transition-colors"
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
    <div className="flex flex-col min-h-screen space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
      {/* Code Editors Section */}
      <div className="w-full h-[400px] xs:h-[500px] sm:h-[600px] md:h-[650px] lg:h-[750px] overflow-hidden">
        <SyncCodeEditors
          originalCode={code}
          convertedCode={optimizationResult.optimized_code}
          isReadOnly={true}
          originalTitle="Original Code"
          convertedTitle="Optimized Code"
        />
      </div>

      {/* Performance Components - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        <PerformanceGains />
        <ROIAnalysis />
      </div>

      {/* Flowchart Comparison */}
      <FlowchartComparison />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        <CodeQualityAnalysis />
        <PerformanceAnalysis />
      </div>

      <div className="space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
        <IssuesResolvedTable />
        <ExecutiveSummary />
        <NextSteps />
      </div>

      {/* Combined error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded shadow-lg text-sm xs:text-base z-50">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default OptimiseLayout;