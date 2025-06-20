import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package } from 'lucide-react';
import type { EnvironmentSetup } from '@/types/api';

interface ConversionDetailsProps {
  sourceLanguage: string;
  targetLanguage: string;
  environmentSetup: EnvironmentSetup;
}

const ConversionDetails: React.FC<ConversionDetailsProps> = ({
  sourceLanguage,
  targetLanguage,
  environmentSetup
}) => {
  // Parse installation commands into an array
  const installationCommands = environmentSetup?.installation_commands
    ? environmentSetup.installation_commands.split('\n').filter(cmd => cmd.trim())
    : ['N/A'];

  // Parse version compatibility into an array of objects
  const versionCompatibility = environmentSetup?.version_compatibility
    ? environmentSetup.version_compatibility
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [name, version] = line.split(':').map(s => s.trim());
          return { name: name || 'N/A', version: version || 'N/A' };
        })
    : [{ name: 'N/A', version: 'N/A' }];

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
                    {sourceLanguage || 'N/A'} Feature
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-white/70 uppercase">
                    {targetLanguage || 'N/A'} Equivalent
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-white/70 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {installationCommands.map((cmd, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-white/5 px-2 py-1 rounded text-white/80">
                        {cmd === 'N/A' ? 'N/A' : cmd.split(' ')[0]}
                      </code>
                    </td>
                    <td className="px-3 py-2">
                      <code className="text-xs bg-blue-500/10 px-2 py-1 rounded text-blue-400">
                        {cmd === 'N/A' ? 'N/A' : cmd.split(' ').slice(1).join(' ')}
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
            <CardTitle className="text-white/90">{targetLanguage || 'N/A'} Environment Setup</CardTitle>
            <Package className="w-5 h-5 text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Installation Commands */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Required Libraries</h4>
              <div className="bg-white/5 rounded-lg p-4">
                <pre className="text-xs font-mono text-white/70">
                  {installationCommands.map((cmd, index) => (
                    <div key={index}>{cmd}</div>
                  ))}
                </pre>
              </div>
            </div>

            {/* Version Compatibility */}
            <div>
              <h4 className="text-sm font-medium text-white/80 mb-3">Version Compatibility</h4>
              <div className="space-y-2">
                {versionCompatibility.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white/70">{item.name}</span>
                    <span className="font-mono text-xs bg-green-400/10 text-green-400 px-2 py-1 rounded">
                      {item.version}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConversionDetails; 