import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, Cpu, HardDrive, Zap } from 'lucide-react';
import { useCode } from '@/context/CodeContext';
import { type ScoreCategory } from '@/types/api';

interface PerformanceAnalysisProps {
  scores: {
    readability: ScoreCategory;
    maintainability: ScoreCategory;
    performance_efficiency: ScoreCategory;
    security_vulnerability: ScoreCategory;
    test_coverage: ScoreCategory;
  };
  overall_score: number;
}

const PerformanceAnalysis: React.FC<PerformanceAnalysisProps> = ({ scores, overall_score }) => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  // Transform optimization metrics data
  const performanceMetrics = [
    {
      icon: Clock,
      iconColor: 'text-blue-400/80',
      value: `${optimizationResult.metrics.executionTime.value}%`,
      label: 'Execution Time',
      improvement: optimizationResult.metrics.executionTime.label,
      before: `${Math.round(optimizationResult.metrics.executionTime.value * 1.5)}%`,
      after: `${optimizationResult.metrics.executionTime.value}%`,
      percentage: 100 - optimizationResult.metrics.executionTime.value,
      barColor: 'bg-blue-400/30'
    },
    {
      icon: Database,
      iconColor: 'text-emerald-400/80',
      value: `${optimizationResult.metrics.memoryUsage.value}%`,
      label: 'Memory Usage',
      improvement: optimizationResult.metrics.memoryUsage.label,
      before: `${Math.round(optimizationResult.metrics.memoryUsage.value * 1.5)}%`,
      after: `${optimizationResult.metrics.memoryUsage.value}%`,
      percentage: 100 - optimizationResult.metrics.memoryUsage.value,
      barColor: 'bg-emerald-400/30'
    },
    {
      icon: Cpu,
      iconColor: 'text-violet-400/80',
      value: `${optimizationResult.metrics.codeComplexity.value}%`,
      label: 'Code Complexity',
      improvement: optimizationResult.metrics.codeComplexity.label,
      before: `${Math.round(optimizationResult.metrics.codeComplexity.value * 1.5)}%`,
      after: `${optimizationResult.metrics.codeComplexity.value}%`,
      percentage: 100 - optimizationResult.metrics.codeComplexity.value,
      barColor: 'bg-violet-400/30'
    },
    {
      icon: HardDrive,
      iconColor: 'text-amber-400/80',
      value: `${optimizationResult.improvement_percentages?.execution_time || 0}%`,
      label: 'Resource Usage',
      improvement: `${optimizationResult.improvement_percentages?.memory_usage || 0}% reduction`,
      before: `${Math.round((optimizationResult.improvement_percentages?.execution_time || 0) * 1.5)}%`,
      after: `${optimizationResult.improvement_percentages?.execution_time || 0}%`,
      percentage: 100 - (optimizationResult.improvement_percentages?.execution_time || 0),
      barColor: 'bg-amber-400/30'
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-4 h-4 text-amber-400/80 mr-2" />
            Performance Analysis
          </div>
          <div className="text-sm text-white/70">
            Overall Score: <span className="text-emerald-400/90 font-bold">{overall_score.toFixed(1)}/10</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="text-center">
                <metric.icon className={`w-6 h-6 ${metric.iconColor} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white/90">{metric.value}</div>
                <div className="text-xs text-white/60">{metric.label}</div>
                <div className="text-xs text-emerald-400/90">{metric.improvement}</div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-white/60">Before</span>
                  <span className="text-xs text-white/60">After</span>
                </div>
                <div className="w-full bg-white/5 rounded-full h-4">
                  <div 
                    className={`${metric.barColor} h-4 rounded-full flex items-center justify-end pr-2 backdrop-blur-sm`} 
                    style={{ width: `${metric.percentage}%` }}
                  >
                    <span className="text-[10px] text-white/90 font-medium">{metric.improvement}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/60">{metric.before}</span>
                  <span className="text-xs text-white/60">{metric.after}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceAnalysis; 