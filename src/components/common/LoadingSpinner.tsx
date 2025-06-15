import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'default' | 'primary' | 'success' | 'warning' | 'error';
type SpinnerState = 'loading' | 'processing' | 'saving' | 'submitting' | 'custom';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  state?: SpinnerState;
  text?: string;
  className?: string;
  fullScreen?: boolean;
  overlay?: boolean;
  showText?: boolean;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

const variantClasses: Record<SpinnerVariant, string> = {
  default: 'text-white/60',
  primary: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

const stateText: Record<SpinnerState, string> = {
  loading: 'Loading...',
  processing: 'Processing...',
  saving: 'Saving...',
  submitting: 'Submitting...',
  custom: '',
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  state = 'loading',
  text,
  className,
  fullScreen = false,
  overlay = false,
  showText = true,
}) => {
  const displayText = text || stateText[state];
  const spinnerClasses = cn(
    'animate-spin',
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const containerClasses = cn(
    'flex flex-col items-center justify-center',
    {
      'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm': fullScreen,
      'absolute inset-0 bg-black/50 backdrop-blur-sm': overlay && !fullScreen,
      'relative': !overlay && !fullScreen,
    }
  );

  const contentClasses = cn(
    'flex flex-col items-center justify-center space-y-4',
    {
      'p-4 rounded-lg bg-black/40 border border-white/20': overlay || fullScreen,
    }
  );

  return (
    <div
      className={containerClasses}
      role="status"
      aria-label={displayText}
    >
      <div className={contentClasses}>
        <Loader2 className={spinnerClasses} />
        {showText && displayText && (
          <span className="text-sm font-medium text-white/80">
            {displayText}
          </span>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner; 