import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCode } from '@/context/CodeContext';

const NextSteps: React.FC = () => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  // Get immediate actions from optimization result (using execution time and memory usage metrics)
  const immediateActions = optimizationResult.detailed_changes
    ?.filter(change => 
      change.metric === 'Execution Time' || 
      change.metric === 'Memory Usage'
    )
    .map((change, index) => ({
      number: index + 1,
      text: change.improvement
    })) || [];

  // Get future optimizations from optimization result (using code complexity metric)
  const futureOptimizations = optimizationResult.detailed_changes
    ?.filter(change => change.metric === 'Code Complexity')
    .map((change, index) => ({
      number: index + 1,
      text: change.improvement
    })) || [];

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
              {immediateActions.map((action) => (
                <li key={action.number} className="flex items-start space-x-3">
                  <span className="text-blue-400/80 font-medium">{action.number}.</span>
                  <span className="text-white/80">{action.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Future Optimizations */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white/90">Future Optimizations</h4>
            <ul className="space-y-4">
              {futureOptimizations.map((optimization) => (
                <li key={optimization.number} className="flex items-start space-x-3">
                  <span className="text-violet-400/80 font-medium">{optimization.number}.</span>
                  <span className="text-white/80">{optimization.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NextSteps; 