import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package } from 'lucide-react';
import type { ConversionEnvironment } from '@/types/api';

interface ConversionDetailsProps {
  sourceLanguage: string | undefined;
  targetLanguage: string | undefined;
  environmentSetup: ConversionEnvironment | undefined;
}

const ConversionDetails: React.FC<ConversionDetailsProps> = ({
  sourceLanguage,
  targetLanguage,
  environmentSetup
}) => {
  // Parse installation commands into an array
  const installationCommands = environmentSetup?.installation_commands
    ? environmentSetup.installation_commands.split('\n').filter(cmd => cmd.trim())
    : ['NA'];

  // Use setup steps from the new structure or fallback to version compatibility
  const setupSteps = environmentSetup?.setup_steps?.length > 0
    ? environmentSetup.setup_steps
    : environmentSetup?.version_compatibility
      ? [{ 
          step: 'Version Compatibility', 
          description: environmentSetup.version_compatibility,
          command: 'NA'
        }]
      : [{ step: 'NA', description: 'NA', command: 'NA' }];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Conversion Mapping */}
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <CardTitle className="text-white/90">Conversion Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto max-h-[300px]">
            <table className="w-full text-sm">
              <thead className="bg-white/5 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white/70 uppercase">
                    {sourceLanguage || 'NA'} Feature
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white/70 uppercase">
                    {targetLanguage || 'NA'} Equivalent
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-white/70 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {setupSteps.map((step, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-white/5 px-2 py-1 rounded text-white/80">
                        {step.step === 'NA' ? 'NA' : step.step}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-blue-500/10 px-2 py-1 rounded text-blue-400">
                        {step.description === 'NA' ? 'NA' : step.description}
                      </code>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <CheckCircle className="w-4 h-4 text-green-400 mx-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Environment Setup */}
      <Card className="bg-black/10 backdrop-blur-xl border border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white/90">{targetLanguage || 'NA'} Environment Setup</CardTitle>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Installation Commands */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Installation Commands</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <pre className="text-xs font-mono text-white/70">
                  {installationCommands.map((cmd, index) => (
                    <div key={index}>{cmd}</div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Setup Steps */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Setup Steps</h4>
              <div className="space-y-3">
                {setupSteps.map((step, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white/80">{step.step}</span>
                      <span className="text-xs text-green-400">✓</span>
                    </div>
                    <p className="text-xs text-white/60 mb-2">{step.description}</p>
                    {step.command && step.command !== 'NA' && (
                      <code className="text-xs bg-white/10 px-2 py-1 rounded text-blue-400 block">
                        {step.command}
                      </code>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Version Compatibility */}
            {environmentSetup?.version_compatibility && (
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-3">Version Compatibility</h4>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-sm text-white/70">{environmentSetup.version_compatibility}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionDetails; 