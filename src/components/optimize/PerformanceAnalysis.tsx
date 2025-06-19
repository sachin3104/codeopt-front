import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, Cpu, HardDrive, Zap } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';
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
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Helper to get metric values or fallback to 'NA'
  const getMetric = (path: string[], fallback = 'NA') => {
    try {
      return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), optimizationResult) ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Data for left side (Performance Gains Achieved)
  const leftMetrics = [
    {
      icon: Clock,
      iconColor: 'text-blue-500',
      value: getMetric(['execution_time', 'optimized']) !== 'NA' ? `${getMetric(['execution_time', 'optimized'])}s` : 'NA',
      label: 'Execution Time',
      improvement: getMetric(['improvement_percentages', 'execution_time']) !== 'NA' ? `${getMetric(['improvement_percentages', 'execution_time'])}% faster` : 'NA',
    },
    {
      icon: Database,
      iconColor: 'text-green-500',
      value: getMetric(['memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['memory_usage', 'optimized'])}MB` : 'NA',
      label: 'Memory Usage',
      improvement: getMetric(['improvement_percentages', 'memory_usage']) !== 'NA' ? `${getMetric(['improvement_percentages', 'memory_usage'])}% reduction` : 'NA',
    },
    {
      icon: Cpu,
      iconColor: 'text-purple-500',
      value: getMetric(['code_complexity', 'optimized']) !== 'NA' ? `${Math.round(getMetric(['code_complexity', 'optimized']) * 100)}%` : 'NA',
      label: 'CPU Utilization',
      improvement: getMetric(['improvement_percentages', 'code_complexity']) !== 'NA' ? `${getMetric(['improvement_percentages', 'code_complexity'])}% reduction` : 'NA',
    },
    {
      icon: HardDrive,
      iconColor: 'text-orange-500',
      value: 'NA', // No I/O Operations in backend response
      label: 'I/O Operations',
      improvement: 'NA',
    },
  ];

  // Data for right side (Performance Analysis)
  const rightMetrics = [
    {
      label: 'Execution Time',
      before: getMetric(['execution_time', 'original']) !== 'NA' && getMetric(['execution_time', 'optimized']) !== 'NA' ? `${getMetric(['execution_time', 'original'])}s → ${getMetric(['execution_time', 'optimized'])}s` : 'NA',
      original: getMetric(['execution_time', 'original']),
      optimized: getMetric(['execution_time', 'optimized']),
      barColor: 'bg-blue-500',
      unit: 's',
    },
    {
      label: 'Memory Usage',
      before: getMetric(['memory_usage', 'original']) !== 'NA' && getMetric(['memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['memory_usage', 'original'])}MB → ${getMetric(['memory_usage', 'optimized'])}MB` : 'NA',
      original: getMetric(['memory_usage', 'original']),
      optimized: getMetric(['memory_usage', 'optimized']),
      barColor: 'bg-green-500',
      unit: 'MB',
    },
    {
      label: 'CPU Utilization',
      before: getMetric(['code_complexity', 'original']) !== 'NA' && getMetric(['code_complexity', 'optimized']) !== 'NA' ? `${Math.round(getMetric(['code_complexity', 'original']) * 100)}% → ${Math.round(getMetric(['code_complexity', 'optimized']) * 100)}%` : 'NA',
      original: getMetric(['code_complexity', 'original']) !== 'NA' ? Math.round(getMetric(['code_complexity', 'original']) * 100) : 'NA',
      optimized: getMetric(['code_complexity', 'optimized']) !== 'NA' ? Math.round(getMetric(['code_complexity', 'optimized']) * 100) : 'NA',
      barColor: 'bg-purple-500',
      unit: '%',
    },
    {
      label: 'I/O Operations',
      before: 'NA',
      original: 'NA',
      optimized: 'NA',
      barColor: 'bg-orange-500',
      unit: '',
    },
  ];

  // Helper to calculate width percentage for the filled bar
  const getBarWidth = (original: any, optimized: any) => {
    if (typeof original === 'number' && typeof optimized === 'number' && original > 0) {
      return `${(optimized / original) * 100}%`;
    }
    return '0%';
  };

  // Helper to get the difference label
  const getDiffLabel = (original: any, optimized: any, unit: string) => {
    if (typeof original === 'number' && typeof optimized === 'number') {
      const diff = original - optimized;
      const sign = diff > 0 ? '-' : diff < 0 ? '+' : '';
      return `${sign}${Math.abs(diff)}${unit}`;
    }
    return 'NA';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Performance Gains Achieved */}
      <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full min-h-[340px]">
        <h3 className="font-semibold text-white mb-4 flex items-center">
          <Zap className="w-4 h-4 text-yellow-400 mr-2" />
          Performance Gains Achieved
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {leftMetrics.map((metric, idx) => (
            <div className="text-center flex flex-col justify-center items-center h-full" key={idx}>
              <metric.icon className={`w-6 h-6 ${metric.iconColor} mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white/90">{metric.value}</div>
              <div className="text-xs text-white/70">{metric.label}</div>
              <div className="text-xs text-emerald-400/90">{metric.improvement}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Right: Performance Analysis */}
      <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full min-h-[340px]">
        <h3 className="font-semibold text-white mb-4">Performance Analysis</h3>
        <div className="space-y-5 flex-1 flex flex-col justify-center">
          {rightMetrics.map((metric, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-white/80">{metric.label}</span>
                <span className="text-sm text-white/60">{metric.before}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-6 relative overflow-hidden">
                {/* Filled part: optimized value */}
                <div
                  className={`${metric.barColor} h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500 absolute top-0 left-0`}
                  style={{ width: getBarWidth(metric.original, metric.optimized), zIndex: 2 }}
                >
                  <span className="text-xs text-white font-medium">
                    {getDiffLabel(metric.original, metric.optimized, metric.unit)}
                  </span>
                </div>
                {/* Transparent part: original value (background) */}
                <div className="h-6" style={{ width: '100%', opacity: 0 }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis; 