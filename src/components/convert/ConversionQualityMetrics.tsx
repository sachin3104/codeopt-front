import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertTriangle } from 'lucide-react';
import type { ConversionQualityData } from '@/types/api';

interface ConversionQualityMetricsProps {
  conversionQuality: ConversionQualityData | undefined;
}

const ConversionQualityMetrics: React.FC<ConversionQualityMetricsProps> = ({ conversionQuality }) => {
  // Map conversion quality status to UI metrics
  const metrics = [
    {
      icon: <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-green-500 mr-1.5 xs:mr-2" />,
      label: "Syntax Conversion",
      status: conversionQuality?.metrics?.syntax_conversion?.status || 'NA',
      statusColor: conversionQuality?.metrics?.syntax_conversion?.status === 'Complete' ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-green-500 mr-1.5 xs:mr-2" />,
      label: "Logic Preservation",
      status: conversionQuality?.metrics?.logic_preservation?.status || 'NA',
      statusColor: conversionQuality?.metrics?.logic_preservation?.status === 'Verified' ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 text-green-500 mr-1.5 xs:mr-2" />,
      label: "Data Type Mapping",
      status: conversionQuality?.metrics?.data_type_mapping?.status || 'NA',
      statusColor: conversionQuality?.metrics?.data_type_mapping?.status === 'Optimized' ? 'text-green-600' : 'text-yellow-600'
    },
    {
      icon: <AlertTriangle className="w-3 h-3 xs:w-4 xs:h-4 text-yellow-500 mr-1.5 xs:mr-2" />,
      label: "Manual Review",
      status: conversionQuality?.metrics?.manual_review?.status || 'NA',
      statusColor: conversionQuality?.metrics?.manual_review?.status === 'Recommended' ? 'text-yellow-600' : 'text-red-600'
    }
  ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader className="p-3 xs:p-4 sm:p-4 md:p-6">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
          <CardTitle className="text-base xs:text-lg sm:text-lg text-white/90">Conversion Quality</CardTitle>
          <div className="flex items-center space-x-2 text-xs xs:text-sm">
            <span className="text-white/70">Success Rate:</span>
            <span className="font-bold text-green-400">{conversionQuality?.success_rate || 'NA'}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 xs:p-4 sm:p-4 md:p-6">
        <div className="space-y-2 xs:space-y-3 sm:space-y-3">
          {metrics.map((metric, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                {metric.icon}
                <span className="text-xs xs:text-sm text-white/80">{metric.label}</span>
              </div>
              <span className={`text-xs xs:text-sm ${metric.statusColor}`}>{metric.status}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionQualityMetrics; 