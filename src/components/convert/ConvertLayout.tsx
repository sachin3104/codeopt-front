import React, { useEffect } from 'react';
import { useConvert } from '@/hooks/use-convert';
import { useNavigate } from 'react-router-dom';
import SyncCodeEditors from '../common/editor/SyncCodeEditors';
import DocumentButton from './DocumentConvertedButton';
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
  const navigate = useNavigate();

  // Redirect home if not converting and still no result
  useEffect(() => {
    if (initialized && !isConverting && !convertedCode) {
      navigate('/', { replace: true });
    }
  }, [initialized, isConverting, convertedCode, navigate]);

  const handleGoHome = () => {
    clearConvert();
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
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Conversion Results</h2>
        <div className="flex items-center gap-4">
          <DocumentButton convertedCode={convertedCode.converted_code} />
          <button 
            onClick={handleGoHome}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>

      {/* Code Editors Section - Full Width */}
      <div className="w-full h-[600px] overflow-hidden">
        <SyncCodeEditors
          originalCode={convertedCode.original_code || 'N/A'}
          convertedCode={convertedCode.converted_code || 'N/A'}
          isReadOnly={true}
          originalTitle={`Original Code `}
          convertedTitle={`Converted Code `}
        />
      </div>

      {/* Convert Tabs Section */}
      <div className="mt-8">
        <ConvertTabs />
      </div>

      {/* Error toast (if needed) */}
      {convertError && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg">
          <span>{convertError}</span>
        </div>
      )}
    </div>
  );
};

export default ConvertLayout;
