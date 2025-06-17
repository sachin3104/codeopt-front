import React from 'react';
import { useCode } from '@/context/CodeContext';
import ConversionQualityMetrics from './ConversionQualityMetrics';
import ConversionAdvantages from './ConversionAdvantages';
import EstimatedBenefitsGrid from './EstimatedBenefitsGrid';
import ConversionDetails from './ConversionDetails';
import ConversionNotes from './ConversionNotes';

const ConvertTabs: React.FC = () => {
  const { convertedCode } = useCode();

  if (!convertedCode) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConversionQualityMetrics conversionQuality={convertedCode.conversion_quality} />
        <ConversionAdvantages 
          estimatedBenefits={convertedCode.estimated_benefits}
          targetLanguage={convertedCode.target_language}
        />
      </div>
      <EstimatedBenefitsGrid benefits={convertedCode.estimated_benefits} />
      <ConversionDetails 
        sourceLanguage={convertedCode.source_language}
        targetLanguage={convertedCode.target_language}
        environmentSetup={convertedCode.environment_setup}
      />
      <ConversionNotes 
        conversionNotes={convertedCode.conversion_notes}
        sourceLanguage={convertedCode.source_language}
        targetLanguage={convertedCode.target_language}
      />
    </div>
  );
};

export default ConvertTabs;
