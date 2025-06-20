import React from 'react';
import { useConvert } from '@/hooks/use-convert';
import ConversionQualityMetrics from './ConversionQualityMetrics';
import ConversionAdvantages from './ConversionAdvantages';
import EstimatedBenefitsGrid from './EstimatedBenefitsGrid';
import ConversionDetails from './ConversionDetails';
import ConversionNotes from './ConversionNotes';

const ConvertTabs: React.FC = () => {
  const { result: convertedCode } = useConvert();

  if (!convertedCode) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConversionQualityMetrics conversionQuality={convertedCode.conversion?.quality} />
        <ConversionAdvantages 
          estimatedBenefits={convertedCode.conversion?.benefits}
          targetLanguage={convertedCode.conversion?.metadata?.target_language}
        />
      </div>
      <EstimatedBenefitsGrid benefits={convertedCode.conversion?.benefits} />
      <ConversionDetails 
        sourceLanguage={convertedCode.conversion?.metadata?.source_language}
        targetLanguage={convertedCode.conversion?.metadata?.target_language}
        environmentSetup={convertedCode.conversion?.environment}
      />
      <ConversionNotes 
        conversionNotes={convertedCode.conversion?.notes}
        sourceLanguage={convertedCode.conversion?.metadata?.source_language}
        targetLanguage={convertedCode.conversion?.metadata?.target_language}
      />
    </div>
  );
};

export default ConvertTabs;
