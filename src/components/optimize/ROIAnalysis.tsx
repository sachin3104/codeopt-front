import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Database, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useCode } from '@/context/CodeContext';

const ROIAnalysis: React.FC = () => {
  const { optimizationResult } = useCode();

  if (!optimizationResult) {
    return null;
  }

  // Calculate ROI metrics based on optimization results
  const roiMetrics = [
    {
      icon: Timer,
      iconColor: 'text-blue-400/80',
      value: `${Math.round(optimizationResult.metrics.executionTime.value * 0.15)}min`,
      label: 'Daily Time Saved',
      sublabel: 'Per execution',
      barColor: 'bg-blue-400/30'
    },
    {
      icon: Database,
      iconColor: 'text-emerald-400/80',
      value: `${Math.round(optimizationResult.metrics.memoryUsage.value * 0.3)}MB`,
      label: 'Memory Saved',
      sublabel: 'Per run',
      barColor: 'bg-emerald-400/30'
    },
    {
      icon: DollarSign,
      iconColor: 'text-violet-400/80',
      value: `$${Math.round(optimizationResult.improvement_percentages?.execution_time || 0) * 2}`,
      label: 'Monthly Savings',
      sublabel: 'Server costs',
      barColor: 'bg-violet-400/30'
    },
    {
      icon: TrendingUp,
      iconColor: 'text-amber-400/80',
      value: `$${Math.round((optimizationResult.improvement_percentages?.execution_time || 0) * 24)}K`,
      label: 'Annual Value',
      sublabel: 'Total ROI',
      barColor: 'bg-amber-400/30'
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-4 h-4 text-amber-400/80 mr-2" />
            Resource Savings & ROI
          </div>
          <div className="text-sm text-white/70">
            Total Value: <span className="text-emerald-400/90 font-bold">${Math.round((optimizationResult.improvement_percentages?.execution_time || 0) * 24)}K</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-6">
          {roiMetrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="text-center">
                <metric.icon className={`w-6 h-6 ${metric.iconColor} mx-auto mb-2`} />
                <div className="text-2xl font-bold text-white/90">{metric.value}</div>
                <div className="text-xs text-white/60">{metric.label}</div>
                <div className="text-xs text-white/50">{metric.sublabel}</div>
              </div>
              
              <div className="mt-4">
                <div className="w-full bg-white/5 rounded-full h-2">
                  <div 
                    className={`${metric.barColor} h-2 rounded-full backdrop-blur-sm`} 
                    style={{ width: '100%' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIAnalysis; 