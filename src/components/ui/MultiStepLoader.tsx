import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Utility function to merge classNames (replace with your preferred method)
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// TypeScript interfaces
interface LoadingState {
  text: string;
}

interface CheckIconProps {
  className?: string;
}

interface LoaderCoreProps {
  loadingStates: LoadingState[];
  value?: number;
}

interface MultiStepLoaderProps {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  className?: string;
}

// Queue icon component for pending processes
const QueueIcon: React.FC<CheckIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" 
      />
    </svg>
  );
};

// Processing icon component for ongoing processes
const ProcessingIcon: React.FC<CheckIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082m-.75-.082a24.301 24.301 0 0 0-4.5 0m0 0v5.714a2.25 2.25 0 0 0 .659 1.591L15 12.75m-4.5-9.75v5.714a2.25 2.25 0 0 1-.659 1.591L9 12.75" 
      />
    </svg>
  );
};

// Check icon component (filled version)
const CheckFilled: React.FC<CheckIconProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

// Core loader component
const LoaderCore: React.FC<LoaderCoreProps> = ({
  loadingStates,
  value = 0,
}) => {
  return (
    <div className="flex relative justify-start max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto flex-col mt-20 xs:mt-24 sm:mt-28 md:mt-32 lg:mt-40 px-4 xs:px-6 sm:px-8">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={index}
            className={cn(
              "text-left flex gap-2 xs:gap-3 sm:gap-3 mb-3 xs:mb-4 sm:mb-4 p-2 xs:p-3 rounded-lg transition-all duration-300"
            )}
            initial={{ opacity: 0, y: -(value * 32) }}
            animate={{ opacity: opacity, y: -(value * 32) }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex-shrink-0">
              {index > value && (
                <QueueIcon className="text-gray-400 dark:text-gray-500 w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6" />
              )}
              {index < value && (
                <CheckFilled
                  className={cn(
                    "w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6",
                    "text-emerald-400 dark:text-emerald-300"
                  )}
                />
              )}
              {index === value && (
                <ProcessingIcon
                  className={cn(
                    "w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6",
                    "text-blue-400 dark:text-blue-300 drop-shadow-lg"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-sm xs:text-base sm:text-base leading-relaxed font-medium",
                index < value 
                  ? "text-emerald-300 dark:text-emerald-200" 
                  : "text-blue-200 dark:text-blue-100",
                value === index && "text-blue-300 dark:text-blue-200 font-semibold drop-shadow-sm"
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

// Main MultiStepLoader component
export const MultiStepLoader: React.FC<MultiStepLoaderProps> = ({
  loadingStates,
  loading = false,
  duration = 30000,
  loop = true,
  className,
}) => {
  const [currentState, setCurrentState] = useState<number>(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "w-full h-full fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20",
            className
          )}
        >
          <div className="h-64 xs:h-72 sm:h-80 md:h-88 lg:h-96 relative w-full max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          <div className="inset-x-0 z-20 bottom-0 bg-gradient-to-br from-black/40 via-black/30 to-black/20 h-full absolute opacity-20 pointer-events-none" 
               style={{
                 maskImage: 'radial-gradient(600px at center, transparent 30%, white)',
                 WebkitMaskImage: 'radial-gradient(600px at center, transparent 30%, white)'
               }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export the LoadingState type for consumers
export type { LoadingState, MultiStepLoaderProps };