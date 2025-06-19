import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimize } from '@/hooks/use-optimize';

interface NextStepsProps {
  suggestions: string[];
}

const NextSteps: React.FC<NextStepsProps> = ({
  suggestions
}) => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Immediate Actions: from detailed_changes with Execution Time or Memory Usage
  const immediateActions = optimizationResult.detailed_changes
    ?.filter(change => 
      change.metric === 'Execution Time' || 
      change.metric === 'Memory Usage'
    )
    .map((change, index) => ({
      number: index + 1,
      text: change.improvement ?? 'NA'
    })) || [];

  // Future Optimizations: from suggestions prop
  const futureOptimizations = Array.isArray(suggestions) && suggestions.length > 0
    ? suggestions.map((suggestion, index) => ({
        number: index + 1,
        text: suggestion ?? 'NA'
      }))
    : [];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90">Recommended Next Steps</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          {/* Immediate Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white/90">Immediate Actions</h4>
            <ul className="space-y-4">
              {immediateActions.length > 0 ? (
                immediateActions.map((action) => (
                  <li key={action.number} className="flex items-start space-x-3">
                    <span className="text-blue-400/80 font-medium">{action.number}.</span>
                    <span className="text-white/80">{action.text}</span>
                  </li>
                ))
              ) : (
                <li className="text-white/60">NA</li>
              )}
            </ul>
          </div>

          {/* Future Optimizations */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white/90">Future Optimizations</h4>
            <ul className="space-y-4">
              {futureOptimizations.length > 0 ? (
                futureOptimizations.map((optimization) => (
                  <li key={optimization.number} className="flex items-start space-x-3">
                    <span className="text-violet-400/80 font-medium">{optimization.number}.</span>
                    <span className="text-white/80">{optimization.text}</span>
                  </li>
                ))
              ) : (
                <li className="text-white/60">NA</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextSteps; 