import React, { useEffect } from 'react';
import { useDocument } from '@/hooks/use-document';
import { useNavigate } from 'react-router-dom';
import CodeEditor from '../common/editor/CodeEditor';
import { ArrowLeft, AlertTriangle } from 'lucide-react';

interface DocumentedCodeResponse {
  documented_code?: string;
  original_code?: string;
  status?: string;
}

const DocumentResultLayout: React.FC = () => {
  const navigate = useNavigate();
  
  // Document context
  const {
    result: documentedCode,
    isLoading: isDocumenting,
    error: documentError,
    clear: clearDocument,
    initialized
  } = useDocument();

  // Normalize the documented code
  const getNormalizedCode = (code: any): string => {
    if (typeof code === 'string') {
      return code;
    }
    
    // If it's the documented code response object
    if (typeof code === 'object' && code !== null) {
      const response = code as DocumentedCodeResponse;
      return response.documented_code || response.original_code || '';
    }

    return '';
  };

  // Get the normalized code
  const normalizedCode = getNormalizedCode(documentedCode);

  // If we landed here without having run document yet, go back home
  useEffect(() => {
    if (initialized && !isDocumenting && !documentedCode) {
      navigate('/', { replace: true });
    }
  }, [initialized, documentedCode, isDocumenting, navigate]);

  const handleGoHome = () => {
    clearDocument();
    navigate('/', { replace: true });
  };

  // Loading state
  if (isDocumenting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-white/80">Documenting your code…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (documentError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Documentation Failed</h3>
          <p className="text-gray-400 mb-4">{documentError}</p>
          <button
            onClick={handleGoHome}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Guard against undefined/null code
  if (!normalizedCode) {
    return null;
  }

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="p-0 flex-1 min-h-[calc(100vh-12rem)] flex flex-col">
        {/* Wrapper div with dashboard component styling */}
        <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg overflow-hidden h-[750px]">
          <CodeEditor 
            value={normalizedCode} 
            isReadOnly={true} 
            height="100%"
            variant="results"
            title="Documented Code"
          />
        </div>
      </div>

      {/* Error toast */}
      {documentError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{documentError}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentResultLayout;
