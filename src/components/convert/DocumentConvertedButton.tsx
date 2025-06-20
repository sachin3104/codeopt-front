import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useDocument } from '@/hooks/use-document';
import { useNavigate } from 'react-router-dom';

interface DocumentButtonProps {
  convertedCode: string;
}

const DocumentButton: React.FC<DocumentButtonProps> = ({ convertedCode }) => {
  const navigate = useNavigate();
  const { run: handleDocument, isLoading: isDocumenting, result: documentedCode, error, clear } = useDocument();

  // Effect to handle navigation when documentation is complete
  useEffect(() => {
    if (documentedCode && !isDocumenting) {
      navigate('/results/document', { state: { documentedCode } });
    }
  }, [documentedCode, isDocumenting, navigate]);

  const handleDocumentConverted = async () => {
    try {
      // Use the converted code as input for documentation
      await handleDocument();
    } catch (err) {
      console.error('Documentation failed:', err);
    }
  };

  return (
    <>
      <button
        onClick={handleDocumentConverted}
        disabled={isDocumenting || !convertedCode}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
      >
        <FileText className="w-4 h-4" />
        <span>{isDocumenting ? 'Documenting…' : 'Document'}</span>
      </button>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{error}</span>
        </div>
      )}
    </>
  );
};

export default DocumentButton; 