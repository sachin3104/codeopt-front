// src/pages/results/DocumentResultPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CodeEditor from '@/components/CodeEditor';
import Header from '@/components/Header';
// import BeamsBackground from '@/components/beams-backgruond';


interface DocumentResultState {
  results: {
    original_code: string;
    documented_code: string;
  };
  originalCode: string;
  sourceLanguage: 'r' | 'python' | 'sas';
}

const DocumentResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from router state
  const state = location.state as DocumentResultState | null;
  const { results, originalCode, sourceLanguage } = state || {};

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

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You can add a toast notification here if you have toast setup
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadDocumentedCode = () => {
    const element = document.createElement('a');
    const file = new Blob([results.documented_code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    // Determine file extension based on language
    const extensions = {
      python: 'py',
      r: 'R',
      sas: 'sas'
    };
    const extension = extensions[sourceLanguage] || 'txt';
    
    element.download = `documented_code.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            
            <div className="border-l-4 border-yellow-500 pl-4 flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Code Documentation Results
                </h1>
                <p className="text-gray-400">
                  Your {sourceLanguage?.toUpperCase()} code with comprehensive documentation
                </p>
              </div>
              <Button
                onClick={downloadDocumentedCode}
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          
          

          {/* Documented Code Editor */}
<div className="mt-6">
  
  
  <div className="h-[70vh] min-h-[600px]">
    <CodeEditor
      title=""
      code={results.documented_code}
      editable={false}
      className="h-full w-full rounded-lg border border-gray-700"
      language={sourceLanguage}
    />
  </div>
</div>
        </div>
      </div>
    </>
  );
};

export default DocumentResultPage;