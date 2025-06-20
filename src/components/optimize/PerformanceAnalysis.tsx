import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Database, Cpu, HardDrive, Zap, TrendingUp, TrendingDown } from 'lucide-react';
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

  // Data for left side (Performance Gains Achieved)
  const leftMetrics = [
    {
      icon: Clock,
      iconColor: 'text-blue-500',
      value: getMetric(['execution_time', 'optimized']) !== 'NA' ? `${getMetric(['execution_time', 'optimized'])}s` : 'NA',
      label: 'Execution Time',
      original: getMetric(['execution_time', 'original']),
      optimized: getMetric(['execution_time', 'optimized']),
      unit: 's',
      isLowerBetter: true,
    },
    {
      icon: Database,
      iconColor: 'text-green-500',
      value: getMetric(['memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['memory_usage', 'optimized'])}MB` : 'NA',
      label: 'Memory Usage',
      original: getMetric(['memory_usage', 'original']),
      optimized: getMetric(['memory_usage', 'optimized']),
      unit: 'MB',
      isLowerBetter: true,
    },
    {
      icon: Cpu,
      iconColor: 'text-purple-500',
      value: getMetric(['code_complexity', 'optimized']) !== 'NA' ? `${(getMetric(['code_complexity', 'optimized']) * 100).toFixed(2)}%` : 'NA',
      label: 'CPU Utilization',
      original: getMetric(['code_complexity', 'original']) !== 'NA' ? (getMetric(['code_complexity', 'original']) * 100) : 'NA',
      optimized: getMetric(['code_complexity', 'optimized']) !== 'NA' ? (getMetric(['code_complexity', 'optimized']) * 100) : 'NA',
      unit: '%',
      isLowerBetter: true,
    },
    {
      icon: HardDrive,
      iconColor: 'text-orange-500',
      value: 'NA',
      label: 'I/O Operations',
      original: 'NA',
      optimized: 'NA',
      unit: '',
      isLowerBetter: true,
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
      isLowerBetter: true,
    },
    {
      label: 'Memory Usage',
      before: getMetric(['memory_usage', 'original']) !== 'NA' && getMetric(['memory_usage', 'optimized']) !== 'NA' ? `${getMetric(['memory_usage', 'original'])}MB → ${getMetric(['memory_usage', 'optimized'])}MB` : 'NA',
      original: getMetric(['memory_usage', 'original']),
      optimized: getMetric(['memory_usage', 'optimized']),
      barColor: 'bg-green-500',
      unit: 'MB',
      isLowerBetter: true,
    },
    {
      label: 'CPU Utilization',
      before: getMetric(['code_complexity', 'original']) !== 'NA' && getMetric(['code_complexity', 'optimized']) !== 'NA' ? `${(getMetric(['code_complexity', 'original']) * 100).toFixed(2)}% → ${(getMetric(['code_complexity', 'optimized']) * 100).toFixed(2)}%` : 'NA',
      original: getMetric(['code_complexity', 'original']) !== 'NA' ? (getMetric(['code_complexity', 'original']) * 100) : 'NA',
      optimized: getMetric(['code_complexity', 'optimized']) !== 'NA' ? (getMetric(['code_complexity', 'optimized']) * 100) : 'NA',
      barColor: 'bg-purple-500',
      unit: '%',
      isLowerBetter: true,
    },
    {
      label: 'I/O Operations',
      before: 'NA',
      original: 'NA',
      optimized: 'NA',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Performance Gains Achieved */}
      <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full min-h-[340px]">
        <h3 className="font-semibold text-white mb-4 flex items-center">
          <Zap className="w-4 h-4 text-yellow-400 mr-2" />
          Performance Gains Achieved
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
          {leftMetrics.map((metric, idx) => {
            const changeInfo = getChangeInfo(metric.original, metric.optimized, metric.unit, metric.isLowerBetter);
            return (
              <div className="text-center flex flex-col justify-center items-center h-full" key={idx}>
                <metric.icon className={`w-6 h-6 ${metric.iconColor} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white/90">{metric.value}</div>
                <div className="text-xs text-white/70">{metric.label}</div>
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
      {/* Right: Performance Analysis */}
      <div className="bg-black/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col justify-between h-full min-h-[340px]">
        <h3 className="font-semibold text-white mb-4">Performance Analysis</h3>
        <div className="space-y-5 flex-1 flex flex-col justify-center">
          {rightMetrics.map((metric, idx) => {
            const changeInfo = getChangeInfo(metric.original, metric.optimized, metric.unit, metric.isLowerBetter);
            const barWidth = getBarWidth(metric.original, metric.optimized);
            const isImprovement = changeInfo?.isImprovement ?? false;
            
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-white/80">{metric.label}</span>
                  <span className="text-sm text-white/60">{metric.before}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-6 relative overflow-hidden">
                  {/* Filled part: optimized value */}
                  <div
                    className={`${metric.barColor} h-6 rounded-full transition-all duration-500 absolute top-0 left-0`}
                    style={{ width: barWidth, zIndex: 2 }}
                  >
                    {/* Show text inside filled bar only for improvements */}
                    {isImprovement && changeInfo && (
                      <div className="flex items-center justify-end pr-2 h-full">
                        <span className="text-xs text-white font-medium flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          {getDiffLabel(metric.original, metric.optimized, metric.unit, metric.isLowerBetter)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Show text at the end of bar for increases or when bar is too narrow */}
                  {(!isImprovement || parseFloat(barWidth) < 30) && changeInfo && (
                    <div className="flex items-center h-full absolute top-0" 
                         style={{ 
                           left: isImprovement ? barWidth : '100%',
                           transform: isImprovement ? 'translateX(0)' : 'translateX(-100%)',
                           zIndex: 3
                         }}>
                      <span className="text-xs text-white font-medium flex items-center gap-1 px-2">
                        <TrendingUp className="w-3 h-3" />
                        {getDiffLabel(metric.original, metric.optimized, metric.unit, metric.isLowerBetter)}
                      </span>
                    </div>
                  )}
                  
                  {/* Transparent part: original value (background) */}
                  <div className="h-6" style={{ width: '100%', opacity: 0 }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis; 