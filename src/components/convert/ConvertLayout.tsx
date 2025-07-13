import React, { useEffect } from 'react';
import { useConvert } from '@/hooks/use-convert';
import { useDocument } from '@/hooks/use-document';
import { useNavigate } from 'react-router-dom';
import SyncCodeEditors from '../common/editor/SyncCodeEditors';
import { ArrowLeft } from 'lucide-react';
import ConvertTabs from './ConvertTabs';

const ConvertLayout: React.FC = () => {
  const {
    result: convertedCode,
    isLoading: isConverting,
    error: convertError,
    clear: clearConvert,
    run: runConvert,
    initialized
  } = useConvert();

  // --- Documentation context ---
  const {
    isLoading: isDocumenting,
    error: documentError,
    clear: clearDocument,
    run: runDocument
  } = useDocument();

  const navigate = useNavigate();

  // Combined error
  const error = convertError || documentError;

  // Redirect home if not converting and still no result
  useEffect(() => {
    if (initialized && !isConverting && !convertedCode) {
      navigate('/', { replace: true });
    }
  }, [initialized, isConverting, convertedCode, convertError, navigate]);

  const handleGoHome = () => {
    clearConvert();
    clearDocument();
    navigate('/', { replace: true });
  };

  // Loading state
  if (isConverting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center px-4 sm:px-6 md:px-8">
          <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 xs:mb-4 sm:mb-4"></div>
          <p className="text-white/80 text-sm xs:text-base sm:text-lg">Converting your code...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (convertError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] xs:h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] md:h-[calc(100vh-4.5rem)] lg:h-[calc(100vh-5rem)]">
        <div className="text-center max-w-sm xs:max-w-md sm:max-w-lg px-4 sm:px-6 md:px-8">
          <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 text-red-400 mx-auto mb-3 xs:mb-4 sm:mb-4">
            {/* You can use an error icon here if desired */}
          </div>
          <h3 className="text-base xs:text-lg sm:text-xl font-medium text-white mb-2 xs:mb-3 sm:mb-3">Conversion Failed</h3>
          <p className="text-gray-400 text-sm xs:text-base mb-4 xs:mb-4 sm:mb-4">{convertError}</p>
          <button
            onClick={handleGoHome}
            className="px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm xs:text-base transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Shouldn't happen—guard above handles it
  if (!convertedCode) {
    return null;
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6 lg:space-y-6">
      {/* Code Editors Section - Full Width */}
      <div className="w-full h-[400px] xs:h-[500px] sm:h-[550px] md:h-[600px] lg:h-[650px] overflow-hidden">
        <SyncCodeEditors
          originalCode={convertedCode.conversion?.code?.original || convertedCode.original_code || 'NA'}
          convertedCode={convertedCode.conversion?.code?.converted || convertedCode.converted_code || 'NA'}
          isReadOnly={true}
          originalTitle={`Original Code`}
          convertedTitle={`Converted Code`}
          originalLanguage={convertedCode.conversion?.metadata?.source_language || convertedCode.source_language}
          convertedLanguage={convertedCode.conversion?.metadata?.target_language || convertedCode.target_language}
        />
      </div>

      {/* Convert Tabs Section */}
      <ConvertTabs />

      {/* Combined error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-3 py-2 xs:px-4 xs:py-2 sm:px-4 sm:py-2 rounded shadow-lg text-sm xs:text-base z-50">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ConvertLayout;