import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap } from 'lucide-react';
import type { ConversionBenefits } from '@/types/api';

interface ConversionAdvantagesProps {
  estimatedBenefits: ConversionBenefits | undefined;
  targetLanguage: string | undefined;
}

const ConversionAdvantages: React.FC<ConversionAdvantagesProps> = ({ 
  estimatedBenefits,
  targetLanguage 
}) => {
  // Use advantages from the new structure or fallback to default ones
  const advantages = estimatedBenefits?.advantages?.length > 0 
    ? estimatedBenefits.advantages.map(adv => ({
        icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />,
        text: adv.text
      }))
    : [
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />,
          text: `${estimatedBenefits?.processing_speed_improvement || 'NA'} faster execution with optimized operations`
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />,
          text: `${estimatedBenefits?.memory_usage_reduction || 'NA'} memory usage with efficient data structures`
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />,
          text: `${estimatedBenefits?.license_cost_savings || 'NA'} cost savings with open-source ecosystem`
        },
        {
          icon: <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />,
          text: `${estimatedBenefits?.cloud_readiness || 'NA'} cloud-ready with modern deployment options`
        }
      ];

  return (
    <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <div className="flex items-center">
          <Zap className="w-4 h-4 text-yellow-500 mr-2" />
          <CardTitle className="text-white/90">{targetLanguage || 'NA'} Advantages</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white/5 rounded-lg p-4">
          <ul className="space-y-2">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex items-start">
                {advantage.icon}
                <span className="text-sm text-white/80">{advantage.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversionAdvantages; 