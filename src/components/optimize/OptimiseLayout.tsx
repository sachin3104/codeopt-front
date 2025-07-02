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
    <div className="flex flex-col min-h-screen space-y-4">
      {/* Code Editors Section */}
      <div className="w-full h-[750px] overflow-hidden">
        <SyncCodeEditors
          originalCode={code}
          convertedCode={optimizationResult.optimized_code}
          isReadOnly={true}
          originalTitle="Original Code"
          convertedTitle="Optimized Code"
        />
      </div>

      {/* Performance Components - Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PerformanceGains />
        <ROIAnalysis />
      </div>

      {/* Flowchart Comparison */}
      <FlowchartComparison />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CodeQualityAnalysis />
      <PerformanceAnalysis />
      </div>

      <IssuesResolvedTable />
      <ExecutiveSummary />
      <NextSteps />

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