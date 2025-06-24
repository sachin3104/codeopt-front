import React from 'react';
import { Clock, Database, Cpu, HardDrive, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';

const PerformanceGains: React.FC = () => {
  const { result: optimizationResult } = useOptimize();

  if (!optimizationResult) {
    return null;
  }

  // Helper to get metric values or fallback to 'NA'
  const getMetric = (path: string[], fallback = 'NA') => {
    try {
      const value = path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), optimizationResult);
      if (typeof value === 'number') {
        return Math.round(value);
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
        change: Math.round(Math.abs(change)),
        percentageChange: Math.round(Math.abs(percentageChange)),
        isImprovement,
        direction: isImprovement ? 'decreased' : 'increased',
        sign: isImprovement ? '-' : '+'
      };
    }
    return null;
  };

  // Data for Performance Gains Achieved
  const metrics = [
    {
      icon: Clock,
      iconColor: 'text-blue-500',
      value: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized'])}s` : 'NA',
      label: 'Execution Time',
      original: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']),
      unit: 's',
      isLowerBetter: true,
    },
    {
      icon: Database,
      iconColor: 'text-green-500',
      value: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized'])}MB` : 'NA',
      label: 'Memory Usage',
      original: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']),
      unit: 'MB',
      isLowerBetter: true,
    },
    {
      icon: Cpu,
      iconColor: 'text-purple-500',
      value: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? `${Math.round(getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100)}%` : 'NA',
      label: 'CPU Utilization',
      original: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) * 100) : 'NA',
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100) : 'NA',
      unit: '%',
      isLowerBetter: true,
    },
    {
      icon: HardDrive,
      iconColor: 'text-orange-500',
      value: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized'])}` : 'NA',
      label: 'I/O Operations',
      original: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']),
      unit: '',
      isLowerBetter: true,
    },
  ];

  return (
    <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6">
      <h3 className="font-semibold text-white mb-6 flex items-center">
        <Zap className="w-4 h-4 text-yellow-400 mr-2" />
        Performance Gains Achieved
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, idx) => {
          const changeInfo = getChangeInfo(metric.original, metric.optimized, metric.unit, metric.isLowerBetter);
          return (
            <div className="text-center flex flex-col justify-center items-center p-3" key={idx}>
              <metric.icon className={`w-5 h-5 ${metric.iconColor} mx-auto mb-2`} />
              <div className="text-xl font-bold text-white/90 mb-1">{metric.value}</div>
              <div className="text-xs text-white/70 mb-1">{metric.label}</div>
              {changeInfo ? (
                <div className="text-xs flex items-center gap-1">
                  {changeInfo.isImprovement ? (
                    <TrendingDown className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <TrendingUp className="w-3 h-3 text-red-400" />
                  )}
                  <span className={changeInfo.isImprovement ? 'text-emerald-400/90' : 'text-red-400/90'}>
                    {changeInfo.sign}{changeInfo.percentageChange}%
                  </span>
                </div>
              ) : (
                <div className="text-xs text-white/50">NA</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceGains; 