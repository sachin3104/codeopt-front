// src/components/CodeOptimizer.tsx
// Refactored to use page-based routing instead of state-based views
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "@/components/ui/sonner";
import EmptyState from './EmptyState';
import LanguageSelectionModal from './convert/LanguageSelectionModal';
import LanguageWarningBanner from './convert/LanguageWarningBanner';

// Import service functions from services.ts - NOT defined in this file
import {
  analyzeCode,
  optimizeCode,
  documentCode,
  convertCode,
} from '@/api/service'; // Make sure this path is correct

const CodeOptimizer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Core state - only what's needed for input page
  const [code, setCode] = useState("");

  // Loading states for each operation
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDocumenting, setIsDocumenting] = useState(false);

  // Language management states
  const [selectedLanguage, setSelectedLanguage] = useState<'r' | 'python' | 'sas'>('python');
  const [sourceLanguage, setSourceLanguage] = useState<'r' | 'python' | 'sas'>('python');
  const [detectedLanguage, setDetectedLanguage] = useState<'r' | 'python' | 'sas'>('python');

  // Modal and language validation states
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<'python' | 'r' | 'sas' | null>(null);
  const [showLanguageWarning, setShowLanguageWarning] = useState(false);
  const [detectedInvalidLanguage, setDetectedInvalidLanguage] = useState<string>('');

  // Function to validate if language is supported for conversion
  const isSupportedLanguage = (language: string): language is 'python' | 'r' | 'sas' => {
    return ['python', 'r', 'sas'].includes(language.toLowerCase());
  };

  // Handle detected language changes from CodeEditor
  const handleDetectedLanguageChange = (detectedLang: 'r' | 'python' | 'sas') => {
    console.log('Language detected in CodeOptimizer:', detectedLang);
    setSourceLanguage(detectedLang);
    setDetectedLanguage(detectedLang);
    
    // Hide warning if the detected language is supported
    if (isSupportedLanguage(detectedLang)) {
      setShowLanguageWarning(false);
    }
  };

  // Language change handler with validation
  const handleSourceLanguageChange = (lang: 'r' | 'python' | 'sas') => {
    console.log('Manual language change to:', lang);
    setSourceLanguage(lang);
    
    // Hide warning if user selects a supported language
    if (isSupportedLanguage(lang)) {
      setShowLanguageWarning(false);
    }
  };

  // HANDLERS - Navigate instead of setting state
  const handleOptimize = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to optimize');
      return;
    }

    setIsOptimizing(true);
    
    // Show progress toast for long operations
    const progressToast = toast.loading('Optimizing your code... This may take a few minutes for complex code.', {
      duration: Infinity,
    });

    try {
      const results = await optimizeCode(code);
      console.log('Optimization results:', results);
      
      // Dismiss progress toast
      toast.dismiss(progressToast);
      
      // Navigate to results page with data
      navigate('/results/optimize', {
        state: {
          results,
          originalCode: code,
          sourceLanguage
        }
      });
      
      toast.success('Code optimized successfully!');
    } catch (error) {
      console.error('Optimization error:', error);
      
      // Dismiss progress toast
      toast.dismiss(progressToast);
      
      // Show specific error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to optimize code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to analyze');
      return;
    }

    setIsAnalyzing(true);
    
    const progressToast = toast.loading('Analyzing your code...', {
      duration: Infinity,
    });

    try {
      const results = await analyzeCode(code);
      console.log('Analysis results:', results);
      
      toast.dismiss(progressToast);
      
      // Navigate to results page with data
      navigate('/results/analyze', {
        state: {
          results,
          originalCode: code,
          sourceLanguage
        }
      });
      
      toast.success('Code analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      
      toast.dismiss(progressToast);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDocument = async () => {
    if (!code.trim()) {
      toast.error('Please enter some code to document');
      return;
    }

    setIsDocumenting(true);
    
    const progressToast = toast.loading('Generating documentation...', {
      duration: Infinity,
    });

    try {
      const result = await documentCode(code);
      console.log('Documentation results:', result);
      
      toast.dismiss(progressToast);
      
      // Navigate to results page with data
      navigate('/results/document', {
        state: {
          results: result,
          originalCode: code,
          sourceLanguage
        }
      });
      
      toast.success('Documentation generated successfully!');
    } catch (error) {
      console.error('Documentation error:', error);
      
      toast.dismiss(progressToast);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate documentation. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsDocumenting(false);
    }
  };

  // Handle convert - opens modal instead of direct conversion
  const handleConvertClick = () => {
    if (!code.trim()) {
      toast.error('Please enter some code to convert');
      return;
    }

    console.log('Convert clicked with sourceLanguage:', sourceLanguage);
    
    // Check if source language is supported
    if (!isSupportedLanguage(sourceLanguage)) {
      setDetectedInvalidLanguage(sourceLanguage);
      setShowLanguageWarning(true);
      toast.error('Conversion only supports Python, R, and SAS as input languages.');
      return;
    }

    // Open language selection modal
    setSelectedTargetLanguage(null);
    setShowConvertModal(true);
  };

  // Handle actual conversion after language selection
  const handleConvertToLanguage = async (targetLanguage: 'python' | 'r' | 'sas') => {
    setIsConverting(true);
    
    const progressToast = toast.loading(`Converting code to ${targetLanguage.toUpperCase()}...`, {
      duration: Infinity,
    });

    try {
      const result = await convertCode(code, sourceLanguage, targetLanguage);
      console.log('Conversion results:', result);
      
      toast.dismiss(progressToast);
      
      // Navigate to results page with data
      navigate('/results/convert', {
        state: {
          results: result,
          originalCode: code,
          sourceLanguage,
          targetLanguage
        }
      });
      
      setShowConvertModal(false);
      setSelectedTargetLanguage(null);
      toast.success(`Code converted to ${targetLanguage.toUpperCase()} successfully!`);
    } catch (error) {
      console.error('Conversion error:', error);
      
      toast.dismiss(progressToast);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to convert code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  // Handle modal close
  const handleCloseConvertModal = () => {
    if (!isConverting) {
      setShowConvertModal(false);
      setSelectedTargetLanguage(null);
    }
  };

  // Handle target language selection in modal
  const handleTargetLanguageSelect = (language: 'python' | 'r' | 'sas') => {
    setSelectedTargetLanguage(language);
  };

  // Check for preserved code from navigation state (when returning from results)
  useEffect(() => {
    const state = location.state as any;
    if (state?.preserveCode && state.preserveCode !== code) {
      setCode(state.preserveCode);
    }
    if (state?.preserveLanguage && state.preserveLanguage !== sourceLanguage) {
      setSourceLanguage(state.preserveLanguage);
      setDetectedLanguage(state.preserveLanguage);
    }
  }, [location.state]);

  // Debug logging for state changes
  useEffect(() => {
    console.log('CodeOptimizer state:', {
      sourceLanguage,
      detectedLanguage,
      showConvertModal,
      selectedTargetLanguage
    });
  }, [sourceLanguage, detectedLanguage, showConvertModal, selectedTargetLanguage]);

  return (
    <>
      {/* Language Warning Banner */}
      {showLanguageWarning && (
        <div className="fixed top-4 left-4 right-4 z-40">
          <LanguageWarningBanner
            isVisible={showLanguageWarning}
            onDismiss={() => setShowLanguageWarning(false)}
            detectedLanguage={detectedInvalidLanguage}
          />
        </div>
      )}

      {/* Language Selection Modal */}
      <LanguageSelectionModal
        isOpen={showConvertModal}
        onClose={handleCloseConvertModal}
        onConvert={handleConvertToLanguage}
        sourceLanguage={sourceLanguage}
        isConverting={isConverting}
        selectedLanguage={selectedTargetLanguage}
        onLanguageSelect={handleTargetLanguageSelect}
      />

      {/* INPUT PAGE - Always visible now */}
      <EmptyState
        code={code}
        onCodeChange={setCode}
        onAnalyze={handleAnalyze}
        onOptimize={handleOptimize}
        onConvert={handleConvertClick}
        onDocument={handleDocument}
        isAnalyzing={isAnalyzing}
        isOptimizing={isOptimizing}
        isConverting={isConverting}
        isDocumenting={isDocumenting}
        analysisResults={null}
        optimizationResults={null}
        convertResult={null}
        documentResult={null}
        selectedLanguage={selectedLanguage}
        onLanguageChange={setSelectedLanguage}
        activeView={null}
        setActiveView={() => {}} // No-op function since we don't use activeView anymore
        sourceLanguage={sourceLanguage}
        onSourceLanguageChange={handleSourceLanguageChange}
        onDetectedLanguageChange={handleDetectedLanguageChange}
        onResetResults={() => {}} // No-op function since we don't manage results state
      />
    </>
  );
};

export default CodeOptimizer;