import React from 'react';
import { toast } from "@/components/ui/sonner";
import CodeEditor from '../CodeEditor';

interface ConversionViewProps {
  convertResult: {
    original_code: string;
    converted_code: string;
    source_language: string;
    target_language: string;
    conversion_notes: string;
  };
  selectedLanguage: 'r' | 'python' | 'sas';
  sourceLanguage: 'r' | 'python' | 'sas';
  onLanguageChange: (lang: 'r' | 'python' | 'sas') => void;
}

const ConversionView: React.FC<ConversionViewProps> = ({
  convertResult,
  selectedLanguage,
  sourceLanguage,
  onLanguageChange
}) => {
  const handleCopyConverted = () => {
    navigator.clipboard.writeText(convertResult.converted_code);
    toast.success("Converted code copied to clipboard!");
  };

  return (
    <CodeEditor
      title="Converted Code"
      code={convertResult.converted_code}
      editable={false}
      onCopy={handleCopyConverted}
      onLanguageChange={onLanguageChange}
      className="h-full w-full"
      language={selectedLanguage}
      sourceLanguage={sourceLanguage}
    />
  );
};

export default ConversionView;