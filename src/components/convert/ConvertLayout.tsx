import React, { useEffect } from 'react';
import { useConvert } from '@/hooks/use-convert';
import { useDocument } from '@/hooks/use-document';
import { useNavigate } from 'react-router-dom';
import SyncCodeEditors from '../common/editor/SyncCodeEditors';
import { ActionMenu } from '../common/actions/CommonActionButtons';
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
  }, [initialized, isConverting, convertedCode, navigate]);

  const handleGoHome = () => {
    clearConvert();
    clearDocument();
    navigate('/', { replace: true });
  };

  // Debug log for component state
  useEffect(() => {
    console.log('ConvertLayout mounted/updated:', {
      hasCode: !!convertedCode,
      isConverting,
      convertedCodeValue: convertedCode,
      convertError
    });
  }, [convertedCode, isConverting, convertError]);

  // Loading state
  if (isConverting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/80">Converting your code...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (convertError) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center max-w-md">
          <div className="h-12 w-12 text-red-400 mx-auto mb-4">
            {/* You can use an error icon here if desired */}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">Conversion Failed</h3>
          <p className="text-gray-400 mb-4">{convertError}</p>
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

  // Shouldn't happen—guard above handles it
  if (!convertedCode) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header Section with ActionMenu */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Conversion Results</h2>
        <div className="flex items-center gap-4">
          {/* Use ActionMenu for document button only */}
          <ActionMenu
            actions={['document']}
            variant="layout"
          />
          
          {/* Back to Home button */}
          <button
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Code Editors Section - Full Width */}
      <div className="w-full h-[600px] overflow-hidden">
        <SyncCodeEditors
          originalCode={convertedCode.conversion?.code?.original || 'NA'}
          convertedCode={convertedCode.conversion?.code?.converted || 'NA'}
          isReadOnly={true}
          originalTitle={`Original Code`}
          convertedTitle={`Converted Code`}
        />
      </div>

      {/* Convert Tabs Section */}
      <div className="mt-8">
        <ConvertTabs />
      </div>

      {/* Combined error toast */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ConvertLayout;