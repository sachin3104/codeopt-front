import React from 'react';
import { useOptimize } from '@/hooks/use-optimize';

const PerformanceAnalysis: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Helper to get metric values or fallback to 'NA'
  const getMetric = (path: string[], fallback = 'NA') => {
    try {
      const value = path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), optimizationResult);
      if (typeof value === 'number') {
        return Number(value.toFixed(2));
      }
      return value ?? fallback;
    } catch {
      return fallback;
    }
  };

  // Helper to calculate change and direction
  const getChangeInfo = (original: any, optimized: any, unit: string, isLowerBetter = true) => {
    if (typeof original === 'number' && typeof optimized === 'number' && original > 0) {
      const change = original - optimized;
      const percentageChange = (change / original) * 100;
      const isImprovement = isLowerBetter ? change > 0 : change < 0;
      
      return {
        change: Math.abs(change).toFixed(2),
        percentageChange: Math.abs(percentageChange).toFixed(2),
        isImprovement,
        direction: isImprovement ? 'decreased' : 'increased',
        sign: isImprovement ? '-' : '+'
      };
    }
    return null;
  };

  // Data for Performance Analysis
  const metrics = [
    {
      label: 'Execution Time',
      before: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'original']) !== 'NA' && getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'original'])}s → ${getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized'])}s` : 'NA',
      original: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']),
      barColor: 'bg-blue-500',
      unit: 's',
      isLowerBetter: true,
    },
    {
      label: 'Memory Usage',
      before: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'original']) !== 'NA' && getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'original'])}MB → ${getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized'])}MB` : 'NA',
      original: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']),
      barColor: 'bg-green-500',
      unit: 'MB',
      isLowerBetter: true,
    },
    {
      label: 'CPU Utilization',
      before: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) !== 'NA' && getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? `${(getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) * 100).toFixed(2)}% → ${(getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100).toFixed(2)}%` : 'NA',
      original: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) * 100) : 'NA',
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100) : 'NA',
      barColor: 'bg-purple-500',
      unit: '%',
      isLowerBetter: true,
    },
    {
      label: 'I/O Operations',
      before: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'original']) !== 'NA' && getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'original'])} → ${getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized'])}` : 'NA',
      original: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']),
      barColor: 'bg-orange-500',
      unit: '',
      isLowerBetter: true,
    },
  ];

  // Helper to calculate width percentage for the filled bar
  const getBarWidth = (original: any, optimized: any) => {
    if (typeof original === 'number' && typeof optimized === 'number' && original > 0) {
      return `${(optimized / original) * 100}%`;
    }
    return '0%';
  };

  // Helper to get the difference label with direction
  const getDiffLabel = (original: any, optimized: any, unit: string, isLowerBetter = true) => {
    const changeInfo = getChangeInfo(original, optimized, unit, isLowerBetter);
    if (changeInfo) {
      return `${changeInfo.sign}${changeInfo.percentageChange}%`;
    }
    return 'NA';
  };

  return (
    <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full min-h-[340px]">
      <h3 className="font-semibold text-white mb-4">Performance Analysis</h3>
      <div className="space-y-5 flex-1 flex flex-col justify-center">
        {metrics.map((metric, idx) => {
          const changeInfo = getChangeInfo(metric.original, metric.optimized, metric.unit, metric.isLowerBetter);
          const barWidth = getBarWidth(metric.original, metric.optimized);
          const isImprovement = changeInfo?.isImprovement ?? false;
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80 font-medium">{metric.label}</span>
                <span className="text-xs text-white/60">{metric.before}</span>
              </div>
              <div className="relative bg-white/10 rounded-full h-2">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${metric.barColor}`}
                  style={{ width: barWidth }}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={`font-medium ${isImprovement ? 'text-emerald-400/90' : 'text-red-400/90'}`}>
                  {getDiffLabel(metric.original, metric.optimized, metric.unit, metric.isLowerBetter)}
                </span>
                <span className="text-white/60">
                  {typeof metric.optimized === 'number' ? `${metric.optimized}${metric.unit}` : 'NA'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceAnalysis; 