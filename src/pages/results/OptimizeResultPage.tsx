// src/pages/results/OptimizeResultPage.tsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Code, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/sonner";
import OptimizationResultTabs from '@/components/OptimizationResultTabs';
import Header from '@/components/Header';
// import BeamsBackground from '@/components/beams-backgruond';
import CodeEditor from '@/components/CodeEditor';
import LanguageSelectionModal from '@/components/convert/LanguageSelectionModal';
import GlassButton from '@/components/ui/GlassButton';
import { OptimizationResult, documentCode, convertCode } from '@/api/service';

interface OptimizeResultState {
  results: OptimizationResult;
  originalCode: string;
  sourceLanguage: 'r' | 'python' | 'sas';
}

const OptimizeResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from router state
  const state = location.state as OptimizeResultState | null;
  const { results, originalCode, sourceLanguage } = state || {};

  // Loading states for new operations
const [isConverting, setIsConverting] = useState(false);
const [isDocumenting, setIsDocumenting] = useState(false);

// Conversion modal states
const [showConvertModal, setShowConvertModal] = useState(false);
const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<'python' | 'r' | 'sas' | null>(null);

// Function to check if any operation is in progress
const isAnyOperationInProgress = isConverting || isDocumenting;

  // Redirect to home if no results data
  useEffect(() => {
    if (!results || !originalCode) {
      navigate('/', { replace: true });
    }
  }, [results, originalCode, navigate]);

  // Don't render anything while redirecting
  if (!results || !originalCode) {
    return null;
  }

  const handleBackToInput = () => {
    navigate('/', { 
      state: { 
        preserveCode: originalCode,
        preserveLanguage: sourceLanguage 
      } 
    });
  };

  // Handler functions for new operations
// Handler functions for new operations
const handleDocument = async () => {
  setIsDocumenting(true);
  try {
    const result = await documentCode(results.optimizedCode); // Changed from originalCode
    navigate('/results/document', {
      state: {
        results: result,
        originalCode: results.optimizedCode, // Changed from originalCode
        sourceLanguage
      }
    });
    toast.success('Documentation generated successfully!');
  } catch (error) {
    console.error('Documentation error:', error);
    toast.error('Failed to generate documentation. Please try again.');
  } finally {
    setIsDocumenting(false);
  }
};

const handleConvertToLanguage = async (targetLanguage: 'python' | 'r' | 'sas') => {
  setIsConverting(true);
  try {
    const result = await convertCode(results.optimizedCode, sourceLanguage, targetLanguage); // Changed from originalCode
    navigate('/results/convert', {
      state: {
        results: result,
        originalCode: results.optimizedCode, // Changed from originalCode
        sourceLanguage,
        targetLanguage
      }
    });
    setShowConvertModal(false);
    setSelectedTargetLanguage(null);
    toast.success(`Code converted to ${targetLanguage.toUpperCase()} successfully!`);
  } catch (error) {
    console.error('Conversion error:', error);
    toast.error('Failed to convert code. Please try again.');
  } finally {
    setIsConverting(false);
  }
};

const handleConvertClick = () => {
  setSelectedTargetLanguage(null);
  setShowConvertModal(true);
};


const handleCloseConvertModal = () => {
  if (!isConverting) {
    setShowConvertModal(false);
    setSelectedTargetLanguage(null);
  }
};

const handleTargetLanguageSelect = (language: 'python' | 'r' | 'sas') => {
  setSelectedTargetLanguage(language);
};

  return (
    <>
      <Header />
      
      <div className="min-h-screen pt-4 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-6">
            <Button
              onClick={handleBackToInput}
              variant="ghost"
              className="mb-4 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Input
            </Button>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                Code Optimization Results
              </h1>
              <p className="text-gray-400">
                Optimized version of your {sourceLanguage?.toUpperCase()} code with improvements
              </p>
            </div>
          </div>

          {/* Action Buttons - Using GlassButton Design */}
<div className="mb-6">
  {/* Mobile: 1x2 grid layout */}
  <div className="grid grid-cols-2 gap-2 sm:hidden">
    <GlassButton
      onClick={handleConvertClick}
      disabled={isAnyOperationInProgress}
      borderColor="#8B5CF6"
      className="w-full min-h-12 text-sm"
    >
      {isConverting ? (
        <span className="flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-1" />
          <span className="truncate">Converting</span>
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <Code className="h-4 w-4 mr-1" />
          <span className="truncate">Convert</span>
        </span>
      )}
    </GlassButton>
    
    <GlassButton
      onClick={handleDocument}
      disabled={isAnyOperationInProgress}
      borderColor="#F59E0B"
      className="w-full min-h-12 text-sm"
    >
      {isDocumenting ? (
        <span className="flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-1" />
          <span className="truncate">Documenting</span>
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <FileText className="h-4 w-4 mr-1" />
          <span className="truncate">Document</span>
        </span>
      )}
    </GlassButton>
  </div>

  {/* Tablet and Desktop: horizontal layout */}
  <div className="hidden sm:flex justify-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
    <GlassButton
      onClick={handleConvertClick}
      disabled={isAnyOperationInProgress}
      borderColor="#8B5CF6"
      className="min-w-28 md:min-w-32"
    >
      {isConverting ? (
        <span className="flex items-center">
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
          Converting
        </span>
      ) : (
        <>
          <Code className="h-4 w-4 mr-1" />
          Convert
        </>
      )}
    </GlassButton>
    
    <GlassButton
      onClick={handleDocument}
      disabled={isAnyOperationInProgress}
      borderColor="#F59E0B"
      className="min-w-28 md:min-w-32"
    >
      {isDocumenting ? (
        <span className="flex items-center">
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
          Documenting
        </span>
      ) : (
        <>
          <FileText className="h-4 w-4 mr-1" />
          Document
        </>
      )}
    </GlassButton>
  </div>
</div>

          {/* Code Comparison Section - At Top */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Original Code */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Original Code</h3>
                
              </div>
              <div className="h-[50vh] min-h-[400px]">
                <CodeEditor
                  title=""
                  code={originalCode}
                  editable={false}
                  className="h-full w-full rounded-lg border border-gray-700"
                  language={sourceLanguage}
                />
              </div>
            </div>

            {/* Optimized Code */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Optimized Code</h3>
                
              </div>
              <div className="h-[50vh] min-h-[400px]">
                <CodeEditor
                  title=""
                  code={results.optimizedCode}
                  editable={false}
                  className="h-full w-full rounded-lg border border-gray-700"
                  language={sourceLanguage}
                />
              </div>
            </div>
          </div>

          {/* Optimization Results Tabs - Below Code */}
          <div className="mt-8">
            <OptimizationResultTabs results={results} />
          </div>


        </div>
      </div>

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
    </>
  );
};

export default OptimizeResultPage;