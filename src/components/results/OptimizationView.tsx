import React from 'react';
import { toast } from "@/components/ui/sonner";
import CodeEditor from '../CodeEditor';
import { OptimizationResult } from '@/api/service';

interface OptimizationViewProps {
  optimizationResults: OptimizationResult;
  selectedLanguage: 'r' | 'python' | 'sas';
  onLanguageChange: (lang: 'r' | 'python' | 'sas') => void;
}

const OptimizationView: React.FC<OptimizationViewProps> = ({
  optimizationResults,
  selectedLanguage,
  onLanguageChange
}) => {
  const handleCopyOptimized = () => {
    navigator.clipboard.writeText(optimizationResults.optimizedCode);
    toast.success('Optimized code copied to clipboard!');
  };

  return (
    <CodeEditor
      title="Optimized Code"
      code={optimizationResults.optimizedCode}
      editable={false}
      onCopy={handleCopyOptimized}
      onLanguageChange={onLanguageChange}
      className="h-full w-full"
      language={selectedLanguage}
    />
  );
};

export default OptimizationView;