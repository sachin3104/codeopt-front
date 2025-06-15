import React, { useEffect } from 'react';
import { FileText } from 'lucide-react';
import { useCode } from '@/context/CodeContext';
import { useNavigate } from 'react-router-dom';

interface DocumentButtonProps {
  convertedCode: string;
}

const DocumentButton: React.FC<DocumentButtonProps> = ({ convertedCode }) => {
  const navigate = useNavigate();
  const { handleDocument, isDocumenting, error, clearError, documentedCode } = useCode();

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
        className="flex items-center gap-2 px-6 py-4 rounded-xl backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/10 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
        <span className="text-white font-medium">
          {isDocumenting ? 'Documenting...' : 'Document'}
        </span>
      </button>

      {/* Error Toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2">
          <span>{error}</span>
          <button
            onClick={clearError}
            className="ml-2 hover:text-white/80"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
};

export default DocumentButton; 