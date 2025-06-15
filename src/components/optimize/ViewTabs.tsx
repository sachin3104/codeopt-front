import React from 'react';
import { AnalysisResult, OptimizationResult } from '@/api/service';

interface ViewTabsProps {
  activeView: "analysis" | "optimization" | "convert" | "document" | null;
  setActiveView: (view: "analysis" | "optimization" | "convert" | "document") => void;
  analysisResults: AnalysisResult | null;
  optimizationResults: OptimizationResult | null;
  convertResult: {
    original_code: string;
    converted_code: string;
    source_language: string;
    target_language: string;
    conversion_notes: string;
  } | null;
  documentResult: {
    original_code: string;
    documented_code: string;
  } | null;
}

const ViewTabs: React.FC<ViewTabsProps> = ({
  activeView,
  setActiveView,
  analysisResults,
  optimizationResults,
  convertResult,
  documentResult
}) => {
  return (
    <div className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex justify-start sm:justify-center gap-1 sm:gap-2 p-2 sm:p-4 overflow-x-auto scrollbar-hide">
        {analysisResults && (
          <button
            onClick={() => setActiveView('analysis')}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeView === 'analysis'
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            Analysis
          </button>
        )}
        {optimizationResults && (
          <button
            onClick={() => setActiveView('optimization')}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeView === 'optimization'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            Optimization
          </button>
        )}
        {convertResult && (
          <button
            onClick={() => setActiveView('convert')}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeView === 'convert'
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            Conversion
          </button>
        )}
        {documentResult && (
          <button
            onClick={() => setActiveView('document')}
            className={`px-2 sm:px-4 py-2 rounded-lg transition-colors whitespace-nowrap text-sm sm:text-base ${
              activeView === 'document'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800/70'
            }`}
          >
            Documentation
          </button>
        )}
      </div>
    </div>
  );
};

export default ViewTabs;