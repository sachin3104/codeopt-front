import React from 'react';
import { toast } from "@/components/ui/sonner";
import CodeEditor from '../CodeEditor';

interface DocumentationViewProps {
  documentResult: {
    original_code: string;
    documented_code: string;
  };
  selectedLanguage: 'r' | 'python' | 'sas';
  onLanguageChange: (lang: 'r' | 'python' | 'sas') => void;
}

const DocumentationView: React.FC<DocumentationViewProps> = ({
  documentResult,
  selectedLanguage,
  onLanguageChange
}) => {
  const handleCopyDocumentation = () => {
    navigator.clipboard.writeText(documentResult.documented_code);
    toast.success("Documentation copied to clipboard!");
  };

  return (
    <CodeEditor
      title="Documentation"
      code={documentResult.documented_code}
      editable={false}
      onCopy={handleCopyDocumentation}
      onLanguageChange={onLanguageChange}
      className="h-full w-full"
      language={selectedLanguage}
    />
  );
};

export default DocumentationView;