import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { EstimatedBenefits } from '@/types/api';
import { Zap, Cpu, HardDrive, DollarSign, Cloud } from 'lucide-react';

interface EstimatedBenefitsGridProps {
  benefits: EstimatedBenefits;
}

const EstimatedBenefitsGrid: React.FC<EstimatedBenefitsGridProps> = ({ benefits }) => {
  const metrics = [
    {
      value: benefits.processing_speed_improvement,
      label: "Faster Processing",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      icon: <Cpu className="w-5 h-5 text-green-400" />
    },
    {
      value: benefits.memory_usage_reduction,
      label: "Less Memory",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      icon: <HardDrive className="w-5 h-5 text-green-400" />
    },
    {
      value: benefits.license_cost_savings,
      label: "License Cost",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      icon: <DollarSign className="w-5 h-5 text-blue-400" />
    },
    {
      value: benefits.cloud_readiness,
      label: "Cloud Ready",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      icon: <Cloud className="w-5 h-5 text-purple-400" />
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-white/90">Estimated Benefits</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div 
              key={index} 
              className={`${metric.bgColor} rounded-lg p-4 border border-white/10 backdrop-blur-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                {metric.icon}
                <span className="text-sm font-medium text-white/80">
                  {metric.label}
                </span>
              </div>
              <div className={`text-3xl font-bold ${metric.color}`}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimatedBenefitsGrid; 