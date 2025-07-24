"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  className?: string;
}

const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ text, className, ...props }, ref) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
              } catch (err) {
          // Silently handle copy errors
        }
    };

    return (
      <button
        ref={ref}
        onClick={handleCopy}
        className={cn(
          "inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20",
          className
        )}
        {...props}
      >
        <div className="relative">
          <Copy 
            size={16} 
            className={cn(
              "transition-all duration-300",
              copied ? "opacity-0 scale-75" : "opacity-100 scale-100"
            )}
          />
          <Check 
            size={16} 
            className={cn(
              "absolute inset-0 transition-all duration-300 text-green-400",
              copied ? "opacity-100 scale-100" : "opacity-0 scale-75"
            )}
          />
        </div>
        <span className="transition-all duration-300">
          {copied ? 'Copied!' : 'Copy Code'}
        </span>
      </button>
    );
  }
);

CopyButton.displayName = "CopyButton";

export { CopyButton }; 