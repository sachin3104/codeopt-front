import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      iconColor: 'text-blue-400/80',
      value: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized'])}s` : 'NA',
      label: 'Execution Time',
      original: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'execution_time', 'optimized']),
      unit: 's',
      isLowerBetter: true,
    },
    {
      icon: Database,
      iconColor: 'text-emerald-400/80',
      value: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized'])}MB` : 'NA',
      label: 'Memory Usage',
      original: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'memory_usage', 'optimized']),
      unit: 'MB',
      isLowerBetter: true,
    },
    {
      icon: Cpu,
      iconColor: 'text-violet-400/80',
      value: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? `${Math.round(getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100)}%` : 'NA',
      label: 'CPU Utilization',
      original: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'original']) * 100) : 'NA',
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) !== 'NA' ? (getMetric(['performance_analysis', 'performance_metrics', 'cpu_utilization', 'optimized']) * 100) : 'NA',
      unit: '%',
      isLowerBetter: true,
    },
    {
      icon: HardDrive,
      iconColor: 'text-amber-400/80',
      value: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']) !== 'NA' ? `${getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized'])}` : 'NA',
      label: 'I/O Operations',
      original: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'original']),
      optimized: getMetric(['performance_analysis', 'performance_metrics', 'io_operations', 'optimized']),
      unit: '',
      isLowerBetter: true,
    },
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
        <CardTitle className="text-base xs:text-lg sm:text-xl font-semibold text-white/90 flex items-center">
          <Zap className="w-3 h-3 xs:w-4 xs:h-4 text-blue-400/80 mr-2" />
          Performance Gains Achieved
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-4 md:p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 sm:gap-4 md:gap-4">
          {metrics.map((metric, idx) => {
            const changeInfo = getChangeInfo(metric.original, metric.optimized, metric.unit, metric.isLowerBetter);
            return (
              <div className="text-center flex flex-col justify-center items-center p-2 xs:p-3 sm:p-3" key={idx}>
                <metric.icon className={`w-4 h-4 xs:w-5 xs:h-5 ${metric.iconColor} mx-auto mb-1 xs:mb-2 sm:mb-2`} />
                <div className="text-lg xs:text-xl sm:text-xl font-bold text-white/90 mb-1">{metric.value}</div>
                <div className="text-xs text-white/70 mb-1">{metric.label}</div>
                {changeInfo ? (
                  <div className="text-xs flex items-center gap-1">
                    {changeInfo.isImprovement ? (
                      <TrendingDown className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-emerald-400" />
                    ) : (
                      <TrendingUp className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-red-400" />
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
      </CardContent>
    </Card>
  );
};

export default PerformanceGains; 