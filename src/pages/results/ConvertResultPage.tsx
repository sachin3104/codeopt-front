// src/pages/results/ConvertResultPage.tsx
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
// import BeamsBackground from '@/components/beams-backgruond';
import CodeEditor from '@/components/CodeEditor';

interface ConvertResultState {
  results: {
    original_code: string;
    converted_code: string;
    source_language: string;
    target_language: string;
    conversion_notes: string;
  };
  originalCode: string;
  sourceLanguage: 'r' | 'python' | 'sas';
  targetLanguage: 'r' | 'python' | 'sas';
}

const ConvertResultPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data passed from router state
  const state = location.state as ConvertResultState | null;
  const { results, originalCode, sourceLanguage, targetLanguage } = state || {};

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
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                Code Conversion Results
              </h1>
              <div className="flex items-center gap-3 text-gray-400">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {results.source_language.toUpperCase()}
                </span>
                <ArrowRight className="w-4 h-4" />
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {results.target_language.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Code Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Code */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Original ({results.source_language.toUpperCase()})
              </h3>
              
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

          {/* Converted Code */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">
                Converted ({results.target_language.toUpperCase()})
              </h3>
              
            </div>
            <div className="h-[50vh] min-h-[400px]">
              <CodeEditor
                title=""
                code={results.converted_code}
                editable={false}
                className="h-full w-full rounded-lg border border-gray-700"
                language={targetLanguage}
              />
            </div>
          </div>
        </div>

        {/* Conversion Notes - Moved Below */}
        {results.conversion_notes && (
          <div className="mt-8">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Conversion Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 whitespace-pre-wrap">{results.conversion_notes}</p>
              </CardContent>
            </Card>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default ConvertResultPage;