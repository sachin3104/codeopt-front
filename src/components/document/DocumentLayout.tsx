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
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)]">
        <div className="text-center px-2 xs:px-3 sm:px-4">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-2 xs:mb-3 sm:mb-4" />
          <p className="text-white/80 text-sm xs:text-base sm:text-lg">Documenting your code…</p>
        </div>
      </div>
    );
  }

  // Error state
  if (documentError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-5rem)] sm:h-[calc(100vh-6rem)] md:h-[calc(100vh-7rem)] lg:h-[calc(100vh-8rem)]">
        <div className="text-center max-w-xs xs:max-w-sm sm:max-w-md px-2 xs:px-3 sm:px-4">
          <AlertTriangle className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-2 xs:mb-3 sm:mb-4" />
          <h3 className="text-base xs:text-lg sm:text-xl font-medium text-white mb-1 xs:mb-2">Documentation Failed</h3>
          <p className="text-gray-400 mb-3 xs:mb-4 text-sm xs:text-base">{documentError}</p>
          <button
            onClick={handleGoHome}
            className="px-3 xs:px-4 py-1.5 xs:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm xs:text-base"
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
    <div className="space-y-2 xs:space-y-3 sm:space-y-4 h-full flex flex-col">
      <div className="p-0 flex-1 min-h-[calc(100vh-12rem)] xs:min-h-[calc(100vh-13rem)] sm:min-h-[calc(100vh-14rem)] md:min-h-[calc(100vh-15rem)] lg:min-h-[calc(100vh-16rem)] flex flex-col">
        {/* Wrapper div with dashboard component styling */}
        <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl md:rounded-2xl overflow-hidden h-[500px] xs:h-[550px] sm:h-[600px] md:h-[650px] lg:h-[700px] xl:h-[750px]">
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
        <div className="fixed bottom-2 xs:bottom-3 sm:bottom-4 right-2 xs:right-3 sm:right-4 bg-red-600 text-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 rounded shadow-lg text-xs xs:text-sm">
          <span>{documentError}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentResultLayout;
