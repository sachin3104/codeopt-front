import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock, Target } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';

const NextSteps: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Immediate Actions: from issues_resolved with High priority
  const immediateActions = optimizationResult.issues_resolved
    ?.filter(issue => issue.priority === 'High')
    .map((issue, index) => ({
      number: index + 1,
      text: issue.improvement ?? 'NA'
    })) || [];

  // Future Optimizations: from next_steps.future_optimizations
  const futureOptimizations = optimizationResult.next_steps?.future_optimizations?.map((optimization, index) => ({
    number: index + 1,
    text: optimization ?? 'NA'
  })) || [];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[340px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white/90 flex items-center">
          <ArrowRight className="w-4 h-4 text-blue-400/80 mr-2" />
          Recommended Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Immediate Actions */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white/90 flex items-center">
              <Clock className="w-4 h-4 text-emerald-400/80 mr-2" />
              Immediate Actions
            </h4>
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
            <h4 className="text-lg font-semibold text-white/90 flex items-center">
              <Target className="w-4 h-4 text-violet-400/80 mr-2" />
              Future Optimizations
            </h4>
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