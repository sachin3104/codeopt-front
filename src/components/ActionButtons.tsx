import React from 'react';
import { Search, Zap, Code, FileText } from "lucide-react";
import GlassButton from './ui/GlassButton';

interface ActionButtonsProps {
  onAnalyze: () => void;
  onOptimize: () => void;
  onConvert: () => void;
  onDocument: () => void;
  isAnalyzing: boolean;
  isOptimizing: boolean;
  isConverting: boolean;
  isDocumenting: boolean;
  code: string;
  sourceLanguage?: 'python' | 'r' | 'sas';
}
const ActionButtons: React.FC<ActionButtonsProps> = ({
  onAnalyze,
  onOptimize,
  onConvert,
  onDocument,
  isAnalyzing,
  isOptimizing,
  isConverting,
  isDocumenting,
  code,
  sourceLanguage
}) => {
  // Check if source language is supported for conversion
  const isSupportedForConversion = sourceLanguage && ['python', 'r', 'sas'].includes(sourceLanguage);
  
  // Check if any operation is in progress
  const isAnyOperationInProgress = isAnalyzing || isOptimizing || isConverting || isDocumenting;

  return (
    <div className="mt-3 sm:mt-4 px-2 sm:px-0">
      {/* Mobile: 2x2 grid layout */}
      <div className="grid grid-cols-2 gap-2 sm:hidden">
        <GlassButton
          variant="secondary"
          onClick={onAnalyze}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="w-full min-h-12 text-sm"
        >
          {isAnalyzing
            ? (
              <span className="flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                <span className="truncate">Analyzing</span>
              </span>
            )
            : (
              <span className="flex items-center justify-center">
                <Search className="h-4 w-4 mr-1" />
                <span className="truncate">Analyze</span>
              </span>
            )}
        </GlassButton>
        
        <GlassButton
          onClick={onOptimize}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="w-full min-h-12 text-sm"
        >
          {isOptimizing
            ? (
              <span className="flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                <span className="truncate">Optimizing</span>
              </span>
            )
            : (
              <span className="flex items-center justify-center">
                <Zap className="h-4 w-4 mr-1" />
                <span className="truncate">Optimize</span>
              </span>
            )}
        </GlassButton>

        {/* Convert Button with Tooltip Wrapper */}
        <div className="relative">
          <GlassButton
            onClick={onConvert}
            disabled={isAnyOperationInProgress || !code || !isSupportedForConversion}
            borderColor="#9388A2"
            className={`w-full min-h-12 text-sm ${!isSupportedForConversion && code ? 'opacity-60' : ''}`}
          >
            {isConverting
              ? (
                <span className="flex items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                  <span className="truncate">Converting</span>
                </span>
              )
              : (
                <span className="flex items-center justify-center">
                  <Code className="h-4 w-4 mr-1" />
                  <span className="truncate">Convert</span>
                </span>
              )}
          </GlassButton>
          {/* Tooltip for mobile */}
          {!isSupportedForConversion && code && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
              Only Python, R, and SAS are supported
            </div>
          )}
        </div>

        <GlassButton
          onClick={onDocument}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="w-full min-h-12 text-sm"
        >
          {isDocumenting
            ? (
              <span className="flex items-center justify-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                <span className="truncate">Documenting</span>
              </span>
            )
            : (
              <span className="flex items-center justify-center">
                <FileText className="h-4 w-4 mr-1" />
                <span className="truncate">Document</span>
              </span>
            )}
        </GlassButton>
      </div>

      {/* Tablet and Desktop: horizontal layout */}
      <div className="hidden sm:flex justify-center gap-2 md:gap-3 lg:gap-4 flex-wrap">
        <GlassButton
          variant="secondary"
          onClick={onAnalyze}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="min-w-24 md:min-w-28"
        >
          {isAnalyzing
            ? (
              <span className="flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                Analyzing
              </span>
            )
            : (
              <>
                <Search className="h-4 w-4 mr-1" />
                Analyze
              </>
            )}
        </GlassButton>
        
        <GlassButton
          onClick={onOptimize}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="min-w-24 md:min-w-28"
        >
          {isOptimizing
            ? (
              <span className="flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                Optimizing
              </span>
            )
            : (
              <>
                <Zap className="h-4 w-4 mr-1" />
                Optimize
              </>
            )}
        </GlassButton>

        {/* Convert Button with Tooltip Wrapper for Desktop */}
        <div className="relative group">
          <GlassButton
            onClick={onConvert}
            disabled={isAnyOperationInProgress || !code || !isSupportedForConversion}
            borderColor="#9388A2"
            className={`min-w-24 md:min-w-28 ${!isSupportedForConversion && code ? 'opacity-60' : ''}`}
          >
            {isConverting
              ? (
                <span className="flex items-center">
                  <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                  Converting
                </span>
              )
              : (
                <>
                  <Code className="h-4 w-4 mr-1" />
                  Convert
                </>
              )}
          </GlassButton>
          {/* Tooltip for desktop */}
          {!isSupportedForConversion && code && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap border border-gray-700">
              Only Python, R, and SAS are supported for conversion
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </div>

        <GlassButton
          onClick={onDocument}
          disabled={isAnyOperationInProgress || !code}
          borderColor="#9388A2"
          className="min-w-24 md:min-w-28"
        >
          {isDocumenting
            ? (
              <span className="flex items-center">
                <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin mr-2" />
                Documenting
              </span>
            )
            : (
              <>
                <FileText className="h-4 w-4 mr-1" />
                Document
              </>
            )}
        </GlassButton>
      </div>
    </div>
  );
};
export default ActionButtons;