import React, { useState, useEffect, useMemo } from 'react';
import { Lock, AlertCircle, ArrowUpRight, X } from 'lucide-react';
import { 
  useSubscriptionData,
  useUsageData,
  useSubscription // Only for methods
} from '@/context/SubscriptionContext';
import { cn } from '@/lib/utils';

interface FeatureGateProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
  showWarning?: boolean;
  warningThreshold?: number;
  className?: string;
}

type AccessLevel = 'free' | 'developer' | 'professional';

interface FeatureConfig {
  name: string;
  description: string;
  requiredPlan: AccessLevel;
  usageLimit?: number;
  warningThreshold?: number;
}

const FEATURE_CONFIGS: Record<string, FeatureConfig> = {
  'basic-analysis': {
    name: 'Basic Analysis',
    description: 'Standard code analysis features',
    requiredPlan: 'free',
  },
  'advanced-analysis': {
    name: 'Advanced Analysis',
    description: 'Deep code analysis and optimization',
    requiredPlan: 'developer',
    usageLimit: 100,
    warningThreshold: 80,
  },
  'document-processing': {
    name: 'Document Processing',
    description: 'Process and analyze documentation',
    requiredPlan: 'developer',
    usageLimit: 50,
    warningThreshold: 40,
  },
  'custom-rules': {
    name: 'Custom Rules',
    description: 'Define custom analysis rules',
    requiredPlan: 'professional',
    usageLimit: 200,
    warningThreshold: 180,
  },
  'api-access': {
    name: 'API Access',
    description: 'Programmatic access to analysis features',
    requiredPlan: 'developer',
    usageLimit: 1000,
    warningThreshold: 800,
  },
};

const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  feature,
  fallback,
  showWarning = true,
  warningThreshold = 80,
  className,
}) => {
  // ✅ FIXED: Use selective hooks instead of full useSubscriptionHook
  const subscription = useSubscriptionData();
  const usage = useUsageData();
  const { 
    hasFeatureAccess,
    hasExceededLimits,
    shouldRecommendUpgrade 
  } = useSubscription(); // Only get methods

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showWarningBanner, setShowWarningBanner] = useState(false);
  const [warningDismissed, setWarningDismissed] = useState(false);

  // ✅ FIXED: Memoize derived values to prevent unnecessary recalculations
  const featureConfig = useMemo(() => FEATURE_CONFIGS[feature], [feature]);
  const hasAccess = useMemo(() => hasFeatureAccess(feature), [hasFeatureAccess, feature]);
  const limits = useMemo(() => hasExceededLimits(), [hasExceededLimits]);
  const recommendation = useMemo(() => shouldRecommendUpgrade(), [shouldRecommendUpgrade]);

  // ✅ FIXED: Memoize warning calculation to prevent excessive recalculations
  const shouldShowWarning = useMemo(() => {
    if (!showWarning || !hasAccess || warningDismissed || !featureConfig || !usage) {
      return false;
    }

    const usageLimit = featureConfig.usageLimit;
    const threshold = featureConfig.warningThreshold || warningThreshold;

    if (usageLimit) {
      const currentUsage = usage.daily.usage_count || 0;
      const usagePercentage = (currentUsage / usageLimit) * 100;
      return usagePercentage >= threshold;
    }

    return false;
  }, [showWarning, hasAccess, warningDismissed, featureConfig, usage?.daily.usage_count, warningThreshold]);

  // ✅ FIXED: Simplified useEffect with stable dependencies
  useEffect(() => {
    setShowWarningBanner(shouldShowWarning);
  }, [shouldShowWarning]); // Only depend on the memoized boolean

  // Handle warning dismissal
  const handleDismissWarning = () => {
    setWarningDismissed(true);
    setShowWarningBanner(false);
  };

  // Get upgrade message based on current plan
  const getUpgradeMessage = () => {
    if (!subscription) return 'Upgrade to access this feature';

    switch (subscription.plan.plan_type) {
      case 'free':
        return 'Upgrade to Developer plan to access this feature';
      case 'developer':
        return 'Upgrade to Professional plan for unlimited access';
      default:
        return 'Contact support for access';
    }
  };

  // ✅ FIXED: Memoize warning message to prevent recalculation
  const warningMessage = useMemo(() => {
    if (!featureConfig?.usageLimit || !usage) return null;

    const currentUsage = usage.daily.usage_count || 0;
    const remaining = featureConfig.usageLimit - currentUsage;
    const percentage = (currentUsage / featureConfig.usageLimit) * 100;

    if (percentage >= 100) {
      return `You've reached your daily limit for ${featureConfig.name}. Upgrade to continue using this feature.`;
    }

    return `You've used ${percentage.toFixed(0)}% of your daily ${featureConfig.name} limit. ${remaining} uses remaining.`;
  }, [featureConfig, usage?.daily.usage_count]);

  // Render warning banner
  const renderWarningBanner = () => {
    if (!showWarningBanner || !warningMessage) return null;

    return (
      <div className="mb-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
            <div>
              <p className="text-sm text-white/80">{warningMessage}</p>
              {recommendation.recommended && (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="mt-2 flex items-center space-x-1 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <span>Upgrade to {recommendation.suggestedPlan} plan</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <button
            onClick={handleDismissWarning}
            className="p-1 text-white/40 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Render fallback content
  const renderFallback = () => {
    if (fallback) return fallback;

    return (
      <div className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-4">
          <Lock className="w-6 h-6 text-white/40" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">
          {featureConfig?.name || 'Premium Feature'}
        </h3>
        <p className="text-sm text-white/60 mb-4">
          {featureConfig?.description || 'This feature requires a premium plan.'}
        </p>
        <button
          onClick={() => setShowUpgradeModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
        >
          <span>{getUpgradeMessage()}</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    );
  };

  return (
    <div className={cn('relative', className)}>
      {/* Warning Banner */}
      {renderWarningBanner()}

      {/* Feature Content */}
      {hasAccess ? (
        children
      ) : (
        <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg">
          {renderFallback()}
        </div>
      )}
    </div>
  );
};

export default FeatureGate;