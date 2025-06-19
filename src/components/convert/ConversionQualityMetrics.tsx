import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from 'lucide-react';
import { useCode } from '@/hooks/use-code';
import type { ConversionQuality } from '@/types/api';

interface ConversionQualityMetricsProps {
  conversionQuality: ConversionQuality;
}

const ConversionQualityMetrics: React.FC<ConversionQualityMetricsProps> = ({ conversionQuality }) => {
  // Map conversion quality status to UI metrics
  const metrics = [
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2" />,
      label: "Syntax Conversion",
      status: conversionQuality.syntax_conversion_status.charAt(0).toUpperCase() + 
              conversionQuality.syntax_conversion_status.slice(1),
      statusColor: conversionQuality.syntax_conversion_status === 'complete' ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2" />,
      label: "Logic Preservation",
      status: conversionQuality.logic_preservation_status === 'verified' ? 'Verified' : 'Not Verified',
      statusColor: conversionQuality.logic_preservation_status === 'verified' ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2" />,
      label: "Data Type Mapping",
      status: "Optimized",
      statusColor: "text-green-600"
    },
    {
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />,
      label: "Manual Review",
      status: "Recommended",
      statusColor: "text-yellow-600"
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white/90">Conversion Quality</CardTitle>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-white/70">Success Rate:</span>
            <span className="font-bold text-green-400">{conversionQuality.success_rate}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {metric.icon}
                <span className="text-sm text-white/80">{metric.label}</span>
              </div>
              <span className={`text-sm ${metric.statusColor}`}>{metric.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionQualityMetrics; 