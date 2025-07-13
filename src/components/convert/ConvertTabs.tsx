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
    <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6 lg:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4 sm:gap-4 md:gap-6 lg:gap-6">
        <ConversionQualityMetrics conversionQuality={convertedCode.conversion?.quality} />
        <ConversionAdvantages 
          estimatedBenefits={convertedCode.conversion?.benefits}
          targetLanguage={convertedCode.conversion?.metadata?.target_language}
        />
      </div>
      <div className="space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-6 lg:space-y-6">
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
    </div>
  );
};

export default ConvertTabs;
