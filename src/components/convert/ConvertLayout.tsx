import React, { useEffect } from 'react';
import { useCode } from '@/context/CodeContext';
import { useNavigate } from 'react-router-dom';
import SyncCodeEditors from '../common/editor/SyncCodeEditors';
import DocumentButton from './DocumentConvertedButton';
import { ArrowLeft } from 'lucide-react';
import ConvertTabs from './ConvertTabs';

const ConvertLayout: React.FC = () => {
  const { code, convertedCode, isConverting, clearAllState } = useCode();
  const navigate = useNavigate();

  const handleGoHome = () => {
    // Clear all state before navigation
    clearAllState();
    // Navigate to home with replace to prevent back navigation
    navigate('/', { replace: true });
  };

  // Debug log for component state
  useEffect(() => {
    console.log('ConvertLayout mounted/updated:', {
      hasCode: !!code,
      hasConvertedCode: !!convertedCode,
      isConverting,
      convertedCodeValue: convertedCode
    });
  }, [code, convertedCode, isConverting]);

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

  if (!convertedCode) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="text-center">
          <p className="text-white/80">No converted code available. Use the Convert button to convert your code.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Converted Code</h2>
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
          originalCode={code}
          convertedCode={convertedCode.converted_code}
          isReadOnly={true}
        />
      </div>

      

      {/* Convert Tabs Section */}
      <div className="mt-8">
        <ConvertTabs />
      </div>
    </div>
  );
};

export default ConvertLayout;
