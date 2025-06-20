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

// Check icon component (outline version)
const CheckIcon: React.FC<CheckIconProps> = ({ className }) => {
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
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
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
    <div className="flex relative justify-start max-w-xl mx-auto flex-col mt-40">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.2, 0);

        return (
          <motion.div
            key={index}
            className="text-left flex gap-2 mb-4"
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && (
                <CheckIcon className="text-gray-400 dark:text-gray-500" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-gray-600 dark:text-gray-300",
                    value === index &&
                      "text-blue-500 dark:text-blue-400 opacity-100"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-gray-700 dark:text-gray-200",
                value === index && "text-blue-600 dark:text-blue-400 opacity-100"
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
          <div className="h-96 relative">
            <LoaderCore value={currentState} loadingStates={loadingStates} />
          </div>

          <div className="inset-x-0 z-20 bottom-0 bg-gradient-to-br from-black/40 via-black/30 to-black/20 h-full absolute opacity-20 pointer-events-none" 
               style={{
                 maskImage: 'radial-gradient(900px at center, transparent 30%, white)',
                 WebkitMaskImage: 'radial-gradient(900px at center, transparent 30%, white)'
               }} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Export the LoadingState type for consumers
export type { LoadingState, MultiStepLoaderProps };