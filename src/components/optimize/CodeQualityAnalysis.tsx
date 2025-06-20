import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Zap, Eye, TestTube2 } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';
import { type OptimizedCodeScores } from '@/types/api';
import { type MetricsData } from '@/types/metrics';

interface CodeQualityAnalysisProps {
  scores: OptimizedCodeScores;
  metricsData: MetricsData;
}

const CodeQualityAnalysis: React.FC<CodeQualityAnalysisProps> = ({
  scores,
  metricsData
}) => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Get code quality metrics from the new structure
  const codeQualityMetrics = optimizationResult.code_quality_analysis?.code_quality_metrics;
  const overallScore = codeQualityMetrics?.overall_score?.optimized ?? 0;

  // Calculate before scores based on improvement percentages
  const calculateBeforeScore = (currentScore: number, improvement: number) => {
    return Math.max(0, Math.min(10, currentScore / (1 + improvement / 100)));
  };

  const qualityMetrics = [
    {
      name: 'Maintainability',
      icon: Code2,
      color: 'bg-blue-400/80',
      before: codeQualityMetrics?.maintainability?.original ?? 'NA',
      after: codeQualityMetrics?.maintainability?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.maintainability?.improvement_percentage ?? 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Performance',
      icon: Zap,
      color: 'bg-emerald-400/80',
      before: codeQualityMetrics?.performance_efficiency?.original ?? 'NA',
      after: codeQualityMetrics?.performance_efficiency?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.performance_efficiency?.improvement_percentage ?? 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Readability',
      icon: Eye,
      color: 'bg-violet-400/80',
      before: codeQualityMetrics?.readability?.original ?? 'NA',
      after: codeQualityMetrics?.readability?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.readability?.improvement_percentage ?? 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Test Coverage',
      icon: TestTube2,
      color: 'bg-amber-400/80',
      before: codeQualityMetrics?.test_coverage?.original ?? 'NA',
      after: codeQualityMetrics?.test_coverage?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.test_coverage?.improvement_percentage ?? 'NA',
      costSavings: 'NA'
    }
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 8) return { text: 'Excellent', bg: 'bg-green-100/20', textColor: 'text-green-400' };
    if (score >= 6) return { text: 'Good', bg: 'bg-emerald-100/20', textColor: 'text-emerald-400' };
    if (score >= 4) return { text: 'Fair', bg: 'bg-yellow-100/20', textColor: 'text-yellow-400' };
    return { text: 'Poor', bg: 'bg-red-100/20', textColor: 'text-red-400' };
  };

  const getScoreLevel = (score: number) => {
    if (score >= 8) return { text: 'High', bg: 'bg-green-500/20', textColor: 'text-green-400' };
    if (score >= 5) return { text: 'Medium', bg: 'bg-yellow-500/20', textColor: 'text-yellow-400' };
    return { text: 'Low', bg: 'bg-red-500/20', textColor: 'text-red-400' };
  };

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <Code2 className="w-4 h-4 text-amber-400/80 mr-2" />
            Code Quality Improvements
          </div>
          <div className="text-sm text-white/70">
            Overall Score: <span className="text-emerald-400/90 font-bold">{overallScore.toFixed(1)}/10</span>
            <span className="text-white/50 ml-1">(was {codeQualityMetrics?.overall_score?.original?.toFixed(1) ?? 'NA'})</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/60 uppercase">
                <th className="text-left pb-2 w-1/6">Metric</th>
                <th className="text-center pb-2 w-1/6">Before</th>
                <th className="text-center pb-2 w-1/6"></th>
                <th className="text-center pb-2 w-1/6">After</th>
                <th className="text-center pb-2 w-1/6"></th>
                <th className="text-center pb-2 w-1/6">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {qualityMetrics.map((metric, index) => {
                const beforeLabel = typeof metric.before === 'number' ? getScoreLabel(metric.before) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const afterLabel = typeof metric.after === 'number' ? getScoreLabel(metric.after) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const beforeLevel = typeof metric.before === 'number' ? getScoreLevel(metric.before) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const afterLevel = typeof metric.after === 'number' ? getScoreLevel(metric.after) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                
                return (
                  <tr key={index} className="border-t border-white/10">
                    <td className="py-3">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${metric.color} rounded-full mr-2`}></div>
                        <span className="text-white/90 font-medium">{metric.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 align-middle">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`text-lg font-semibold ${beforeLabel.textColor}`}>{typeof metric.before === 'number' ? metric.before.toFixed(1) + '/10' : 'NA'}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 align-middle">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${beforeLevel.bg} ${beforeLevel.textColor}`}>
                          {beforeLevel.text}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 align-middle">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`text-lg font-semibold ${afterLabel.textColor}`}>{typeof metric.after === 'number' ? metric.after.toFixed(1) + '/10' : 'NA'}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 align-middle">
                      <div className="flex justify-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${afterLevel.bg} ${afterLevel.textColor}`}>
                          {afterLevel.text}
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-3 text-emerald-400/90 font-medium align-middle">
                      {typeof metric.improvement === 'number' ? `+${metric.improvement.toFixed(1)}%` : 'NA'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeQualityAnalysis; 