import React from 'react';
import CodeInput from './CodeInput';
import { AnalysisResult, OptimizationResult } from '@/api/service';

interface EmptyStateProps {
  code: string;
  onCodeChange: (code: string) => void;
  onAnalyze: () => void;
  onOptimize: () => void;
  onConvert: () => void;
  onDocument: () => void;
  isAnalyzing: boolean;
  isOptimizing: boolean;
  isConverting: boolean;
  isDocumenting: boolean;
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
  selectedLanguage: 'r' | 'python' | 'sas';
  onLanguageChange: (lang: 'r' | 'python' | 'sas') => void;
  activeView: "analysis" | "optimization" | "convert" | "document" | null;
  setActiveView: (view: "analysis" | "optimization" | "convert" | "document") => void;
  sourceLanguage: 'r' | 'python' | 'sas';
  onSourceLanguageChange: (lang: 'r' | 'python' | 'sas') => void;
  onDetectedLanguageChange?: (lang: 'r' | 'python' | 'sas') => void;
  onResetResults: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  code,
  onCodeChange,
  onAnalyze,
  onOptimize,
  onConvert,
  onDocument,
  isAnalyzing,
  isOptimizing,
  isConverting,
  isDocumenting,
  analysisResults,
  optimizationResults,
  convertResult,
  documentResult,
  selectedLanguage,
  onLanguageChange,
  activeView,
  setActiveView,
  sourceLanguage,
  onSourceLanguageChange,
  onDetectedLanguageChange,
  onResetResults
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
  <div className="grid grid-cols-1 gap-8">
    {/* Code Input Section - Full Width */}
    <div className="w-full">
      <CodeInput
        code={code}
        onCodeChange={onCodeChange}
        onAnalyze={onAnalyze}
        onOptimize={onOptimize}
        onConvert={onConvert}
        onDocument={onDocument}
        isAnalyzing={isAnalyzing}
        isOptimizing={isOptimizing}
        isConverting={isConverting}
        isDocumenting={isDocumenting}
        analysisResults={analysisResults}
        optimizationResults={optimizationResults}
        convertResult={convertResult}
        documentResult={documentResult}
        selectedLanguage={selectedLanguage}
        onLanguageChange={onLanguageChange}
        activeView={activeView}
        setActiveView={setActiveView}
        sourceLanguage={sourceLanguage}
        onSourceLanguageChange={onSourceLanguageChange}
        onDetectedLanguageChange={onDetectedLanguageChange}
        onResetResults={onResetResults}
      />
    </div>
  </div>
</div>
  );
};

export default EmptyState;