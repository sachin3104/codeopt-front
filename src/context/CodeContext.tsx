import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  analyzeCode,
  optimizeCode,
  documentCode,
  convertCode,
  type AnalysisResult,
  type OptimizationResult,
} from '@/api/service';

interface CodeContextType {
  // Primary State
  code: string;
  setCode: (code: string) => void;

  // Loading States
  isAnalyzing: boolean;
  isOptimizing: boolean;
  isDocumenting: boolean;
  isConverting: boolean;

  // Result States
  analysisResult: AnalysisResult | null;
  optimizationResult: OptimizationResult | null;
  documentedCode: string | null;
  convertedCode: { converted_code: string; notes: string } | null;

  // Error Handling
  error: string | null;
  clearError: () => void;

  // Action Handlers
  handleAnalyze: () => Promise<void>;
  handleOptimize: () => Promise<void>;
  handleDocument: () => Promise<void>;
  handleConvert: (sourceLanguage: string, targetLanguage: string) => Promise<void>;
  clearAllState: () => void;
}

const CodeContext = createContext<CodeContextType | undefined>(undefined);

export const CodeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary State
  const [code, setCode] = useState<string>('');

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDocumenting, setIsDocumenting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Result States
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [documentedCode, setDocumentedCode] = useState<string | null>(null);
  const [convertedCode, setConvertedCode] = useState<{ converted_code: string; notes: string } | null>(null);

  // Error State
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearAllState = useCallback(() => {
    setCode('');
    setIsAnalyzing(false);
    setIsOptimizing(false);
    setIsDocumenting(false);
    setIsConverting(false);
    setAnalysisResult(null);
    setOptimizationResult(null);
    setDocumentedCode(null);
    setConvertedCode(null);
    setError(null);
  }, []);

  // Action Handlers
  const handleAnalyze = useCallback(async () => {
    if (!code) {
      setError('No code to analyze');
      return;
    }

    try {
      setIsAnalyzing(true);
      clearError();
      const result = await analyzeCode(code);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze code');
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, clearError]);

  const handleOptimize = useCallback(async () => {
    if (!code) {
      setError('No code to optimize');
      return;
    }

    try {
      setIsOptimizing(true);
      clearError();
      const result = await optimizeCode(code);
      setOptimizationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize code');
    } finally {
      setIsOptimizing(false);
    }
  }, [code, clearError]);

  const handleDocument = useCallback(async () => {
    if (!code) {
      setError('No code to document');
      return;
    }

    try {
      setIsDocumenting(true);
      clearError();
      const result = await documentCode(code);
      setDocumentedCode(result.documented_code);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to document code');
    } finally {
      setIsDocumenting(false);
    }
  }, [code, clearError]);

  const handleConvert = useCallback(async (sourceLanguage: string, targetLanguage: string) => {
    if (!code) {
      setError('No code to convert');
      return;
    }

    try {
      setIsConverting(true);
      clearError();
      const result = await convertCode(code, sourceLanguage, targetLanguage);
      setConvertedCode({
        converted_code: result.converted_code,
        notes: result.conversion_notes,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to convert code');
    } finally {
      setIsConverting(false);
    }
  }, [code, clearError]);

  const value = {
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
    clearAllState,
  };

  return <CodeContext.Provider value={value}>{children}</CodeContext.Provider>;
};

export const useCode = () => {
  const context = useContext(CodeContext);
  if (context === undefined) {
    throw new Error('useCode must be used within a CodeProvider');
  }
  return context;
};
