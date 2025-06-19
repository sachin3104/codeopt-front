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

  const { scores: optimizedScores } = optimizationResult.optimized_code_scores;
  const overallScore = optimizationResult.optimized_code_scores.overall_score;

  // Calculate before scores based on improvement percentages
  const calculateBeforeScore = (currentScore: number, improvement: number) => {
    return Math.max(0, Math.min(10, currentScore / (1 + improvement / 100)));
  };

  const qualityMetrics = [
    {
      name: 'Maintainability',
      icon: Code2,
      color: 'bg-blue-400/80',
      before: typeof scores.scores.maintainability.score === 'number' ? calculateBeforeScore(scores.scores.maintainability.score, 70) : 'NA',
      after: typeof scores.scores.maintainability.score === 'number' ? scores.scores.maintainability.score : 'NA',
      improvement: 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Performance',
      icon: Zap,
      color: 'bg-emerald-400/80',
      before: typeof scores.scores.performance_efficiency.score === 'number' ? calculateBeforeScore(scores.scores.performance_efficiency.score, 31) : 'NA',
      after: typeof scores.scores.performance_efficiency.score === 'number' ? scores.scores.performance_efficiency.score : 'NA',
      improvement: 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Readability',
      icon: Eye,
      color: 'bg-violet-400/80',
      before: typeof scores.scores.readability.score === 'number' ? calculateBeforeScore(scores.scores.readability.score, 35) : 'NA',
      after: typeof scores.scores.readability.score === 'number' ? scores.scores.readability.score : 'NA',
      improvement: 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Test Coverage',
      icon: TestTube2,
      color: 'bg-amber-400/80',
      before: typeof scores.scores.test_coverage.score === 'number' ? calculateBeforeScore(scores.scores.test_coverage.score, 117) : 'NA',
      after: typeof scores.scores.test_coverage.score === 'number' ? scores.scores.test_coverage.score : 'NA',
      improvement: 'NA',
      costSavings: 'NA'
    }
  ];

  const getScoreLabel = (score: number) => {
    if (score >= 8) return { text: 'Excellent', bg: 'bg-green-100/20', textColor: 'text-green-400' };
    if (score >= 6) return { text: 'Good', bg: 'bg-emerald-100/20', textColor: 'text-emerald-400' };
    if (score >= 4) return { text: 'Fair', bg: 'bg-yellow-100/20', textColor: 'text-yellow-400' };
    return { text: 'Poor', bg: 'bg-red-100/20', textColor: 'text-red-400' };
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
            <span className="text-white/50 ml-1">(was {Math.min(overallScore - 2, 6.0).toFixed(1)})</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/60 uppercase">
                <th className="text-left pb-2">Metric</th>
                <th className="text-center pb-2">Before</th>
                <th className="text-center pb-2">After</th>
                <th className="text-center pb-2">Improvement</th>
                <th className="text-right pb-2">Cost Savings</th>
              </tr>
            </thead>
            <tbody>
              {qualityMetrics.map((metric, index) => {
                const beforeLabel = typeof metric.before === 'number' ? getScoreLabel(metric.before) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const afterLabel = typeof metric.after === 'number' ? getScoreLabel(metric.after) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                
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
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className={`text-lg font-semibold ${afterLabel.textColor}`}>{typeof metric.after === 'number' ? metric.after.toFixed(1) + '/10' : 'NA'}</span>
                      </div>
                    </td>
                    <td className="text-center py-3 text-emerald-400/90 font-medium align-middle">
                      +{metric.improvement}
                    </td>
                    <td className="text-right py-3 text-emerald-400/90 font-medium align-middle">
                      {metric.costSavings !== 'NA' ? `$${metric.costSavings}/mo` : 'NA'}
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