import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  analyzeCode,
  optimizeCode,
  documentCode,
  convertCode,
} from '@/api/service';
import type {
  AnalysisResult,
  OptimizationResult,
  ConversionResult
} from '@/types/api';

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
  convertedCode: ConversionResult | null;

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
  const [code, setCode] = useState<string>(() => {
    const savedCode = localStorage.getItem('code');
    return savedCode || '';
  });

  // Loading States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isDocumenting, setIsDocumenting] = useState(false);
  const [isConverting, setIsConverting] = useState(false);

  // Result States
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(() => {
    const savedResult = localStorage.getItem('analysisResult');
    return savedResult ? JSON.parse(savedResult) : null;
  });
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(() => {
    const savedResult = localStorage.getItem('optimizationResult');
    return savedResult ? JSON.parse(savedResult) : null;
  });
  const [documentedCode, setDocumentedCode] = useState<string | null>(() => {
    return localStorage.getItem('documentedCode');
  });
  const [convertedCode, setConvertedCode] = useState<ConversionResult | null>(() => {
    const savedCode = localStorage.getItem('convertedCode');
    return savedCode ? JSON.parse(savedCode) : null;
  });

  // Error State
  const [error, setError] = useState<string | null>(null);

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('code', code);
  }, [code]);

  useEffect(() => {
    if (analysisResult) {
      localStorage.setItem('analysisResult', JSON.stringify(analysisResult));
    }
  }, [analysisResult]);

  useEffect(() => {
    if (optimizationResult) {
      localStorage.setItem('optimizationResult', JSON.stringify(optimizationResult));
    }
  }, [optimizationResult]);

  useEffect(() => {
    if (documentedCode) {
      localStorage.setItem('documentedCode', documentedCode);
    }
  }, [documentedCode]);

  useEffect(() => {
    if (convertedCode) {
      localStorage.setItem('convertedCode', JSON.stringify(convertedCode));
    }
  }, [convertedCode]);

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
    
    // Clear localStorage
    localStorage.removeItem('code');
    localStorage.removeItem('analysisResult');
    localStorage.removeItem('optimizationResult');
    localStorage.removeItem('documentedCode');
    localStorage.removeItem('convertedCode');
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
      setConvertedCode(result);
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
