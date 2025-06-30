import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { ScoreData, ScoreCategory } from '@/types/api';
import { Badge } from '@/components/ui/badge';
import { CircleHelp } from 'lucide-react';

interface CodeScoreSectionProps {
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

const CodeScoreSection: React.FC<CodeScoreSectionProps> = ({ scores }) => {
  if (!scores) return null;

  const { overall, categories } = scores;
  
  // Check if overall score exists and is a valid number
  if (overall === undefined || overall === null || typeof overall !== 'number') {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 rounded-lg border border-white/20 shadow-2xl p-6">
        <h2 className="text-base font-medium text-white/90 mb-4">Code Quality Analysis</h2>
        <div className="space-y-6">
          <Card className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="text-sm text-muted-foreground mb-2">Overall Code Quality</div>
                <div className="text-lg text-muted-foreground">Score data not available</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const overallRating = getRating(overall);

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20  rounded-lg shadow-2xl px-4 py-2">
      <div className="">
        {/* Overall Score Section */}
        <Card className='bg-transparent border-none shadow-none'>
          <CardContent className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium text-white/90">Code Quality Analysis</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold">{overall.toFixed(1)}<span className="text-sm text-muted-foreground">/10</span></div>
                <Badge 
                  variant="secondary" 
                  className="font-medium text-xs px-2 py-1"
                  style={{ backgroundColor: `${overallRating.color}20`, color: overallRating.color }}
                >
                  {overallRating.text}
                </Badge>
              </div>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {['performance', 'readability', 'maintainability', 'security', 'testCoverage'].map((key) => {
                const category = categories?.[key];
                // Check if category and category.score exist and are valid
                if (!category || typeof (category as ScoreCategory).score !== 'number') {
                  return (
                    <tr key={key} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-sm font-medium text-white/90 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className="font-mono font-bold text-xs">
                          N/A
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary" className="font-medium text-xs">
                          N/A
                        </Badge>
                      </td>
                    </tr>
                  );
                }
                
                const scoreCategory = category as ScoreCategory;
                const rating = getRating(scoreCategory.score);
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
                        {scoreCategory.score.toFixed(1)}/10
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CodeScoreSection; 