import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ScoreData } from '@/api/service';
import { Badge } from '@/components/ui/badge';
import { CircleHelp } from 'lucide-react';

interface ScoreCardDisplayProps {
  scores: ScoreData;
}

const getRating = (score: number): { text: string; color: string } => {
  if (score >= 8) {
    return { text: 'High', color: 'rgb(16, 185, 129)' }; // Green
  } else if (score >= 5) {
    return { text: 'Medium', color: 'rgb(245, 158, 11)' }; // Orange
  } else {
    return { text: 'Low', color: 'rgb(239, 68, 68)' }; // Red
  }
};

const ScoreCardDisplay = ({ scores }: ScoreCardDisplayProps) => {
  if (!scores) return null;

  const { overall, categories } = scores;
  const overallRating = getRating(overall);

  return (
    <div className="space-y-6">
      {/* Overall Score Section */}
      <Card className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
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
            <div className="flex items-center gap-4 mb-3">
              <div className="text-4xl font-bold">{overall.toFixed(1)}<span className="text-base text-muted-foreground">/10</span></div>
              <Badge 
                variant="secondary" 
                className="font-medium text-sm px-3 py-1"
                style={{ backgroundColor: `${overallRating.color}20`, color: overallRating.color }}
              >
                {overallRating.text}
              </Badge>
            </div>
            <Progress 
              value={overall * 10} 
              className="h-2 w-48"
              style={{ backgroundColor: `${overallRating.color}20` }}
              indicatorClassName={`bg-[${overallRating.color}]`}
            />
          </div>
        </CardContent>
      </Card>

      {/* Metrics Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Metric</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Explanation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {Object.entries(categories).map(([key, category]) => {
              const rating = getRating(category.score);
              return (
                <tr key={key} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium text-white/90 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge 
                      variant="secondary" 
                      className="font-mono font-bold text-xs"
                      style={{ backgroundColor: `${rating.color}20`, color: rating.color }}
                    >
                      {category.score.toFixed(1)}/10
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <Badge 
                      variant="secondary" 
                      className="font-medium text-xs"
                      style={{ backgroundColor: `${rating.color}20`, color: rating.color }}
                    >
                      {rating.text}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {category.explanation}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScoreCardDisplay;
