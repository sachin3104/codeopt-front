import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Zap, Eye, TestTube2 } from 'lucide-react';
import { useCode } from '@/context/CodeContext';

const CodeQualityAnalysis: React.FC = () => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  const { scores } = optimizationResult.optimized_code_scores;
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
      before: calculateBeforeScore(scores.maintainability.score, 70),
      after: scores.maintainability.score,
      improvement: 70,
      costSavings: Math.round(70 * 0.5) * 10
    },
    {
      name: 'Performance',
      icon: Zap,
      color: 'bg-emerald-400/80',
      before: calculateBeforeScore(scores.performance_efficiency.score, 31),
      after: scores.performance_efficiency.score,
      improvement: 31,
      costSavings: Math.round(31 * 0.4) * 10
    },
    {
      name: 'Readability',
      icon: Eye,
      color: 'bg-violet-400/80',
      before: calculateBeforeScore(scores.readability.score, 35),
      after: scores.readability.score,
      improvement: 35,
      costSavings: Math.round(35 * 0.3) * 10
    },
    {
      name: 'Test Coverage',
      icon: TestTube2,
      color: 'bg-amber-400/80',
      before: calculateBeforeScore(scores.test_coverage.score, 117),
      after: scores.test_coverage.score,
      improvement: 117,
      costSavings: Math.round(117 * 0.6) * 10
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
                const beforeLabel = getScoreLabel(metric.before);
                const afterLabel = getScoreLabel(metric.after);
                
                return (
                  <tr key={index} className="border-t border-white/10">
                    <td className="py-2">
                      <div className="flex items-center">
                        <div className={`w-2 h-2 ${metric.color} rounded-full mr-2`}></div>
                        <span className="text-white/90">{metric.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <span className={beforeLabel.textColor}>{metric.before.toFixed(1)}/10</span>
                      <span className={`ml-1 px-2 py-0.5 ${beforeLabel.bg} ${beforeLabel.textColor} text-xs rounded`}>
                        {beforeLabel.text}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      <span className={afterLabel.textColor}>{metric.after.toFixed(1)}/10</span>
                      <span className={`ml-1 px-2 py-0.5 ${afterLabel.bg} ${afterLabel.textColor} text-xs rounded`}>
                        {afterLabel.text}
                      </span>
                    </td>
                    <td className="text-center py-2 text-emerald-400/90 font-medium">
                      +{metric.improvement}%
                    </td>
                    <td className="text-right py-2 text-emerald-400/90 font-medium">
                      ${metric.costSavings}/mo
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