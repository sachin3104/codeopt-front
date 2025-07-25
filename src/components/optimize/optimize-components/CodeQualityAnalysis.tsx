import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Zap, Eye, TestTube2, Shield } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';

const CodeQualityAnalysis: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Get code quality metrics from the new structure
  const codeQualityMetrics = optimizationResult.code_quality_analysis?.code_quality_metrics;
  const overallScore = codeQualityMetrics?.overall_score?.optimized ?? 0;

  const qualityMetrics = [
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
      name: 'Maintainability',
      icon: Code2,
      color: 'bg-blue-400/80',
      before: codeQualityMetrics?.maintainability?.original ?? 'NA',
      after: codeQualityMetrics?.maintainability?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.maintainability?.improvement_percentage ?? 'NA',
      costSavings: 'NA'
    },
    {
      name: 'Security',
      icon: Shield,
      color: 'bg-red-400/80',
      before: codeQualityMetrics?.security_vulnerability?.original ?? 'NA',
      after: codeQualityMetrics?.security_vulnerability?.optimized ?? 'NA',
      improvement: codeQualityMetrics?.security_vulnerability?.improvement_percentage ?? 'NA',
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

  const getScoreLevel = (score: number) => {
    if (score >= 7.5) return { text: 'High', bg: 'bg-green-500/20', textColor: 'text-green-400' };
    if (score >= 5) return { text: 'Medium', bg: 'bg-yellow-500/20', textColor: 'text-yellow-400' };
    return { text: 'Low', bg: 'bg-red-500/20', textColor: 'text-red-400' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10 min-h-[280px] xs:min-h-[320px] sm:min-h-[340px] md:min-h-[400px] flex flex-col">
      <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
        <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
          <div className="flex items-center">
            <Code2 className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
            Code Quality Improvements
          </div>
          <div className="text-xs xs:text-sm text-white/70">
            Overall Score: <span className="text-emerald-400/90 font-bold">{overallScore.toFixed(1)}/10</span>
            <span className="text-white/50 ml-1">(was {codeQualityMetrics?.overall_score?.original?.toFixed(1) ?? 'NA'})</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center p-3 xs:p-4 sm:p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-white/60 uppercase">
                <th className="text-left pb-2 xs:pb-3 sm:pb-3 w-1/4 border-r border-white/10 text-xs xs:text-xs sm:text-xs">Metric</th>
                <th className="text-center pb-2 xs:pb-3 sm:pb-3 w-1/4 border-r border-white/10 text-xs xs:text-xs sm:text-xs">
                  Before
                </th>
                <th className="text-center pb-2 xs:pb-3 sm:pb-3 w-1/4 border-r border-white/10 text-xs xs:text-xs sm:text-xs">
                  After
                </th>
                <th className="text-center pb-2 xs:pb-3 sm:pb-3 w-1/4 text-xs xs:text-xs sm:text-xs">Improvement</th>
              </tr>
            </thead>
            <tbody>
              {qualityMetrics.map((metric, index) => {
                const beforeLevel = typeof metric.before === 'number' ? getScoreLevel(metric.before) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const afterLevel = typeof metric.after === 'number' ? getScoreLevel(metric.after) : { text: 'N/A', bg: 'bg-gray-100/20', textColor: 'text-gray-400' };
                const beforeColor = typeof metric.before === 'number' ? getScoreColor(metric.before) : 'text-gray-400';
                const afterColor = typeof metric.after === 'number' ? getScoreColor(metric.after) : 'text-gray-400';
                
                return (
                  <tr key={index}>
                    <td className="py-2 xs:py-3 sm:py-4 border-r border-white/10">
                      <div className="flex items-center">
                        <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 ${metric.color} rounded-full mr-1.5 xs:mr-2`}></div>
                        <span className="text-white/90 font-medium text-xs xs:text-sm sm:text-sm">{metric.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-2 xs:py-3 sm:py-4 border-r border-white/10">
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`text-sm xs:text-base sm:text-lg font-semibold ${beforeColor}`}>
                          {typeof metric.before === 'number' ? metric.before.toFixed(1) + '/10' : 'NA'}
                        </div>
                        <div className={`text-xs xs:text-sm font-medium ${beforeColor}`}>
                          <span className={`px-2 py-0.5 xs:px-3 xs:py-1 rounded-full text-xs font-medium bg-white/10 ${beforeColor}`}>
                            {beforeLevel.text}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-2 xs:py-3 sm:py-4 border-r border-white/10">
                      <div className="grid grid-cols-2 gap-1">
                        <div className={`text-sm xs:text-base sm:text-lg font-semibold ${afterColor}`}>
                          {typeof metric.after === 'number' ? metric.after.toFixed(1) + '/10' : 'NA'}
                        </div>
                        <div className={`text-xs xs:text-sm font-medium ${afterColor}`}>
                          <span className={`px-2 py-0.5 xs:px-3 xs:py-1 rounded-full text-xs font-medium bg-white/10 ${afterColor}`}>
                            {afterLevel.text}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="text-center py-2 xs:py-3 sm:py-4 text-emerald-400/90 font-medium text-xs xs:text-sm sm:text-sm">
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