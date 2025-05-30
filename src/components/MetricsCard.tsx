
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {tooltipText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center cursor-help">
                    <span className="text-muted-foreground text-xs">?</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs">{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold">
            {value}
            <span className="text-sm font-normal ml-1">{label}</span>
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${improvement ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {improvement ? '↓' : '↑'} {Math.abs(value)}%
          </span>
        </div>
        <Progress value={value} className={`h-1.5 ${color}`} />
      </CardContent>
    </Card>
  );
};

export default MetricsCard;
