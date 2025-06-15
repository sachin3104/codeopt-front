import { useCallback } from 'react';
import { useCode } from '@/context/CodeContext';
import type { AnalysisResult, OptimizationResult } from '@/api/service';

interface UseCodeReturn {
  // Code Management
  code: string;
  setCode: (code: string) => void;
  
  // Loading States
  isLoading: boolean;
  isAnalyzing: boolean;
  isOptimizing: boolean;
  isDocumenting: boolean;
  isConverting: boolean;
  
  // Results
  analysisResult: AnalysisResult | null;
  optimizationResult: OptimizationResult | null;
  documentedCode: string | null;
  convertedCode: { converted_code: string; notes: string } | null;
  
  // Error Handling
  error: string | null;
  clearError: () => void;
  
  // Actions
  analyze: () => Promise<void>;
  optimize: () => Promise<void>;
  document: () => Promise<void>;
  convert: (sourceLanguage: string, targetLanguage: string) => Promise<void>;
}

export const useCodeHook = (): UseCodeReturn => {
  const {
    code,
    setCode,
    isAnalyzing,
    isOptimizing,
    isDocumenting,
    isConverting,
    analysisResult,
    optimizationResult,
    documentedCode,
    convertedCode,
    error,
    clearError,
    handleAnalyze,
    handleOptimize,
    handleDocument,
    handleConvert,
  } = useCode();

  // Computed loading state
  const isLoading = isAnalyzing || isOptimizing || isDocumenting || isConverting;

  // Wrapped actions with additional error handling
  const analyze = useCallback(async () => {
    try {
      await handleAnalyze();
    } catch (err) {
      console.error('Analysis failed:', err);
      throw err;
    }
  }, [handleAnalyze]);

  const optimize = useCallback(async () => {
    try {
      await handleOptimize();
    } catch (err) {
      console.error('Optimization failed:', err);
      throw err;
    }
  }, [handleOptimize]);

  const document = useCallback(async () => {
    try {
      await handleDocument();
    } catch (err) {
      console.error('Documentation failed:', err);
      throw err;
    }
  }, [handleDocument]);

  const convert = useCallback(async (sourceLanguage: string, targetLanguage: string) => {
    try {
      await handleConvert(sourceLanguage, targetLanguage);
    } catch (err) {
      console.error('Conversion failed:', err);
      throw err;
    }
  }, [handleConvert]);

  return {
    // Code Management
    code,
    setCode,
    
    // Loading States
    isLoading,
    isAnalyzing,
    isOptimizing,
    isDocumenting,
    isConverting,
    
    // Results
    analysisResult,
    optimizationResult,
    documentedCode,
    convertedCode,
    
    // Error Handling
    error,
    clearError,
    
    // Actions
    analyze,
    optimize,
    document,
    convert,
  };
};
