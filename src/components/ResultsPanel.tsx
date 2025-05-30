import React from 'react';
import { toast } from "@/components/ui/sonner";
import CodeEditor from './CodeEditor';
import FlowchartVisualization from './FlowchartVisualization';
import { AnalysisResult, OptimizationResult } from '@/api/service';

interface ResultsPanelProps {
  activeView: "analysis" | "optimization" | "convert" | "document" | null;
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
  setSelectedLanguage: (lang: 'r' | 'python' | 'sas') => void;
  sourceLanguage: 'r' | 'python' | 'sas';
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  activeView,
  analysisResults,
  optimizationResults,
  convertResult,
  documentResult,
  selectedLanguage,
  setSelectedLanguage,
  sourceLanguage
}) => {
  const handleCopyOptimized = () => {
    if (optimizationResults) {
      navigator.clipboard.writeText(optimizationResults.optimizedCode);
      toast.success('Optimized code copied to clipboard!');
    }
  };

  return (
    <div className="w-full lg:w-1/2 h-1/2 lg:h-full overflow-auto p-2 sm:p-4">
      {activeView === 'optimization' && optimizationResults && (
        <CodeEditor
          title="Optimized Code"
          code={optimizationResults.optimizedCode}
          editable={false}
          onCopy={handleCopyOptimized}
          onLanguageChange={setSelectedLanguage}
          className="h-full w-full"
          language={selectedLanguage}
        />
      )}

      {activeView === 'analysis' && analysisResults && (
        <div className="h-full flex flex-col">
          <div className="bg-gray-800/30 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-medium mb-2">Overall Score: {analysisResults.scores.overall}</h3>
            <ul className="space-y-1 sm:space-y-2 overflow-auto max-h-24 sm:max-h-32 text-sm sm:text-base">
              {Object.entries(analysisResults.scores.categories).map(([key, cat]) => (
                <li key={key} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-medium min-w-0 sm:min-w-[120px]">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                    <span className="text-blue-400">{cat.score}</span>
                    <span className="text-xs sm:text-sm text-gray-400">({cat.explanation})</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 overflow-auto bg-gray-800/30 rounded-lg p-3 sm:p-4 min-h-0">
            <FlowchartVisualization workflow={analysisResults.workflow} />
          </div>
        </div>
      )}

      {activeView === 'convert' && convertResult && (
        <CodeEditor
          title="Converted Code"
          code={convertResult.converted_code}
          editable={false}
          onCopy={() => {
            navigator.clipboard.writeText(convertResult.converted_code);
            toast.success("Converted code copied to clipboard!");
          }}
          onLanguageChange={setSelectedLanguage}
          className="h-full w-full"
          language={selectedLanguage}
          sourceLanguage={sourceLanguage}
        />
      )}

      {activeView === 'document' && documentResult && (
        <CodeEditor
          title="Documentation"
          code={documentResult.documented_code}
          editable={false}
          onCopy={() => {
            navigator.clipboard.writeText(documentResult.documented_code);
            toast.success("Documentation copied to clipboard!");
          }}
          onLanguageChange={setSelectedLanguage}
          className="h-full w-full"
          language={selectedLanguage}
        />
      )}
    </div>
  );
};

export default ResultsPanel;