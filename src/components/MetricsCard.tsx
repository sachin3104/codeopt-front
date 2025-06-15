import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MetricsCardProps {
  title: string;
  value: number;
  label: string;
  description: string;
  color?: string;
  tooltipText?: string;
  improvement?: boolean;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  label,
  description,
  color = 'bg-primary',
  tooltipText,
  improvement = true
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 rounded-lg p-4">
      <div className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-white">{title}</h3>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-4 w-4 rounded-full bg-white/10 flex items-center justify-center cursor-help">
                    <span className="text-white/70 text-xs">?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black/80 backdrop-blur-xl border border-white/10">
                  <p className="w-[200px] text-xs text-white/90">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <p className="text-xs text-white/70 mt-1">{description}</p>
      </div>
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-white">
            {value}
            <span className="text-sm font-normal ml-1 text-white/70">{label}</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            improvement 
              ? 'bg-green-500/20 text-green-400 border border-green-500/20' 
              : 'bg-red-500/20 text-red-400 border border-red-500/20'
          }`}>
            {improvement ? '↓' : '↑'} {Math.abs(value)}%
          </span>
        </div>
        <Progress 
          value={value} 
          className={`h-1.5 ${color} bg-white/10`} 
        />
      </div>
    </div>
  );
};

export default MetricsCard;
