import React from 'react';
import { useCode } from '@/context/CodeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import CodeEditor from '../common/editor/CodeEditor';
import { Background } from '@/components/common/background';
import { ArrowLeft } from 'lucide-react';

const DocumentResultLayout: React.FC = () => {
  const { documentedCode: contextDocumentedCode, isDocumenting, clearAllState } = useCode();
  const location = useLocation();
  const navigate = useNavigate();
  const documentedCode = location.state?.documentedCode || contextDocumentedCode;

  const handleGoHome = () => {
    // Clear all state before navigation
    clearAllState();
    // Navigate to home with replace to prevent back navigation
    navigate('/', { replace: true });
  };

  if (isDocumenting) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/80 text-lg">Documenting your code...</div>
      </div>
    );
  }

  if (!documentedCode) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-white/60 text-lg">No documented code available. Use the Document button to generate documentation.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Documented Code</h2>
        <button 
          onClick={handleGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="w-full h-[600px]">
        <CodeEditor height="100%" value={documentedCode} isReadOnly={true} />
      </div>
    </div>
  );
};

export default DocumentResultLayout;
