import React, { useMemo } from 'react';
import { Infinity } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
import { useDetectedLanguage } from '@/hooks/use-detected-language';
import { useCharacterLimit, formatCharacterCount, isUnlimitedPlan } from '@/hooks/use-character-limit';
import { useSubscription } from '@/hooks/use-subscription';
import MonacoEditorWrapper from './MonacoEditorWrapper';
import { CopyButton } from '@/components/ui/copy-button';

export interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  height?: string;
  isReadOnly?: boolean;
  onEditorMount?: (editor: any) => void;
  title?: string;
  variant?: 'homepage' | 'results'; // 'homepage' shows only character limit, 'results' shows title/copy button
  language?: string; // Language to display in the top bar for results variant
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  height = '500px',
  isReadOnly = false,
  onEditorMount,
  title,
  variant = 'homepage',
  language,
}) => {
  // Only pull code + setter from the new hook
  const { code, setCode } = useCode();

  // If a `value` prop is passed, use it; otherwise the shared `code`
  const displayCode = value !== undefined ? value : code;

  // detect lang on every code change (async)
  const {
    language: detectedLang,
    loading: isDetectingLanguage,
    error: detectLanguageError
  } = useDetectedLanguage(displayCode);

  // Character limit information - fetched from backend via use-subscription
  const { currentCount, limit, isOverLimit, percentageUsed } = useCharacterLimit(displayCode);
  const { subscription } = useSubscription();

  const handleChange = (val?: string) => {
    const newText = val ?? ''
    if (value !== undefined) {
      onChange?.(newText)
    } else {
      setCode(newText)
      onChange?.(newText)
    }
  }

  // Get character count styling based on limit status
  const getCharacterCountStyle = () => {
    return 'text-white/60'
  }

  // Show language in capital letters (or show "Unknown")
  const getLanguageDisplayName = (lang: string) =>
    lang
      ? lang.toUpperCase()
      : 'Unknown'

  // Get character count text with formatting - memoized to prevent unnecessary re-computations
  const getCharacterCountText = useMemo(() => {
    const formattedCount = formatCharacterCount(currentCount)
    if (isUnlimitedPlan(subscription)) {
      return `${formattedCount} / ∞`
    }
    const formattedLimit = formatCharacterCount(limit)
    return `${formattedCount} / ${formattedLimit}`
  }, [currentCount, limit, subscription])

  // Conditional styling based on variant
  const containerClasses = variant === 'homepage' 
    ? "relative backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/20 shadow-lg sm:shadow-xl md:shadow-2xl overflow-hidden h-full flex flex-col"
    : "relative overflow-hidden h-full flex flex-col";

  return (
    <div
      className={containerClasses}
      style={{ height }}
    >
      {/* Editor header - always present but content varies by variant */}
      <div className="flex items-center justify-between p-2 sm:p-3 border-white/20 bg-gradient-to-r from-black/20 via-black/10 to-black/20">
        {variant === 'results' ? (
          <>
            <div className="flex-1 flex items-center gap-2 sm:gap-3">
              {title && (
                <span className="text-sm sm:text-base font-medium text-white/90 ml-1 sm:ml-2">
                  {title}
                </span>
              )}
              {language && (
                <span className="text-xs sm:text-sm text-white/60 bg-white/10 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  {language.toUpperCase()}
                </span>
              )}
            </div>
            <CopyButton text={displayCode} />
          </>
        ) : (
          // Homepage variant - empty top bar
          <div className="flex-1"></div>
        )}
      </div>

      {/* Monaco Editor Wrapper */}
      <MonacoEditorWrapper
        value={displayCode}
        onChange={handleChange}
        language={detectedLang || 'plaintext'}
        isReadOnly={isReadOnly}
        onEditorMount={onEditorMount}
        height="100%"
      />

      {/* Status bar - always present but content varies by variant */}
      <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-white/20 text-xs">
        {variant === 'homepage' ? (
          <>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 text-white/60">
              {/* Language detection status */}
              {displayCode.trim() && (
                <div className="flex items-center gap-1 sm:gap-2">
                  {isDetectingLanguage ? (
                    <>
                      <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-blue-400 animate-pulse"></div>
                    </>
                  ) : detectedLang ? (
                    <>
                      <span className="text-xs sm:text-sm">{getLanguageDisplayName(detectedLang)}</span>
                    </>
                  ) : null}
                </div>
              )}
            </div>
            {/* Only show character count when there's actual content */}
            {displayCode.trim() && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Character count with limit awareness */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className={`${getCharacterCountStyle()} text-xs sm:text-sm`}>
                    {getCharacterCountText}
                  </span>
                  {/* Progress bar for character usage - only show if there's a limit */}
                  {!isUnlimitedPlan(subscription) && (
                    <div className="w-12 sm:w-14 md:w-16 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300 bg-blue-500"
                        style={{ width: `${Math.min(100, percentageUsed)}%` }}
                      />
                    </div>
                  )}
                  {/* Show infinity icon for unlimited plans */}
                  {isUnlimitedPlan(subscription) && (
                    <Infinity className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          // Results variant - empty bottom bar
          <div className="flex-1"></div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor;