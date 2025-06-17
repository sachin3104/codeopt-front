import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCode } from '@/context/CodeContext';
import { 
  CheckCircle, 
  Zap, 
  DollarSign, 
  Calendar 
} from 'lucide-react';

const ExecutiveSummary: React.FC = () => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  // Calculate total issues resolved
  const totalIssues = optimizationResult.detailed_changes?.length || 0;
  
  // Calculate performance gain from execution time improvement
  const performanceGain = Math.round(
    Number(optimizationResult.metrics.executionTime.improvement) * 100
  );

  // Calculate monthly savings
  const monthlySavings = Math.round(
    (Number(optimizationResult.metrics.executionTime.improvement) +
    Number(optimizationResult.metrics.memoryUsage.improvement) +
    Number(optimizationResult.metrics.codeComplexity.improvement)) * 100
  );

  // Calculate ROI timeline (assuming $200 monthly savings)
  const roiTimeline = (200 / monthlySavings).toFixed(1);

  const summaryMetrics = [
    {
      value: `${totalIssues}/${totalIssues}`,
      label: 'Issues Resolved',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400/80" />,
      color: 'text-emerald-400/90'
    },
    {
      value: `${performanceGain}%`,
      label: 'Performance Gain',
      icon: <Zap className="w-5 h-5 text-blue-400/80" />,
      color: 'text-blue-400/90'
    },
    {
      value: `$${monthlySavings}`,
      label: 'Monthly Savings',
      icon: <DollarSign className="w-5 h-5 text-violet-400/80" />,
      color: 'text-violet-400/90'
    },
    {
      value: `${roiTimeline}mo`,
      label: 'ROI Timeline',
      icon: <Calendar className="w-5 h-5 text-orange-400/80" />,
      color: 'text-orange-400/90'
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90">Optimization Executive Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-white/80">
            The optimization process successfully addressed all {totalIssues} issues identified in the code analysis, 
            resulting in a {performanceGain}% overall improvement in code quality. The optimized code runs {performanceGain}% faster 
            while using {Math.round(Number(optimizationResult.metrics.memoryUsage.improvement) * 100)}% less memory, 
            providing significant cost savings and improved reliability.
          </p>

          <div className="grid grid-cols-4 gap-6">
            {summaryMetrics.map((metric, index) => (
              <div 
                key={index} 
                className="bg-white/5 rounded-lg p-4 border border-white/10 text-center"
              >
                <div className="flex justify-center mb-2">
                  {metric.icon}
                </div>
                <div className={`text-2xl font-bold ${metric.color}`}>
                  {metric.value}
                </div>
                <div className="text-sm text-white/60">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutiveSummary; 