
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ScoreData } from '@/api/service';
import { Badge } from '@/components/ui/badge';
import { CircleHelp } from 'lucide-react';

interface ScoreCardDisplayProps {
  scores: ScoreData;
}

const ScoreCard = ({ 
  title, 
  score, 
  explanation, 
  color 
}: { 
  title: string; 
  score: number; 
  explanation: string;
  color: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
            <CardHeader className="py-2 px-4 flex flex-row justify-between items-center">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Badge 
                variant="secondary" 
                className="font-mono font-bold text-xs"
                style={{ backgroundColor: `rgba(${color}, 0.1)`, color: `rgb(${color})` }}
              >
                {score.toFixed(1)}/10
              </Badge>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Progress
                value={score * 10} 
                className="h-1.5 mt-2"
                style={{ 
                  backgroundColor: `rgba(${color}, 0.2)`,
                }}
                indicatorClassName={`bg-[rgb(${color})]`}
              />
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs max-w-xs">{explanation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const ScoreCardDisplay = ({ scores }: ScoreCardDisplayProps) => {
  if (!scores) return null;

  const { overall, categories } = scores;

  // Color mappings (RGB values)
  const colors = {
    overall: "59, 130, 246",
    maintainability: "99, 102, 241",
    performance: "236, 72, 153",
    readability: "16, 185, 129",
    security: "245, 158, 11",
    testCoverage: "124, 58, 237"
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center mb-6">
        <div className="text-sm text-muted-foreground flex items-center gap-1 mb-1">
          <span>Overall Code Quality</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <CircleHelp size={14} className="text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">Calculated based on all category scores with weighted importance</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-4xl font-bold mb-2">{overall.toFixed(1)}<span className="text-base text-muted-foreground">/10</span></div>
        <Progress 
          value={overall * 10} 
          className="h-2 w-48"
          style={{ backgroundColor: `rgba(${colors.overall}, 0.2)` }}
          indicatorClassName={`bg-[rgb(${colors.overall})]`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ScoreCard 
          title="Maintainability" 
          score={categories.maintainability.score} 
          explanation={categories.maintainability.explanation}
          color={colors.maintainability}
        />
        <ScoreCard 
          title="Performance" 
          score={categories.performance.score} 
          explanation={categories.performance.explanation}
          color={colors.performance}
        />
        <ScoreCard 
          title="Readability" 
          score={categories.readability.score} 
          explanation={categories.readability.explanation}
          color={colors.readability}
        />
        <ScoreCard 
          title="Security" 
          score={categories.security.score} 
          explanation={categories.security.explanation}
          color={colors.security}
        />
        <ScoreCard 
          title="Test Coverage" 
          score={categories.testCoverage.score} 
          explanation={categories.testCoverage.explanation}
          color={colors.testCoverage}
        />
      </div>
    </div>
  );
};

export default ScoreCardDisplay;
