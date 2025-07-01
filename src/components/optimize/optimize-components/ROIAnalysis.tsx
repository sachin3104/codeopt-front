import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Database, DollarSign, TrendingUp, Calculator } from 'lucide-react';
import { useOptimize } from '@/hooks/use-optimize';

const ROIAnalysis: React.FC = () => {
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

  // Helper to format decimal values to integers with thousand separators
  const formatDecimal = (value: any): string => {
    if (value === 'NA' || value === null || value === undefined) {
      return 'NA';
    }
    const num = parseFloat(value);
    if (isNaN(num)) {
      return 'NA';
    }
    return Math.round(num).toLocaleString();
  };

  // ROI metrics from backend only, no calculations or hardcoded labels
  const roiMetrics = [
    {
      icon: Timer,
      iconColor: 'text-blue-400/80',
      value: getMetric(['resource_savings', 'daily_time_saved_per_execution']) !== 'NA'
        ? `${formatDecimal(getMetric(['resource_savings', 'daily_time_saved_per_execution']))} min`
        : 'NA',
      label: 'Daily Time Saved',
      sublabel: 'Per execution',
      barColor: 'bg-blue-400/30'
    },
    {
      icon: Database,
      iconColor: 'text-emerald-400/80',
      value: getMetric(['resource_savings', 'memory_saved_per_run']) !== 'NA'
        ? `${formatDecimal(getMetric(['resource_savings', 'memory_saved_per_run']))} KB`
        : 'NA',
      label:  'Memory Saved',
      sublabel: 'Per run',
      barColor: 'bg-emerald-400/30'
    },
    {
      icon: DollarSign,
      iconColor: 'text-violet-400/80',
      value: getMetric(['resource_savings', 'monthly_server_cost_savings']) !== 'NA'
        ? `$${formatDecimal(getMetric(['resource_savings', 'monthly_server_cost_savings']))}`
        : 'NA',
      label: 'Monthly Savings',
      sublabel: 'Server costs',
      barColor: 'bg-violet-400/30'
    },
    {
      icon: TrendingUp,
      iconColor: 'text-amber-400/80',
      value: (() => {
        const monthlySavings = getMetric(['resource_savings', 'monthly_server_cost_savings']);
        if (monthlySavings !== 'NA') {
          const annualValue = parseFloat(monthlySavings) * 12;
          return `$${formatDecimal(annualValue)}`;
        }
        return 'NA';
      })(),
      label: 'Estimated Annual Savings',
      sublabel: 'Total ROI',
      barColor: 'bg-amber-400/30'
    }
  ];

  // Total Value from backend only
  const totalValue = (() => {
    const monthlySavings = getMetric(['resource_savings', 'monthly_server_cost_savings']);
    if (monthlySavings !== 'NA') {
      const annualValue = parseFloat(monthlySavings) * 12;
      return `$${formatDecimal(annualValue)}`;
    }
    return 'NA';
  })();

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="w-4 h-4 text-blue-400/80 mr-2" />
            Resource Savings & ROI
          </div>
          <div className="text-sm text-white/70">
            Total Value: <span className="text-emerald-400/90 font-bold">{totalValue}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {roiMetrics.map((metric, index) => (
            <div key={index} className="flex flex-col items-center p-3">
              <metric.icon className={`w-5 h-5 ${metric.iconColor} mb-2`} />
              <div className="text-xl font-bold text-white/90 mb-1">{metric.value}</div>
              <div className="text-xs text-emerald-400/90 font-semibold mb-1 text-center">{metric.label}</div>
              <div className="text-xs text-white/50">{metric.sublabel}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ROIAnalysis; 