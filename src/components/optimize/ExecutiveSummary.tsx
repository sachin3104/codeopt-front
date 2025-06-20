import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimize } from '@/hooks/use-optimize';
import { 
  CheckCircle, 
  Zap, 
  DollarSign, 
  Calendar 
} from 'lucide-react';
import { type MetricsData } from '@/types/metrics';

interface ExecutiveSummaryProps {
  metricsData: MetricsData;
}

const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({
  metricsData
}) => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Use backend values directly, fallback to 'NA' if not present
  const totalIssues = Array.isArray(optimizationResult.issues_resolved)
    ? optimizationResult.issues_resolved.length
    : 'NA';

  const performanceGain =
    optimizationResult.performance_analysis?.performance_metrics?.execution_time?.improvement_percentage ?? 'NA';

  const monthlySavings =
    optimizationResult.resource_savings?.monthly_server_cost_savings !== undefined
      ? `$${optimizationResult.resource_savings.monthly_server_cost_savings}`
      : 'NA';

  const roiTimeline =
    optimizationResult.resource_savings?.['Expected Annual Shavings'] !== undefined
      ? `${optimizationResult.resource_savings['Expected Annual Shavings']}%`
      : 'NA';

  const summaryMetrics = [
    {
      value: totalIssues !== 'NA' ? `${totalIssues}` : 'NA',
      label: 'Issues Resolved',
      icon: <CheckCircle className="w-5 h-5 text-emerald-400/80" />,
      color: 'text-emerald-400/90'
    },
    {
      value: performanceGain !== 'NA' ? `${performanceGain}%` : 'NA',
      label: 'Performance Gain',
      icon: <Zap className="w-5 h-5 text-blue-400/80" />,
      color: 'text-blue-400/90'
    },
    {
      value: monthlySavings,
      label: 'Monthly Savings',
      icon: <DollarSign className="w-5 h-5 text-violet-400/80" />,
      color: 'text-violet-400/90'
    },
    {
      value: roiTimeline,
      label: 'Annual ROI',
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