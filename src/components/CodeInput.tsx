import React, { useEffect } from 'react';
import CodeEditor from './CodeEditor';
import ActionButtons from './ActionButtons';
import { AnalysisResult, OptimizationResult } from '@/api/service';

interface CodeInputProps {
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

const CodeInput: React.FC<CodeInputProps> = ({
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
  useEffect(() => {
    // Only reset if we don't have any active results
    if (!analysisResults && !optimizationResults && !convertResult && !documentResult) {
      onResetResults();
    }
  }, [code, onResetResults, analysisResults, optimizationResults, convertResult, documentResult]);

  return (
    <div className="flex flex-col h-full">
  {/* Action Buttons - Moved to Top */}
  <div className="mb-4">
    <ActionButtons
      onAnalyze={onAnalyze}
      onOptimize={onOptimize}
      onConvert={onConvert}
      onDocument={onDocument}
      isAnalyzing={isAnalyzing}
      isOptimizing={isOptimizing}
      isConverting={isConverting}
      isDocumenting={isDocumenting}
      code={code}
      sourceLanguage={sourceLanguage}
    />
  </div>
  
  {/* Editor - Moved to Bottom */}
  <div className="flex-1 min-h-[60vh] lg:min-h-[70vh]">
    <CodeEditor
      title=""
      code={code}
      editable
      onCodeChange={onCodeChange}
      className="h-full w-full min-h-[500px] lg:min-h-[600px] rounded-lg border border-gray-700"
      language={sourceLanguage}
      sourceLanguage={sourceLanguage}
      onLanguageChange={onSourceLanguageChange}
      onDetectedLanguageChange={onDetectedLanguageChange}
    />
  </div>
</div>
  );
};

export default CodeInput;