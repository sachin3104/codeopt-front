import React from 'react';
import { 
  MemoryStick, 
  Activity, 
  Zap, 
  Cpu, 
  HardDrive, 
  Database, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Code2,
  FileCode,
  Bug,
  Workflow,
  FileCheck,
  FileSearch,
  FileBarChart,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOptimize } from '@/hooks/use-optimize';

interface OptimizationDetailsData {
  highPriorityDetails: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  mediumPriorityDetails: Array<{
    title: string;
    description: string;
    icon: React.ReactNode;
  }>;
  resourceSavings: any;
}

interface OptimizationDetailsProps {
  detailsData: OptimizationDetailsData;
}

const OptimizationDetails: React.FC<OptimizationDetailsProps> = ({
  detailsData
}) => {
  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white/90 flex items-center justify-between">
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 text-amber-400/80 mr-2" />
            Optimization Details
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* High Priority Issues */}
          {detailsData.highPriorityDetails.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-red-400/90 font-medium">High Priority Improvements</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {detailsData.highPriorityDetails.map((detail, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start space-x-3">
                      {detail.icon}
                      <div>
                        <p className="font-medium text-white/90 text-sm">{detail.title}</p>
                        <p className="text-xs text-white/60">{detail.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority Issues */}
          {detailsData.mediumPriorityDetails.length > 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-orange-400/90 font-medium">Medium Priority Improvements</h4>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {detailsData.mediumPriorityDetails.map((detail, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start space-x-3">
                      {detail.icon}
                      <div>
                        <p className="font-medium text-white/90 text-sm">{detail.title}</p>
                        <p className="text-xs text-white/60">{detail.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show message if no details available */}
          {detailsData.highPriorityDetails.length === 0 && detailsData.mediumPriorityDetails.length === 0 && (
            <div className="bg-white/5 rounded-lg border border-white/10 p-4 text-center">
              <p className="text-white/60">No optimization details available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OptimizationDetails; 