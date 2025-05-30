// src/pages/results/AnalyzeResultPage.tsx
import React, { useEffect,useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AnalysisResultTabs from '@/components/AnalysisResultTabs';
import Header from '@/components/Header';
// import BeamsBackground from '@/components/beams-backgruond';
import { AnalysisResult } from '@/api/service';
import CodeEditor from '@/components/CodeEditor';
import FlowchartVisualization from '@/components/FlowchartVisualization';
import ScoreCardDisplay from '@/components/ScoreCardDisplay';
import { 

  optimizeCode,
  documentCode,
  convertCode,
} from '@/api/service';
import { toast } from "@/components/ui/sonner";
import LanguageSelectionModal from '@/components/convert/LanguageSelectionModal';
import GlassButton from '@/components/ui/GlassButton';
import { Zap, Code, FileText } from 'lucide-react';

interface AnalyzeResultState {
  results: AnalysisResult;
  originalCode: string;
  sourceLanguage: 'r' | 'python' | 'sas';
}

const AnalyzeResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from router state
  const state = location.state as AnalyzeResultState | null;
  const { results, originalCode, sourceLanguage } = state || {};

  // Loading states for new operations
const [isOptimizing, setIsOptimizing] = useState(false);
const [isConverting, setIsConverting] = useState(false);
const [isDocumenting, setIsDocumenting] = useState(false);

// Conversion modal states
const [showConvertModal, setShowConvertModal] = useState(false);
const [selectedTargetLanguage, setSelectedTargetLanguage] = useState<'python' | 'r' | 'sas' | null>(null);

// Function to check if any operation is in progress
const isAnyOperationInProgress = isOptimizing || isConverting || isDocumenting;

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
const handleOptimize = async () => {
  setIsOptimizing(true);
  try {
    const results = await optimizeCode(originalCode);
    navigate('/results/optimize', {
      state: {
        results,
        originalCode,
        sourceLanguage
      }
    });
    toast.success('Code optimized successfully!');
  } catch (error) {
    console.error('Optimization error:', error);
    toast.error('Failed to optimize code. Please try again.');
  } finally {
    setIsOptimizing(false);
  }
};

const handleDocument = async () => {
  setIsDocumenting(true);
  try {
    const result = await documentCode(originalCode);
    navigate('/results/document', {
      state: {
        results: result,
        originalCode,
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

const handleConvertClick = () => {
  setSelectedTargetLanguage(null);
  setShowConvertModal(true);
};

const handleConvertToLanguage = async (targetLanguage: 'python' | 'r' | 'sas') => {
  setIsConverting(true);
  try {
    const result = await convertCode(originalCode, sourceLanguage, targetLanguage);
    navigate('/results/convert', {
      state: {
        results: result,
        originalCode,
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
            
            <div className="border-l-4 border-blue-500 pl-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                Code Analysis Results
              </h1>
              <p className="text-gray-400">
                Comprehensive analysis of your {sourceLanguage?.toUpperCase()} code
              </p>
            </div>
          </div>

                    
          {/* Action Buttons - Using GlassButton Design */}
          <div className="mb-6">
            {/* Mobile: 1x3 grid layout */}
            <div className="grid grid-cols-3 gap-2 sm:hidden">
              <GlassButton
                onClick={handleOptimize}
                disabled={isAnyOperationInProgress}
                borderColor="#10B981"
                className="w-full min-h-12 text-sm"
              >
                {isOptimizing ? (
                  <span className="flex items-center justify-center">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-1" />
                    <span className="truncate">Optimizing</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Zap className="h-4 w-4 mr-1" />
                    <span className="truncate">Optimize</span>
                  </span>
                )}
              </GlassButton>
              
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
                onClick={handleOptimize}
                disabled={isAnyOperationInProgress}
                borderColor="#10B981"
                className="min-w-28 md:min-w-32"
              >
                {isOptimizing ? (
                  <span className="flex items-center">
                    <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                    Optimizing
                  </span>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-1" />
                    Optimize
                  </>
                )}
              </GlassButton>
              
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

          {/* Code and Visualizations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Side - Code Editor */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Original Code</h3>
                
              </div>
              <div className="h-[60vh] min-h-[500px]">
                <CodeEditor
                  title=""
                  code={originalCode}
                  editable={false}
                  className="h-full w-full rounded-lg border border-gray-700"
                  language={sourceLanguage}
                />
              </div>
            </div>

            {/* Right Side - Flowchart and Scores */}
            <div className="space-y-6">
              {/* Score Cards */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Analysis Scores</h3>
                <ScoreCardDisplay scores={results.scores} />
              </div>

              {/* Flowchart Visualization */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Code Flow Visualization</h3>
                <FlowchartVisualization workflow={results.workflow} />
              </div>
            </div>
          </div>

          {/* Analysis Results Tabs - Below */}
          <div className="mt-8">
            <AnalysisResultTabs results={results} />
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

export default AnalyzeResultPage;