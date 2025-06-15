import React, { useState } from 'react';
import {
  Check,
  X,
  ArrowUpRight,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
} from 'lucide-react';
import { useSubscriptionHook } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';

interface FeatureComparisonProps {
  className?: string;
  showTooltips?: boolean;
}

interface Feature {
  name: string;
  description: string;
  documentation?: string;
  category: 'core' | 'advanced' | 'support';
  getValue: (plan: Plan) => boolean | string | number | null;
  formatValue?: (value: any) => string;
  tooltip?: string;
}

const FeatureComparison: React.FC<FeatureComparisonProps> = ({
  className,
  showTooltips = true,
}) => {
  const {
    plans,
    currentPlan,
    getRecommendedPlan,
    canAccessFeature,
  } = useSubscriptionHook();

  const [expandedCategories, setExpandedCategories] = useState<string[]>(['core']);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const { recommended, suggestedPlan } = getRecommendedPlan();

  // Feature definitions
  const features: Feature[] = [
    // Core Features
    {
      name: 'Daily Query Limit',
      description: 'Maximum number of queries allowed per day',
      category: 'core',
      getValue: (plan) => plan.max_daily_usage,
      formatValue: (value) => (value === null ? 'Unlimited' : `${value} queries`),
      tooltip: 'Reset at midnight UTC',
    },
    {
      name: 'Monthly Query Limit',
      description: 'Maximum number of queries allowed per month',
      category: 'core',
      getValue: (plan) => plan.max_monthly_usage,
      formatValue: (value) => (value === null ? 'Unlimited' : `${value} queries`),
      tooltip: 'Reset on the 1st of each month',
    },
    {
      name: 'Character Limit',
      description: 'Maximum characters per query',
      category: 'core',
      getValue: (plan) => plan.max_code_input_chars,
      formatValue: (value) => `${value.toLocaleString()} chars`,
      tooltip: 'Includes all input text and code',
    },
    {
      name: 'Basic Analysis',
      description: 'Standard code analysis features',
      category: 'core',
      getValue: () => true,
      tooltip: 'Syntax checking, basic optimization suggestions',
    },

    // Advanced Features
    {
      name: 'Advanced Analysis',
      description: 'Deep code analysis and optimization',
      category: 'advanced',
      getValue: (plan) => plan.plan_type !== 'free',
      tooltip: 'Pattern recognition, performance optimization, security analysis',
      documentation: '/docs/advanced-analysis',
    },
    {
      name: 'Document Processing',
      description: 'Process and analyze documentation',
      category: 'advanced',
      getValue: (plan) => plan.plan_type !== 'free',
      tooltip: 'Extract insights from documentation, generate summaries',
      documentation: '/docs/document-processing',
    },
    {
      name: 'Custom Rules',
      description: 'Define custom analysis rules',
      category: 'advanced',
      getValue: (plan) => plan.plan_type === 'professional',
      tooltip: 'Create and apply custom analysis rules for your codebase',
      documentation: '/docs/custom-rules',
    },
    {
      name: 'API Access',
      description: 'Programmatic access to analysis features',
      category: 'advanced',
      getValue: (plan) => plan.plan_type !== 'free',
      tooltip: 'Integrate analysis features into your workflow',
      documentation: '/docs/api',
    },

    // Support Features
    {
      name: 'Email Support',
      description: 'Basic email support',
      category: 'support',
      getValue: () => true,
      tooltip: 'Response within 48 hours',
    },
    {
      name: 'Priority Support',
      description: 'Faster response times and dedicated support',
      category: 'support',
      getValue: (plan) => plan.plan_type === 'professional',
      tooltip: 'Response within 24 hours, dedicated support agent',
    },
    {
      name: 'Training Sessions',
      description: 'One-on-one training sessions',
      category: 'support',
      getValue: (plan) => plan.plan_type === 'professional',
      tooltip: 'Monthly training sessions with our experts',
    },
  ];

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Get feature value display
  const getFeatureDisplay = (feature: Feature, plan: Plan) => {
    const value = feature.getValue(plan);
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-400" />
      ) : (
        <X className="w-5 h-5 text-white/40" />
      );
    }
    return (
      <span className="text-sm font-medium text-white">
        {feature.formatValue ? feature.formatValue(value) : value}
      </span>
    );
  };

  // Get plan header class
  const getPlanHeaderClass = (plan: Plan) => {
    return cn(
      'sticky top-0 z-10 backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border-b border-white/20 p-4',
      {
        'border-blue-500/50': plan.id === currentPlan?.id,
        'border-green-500/50': recommended && plan.plan_type === suggestedPlan,
      }
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Plan Headers */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1" /> {/* Feature name column */}
        {plans?.map((plan) => (
          <div key={plan.id} className={getPlanHeaderClass(plan)}>
            <div className="flex flex-col items-center text-center">
              {plan.plan_type === 'professional' && (
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">Most Popular</span>
                </div>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="text-sm text-white/60 mt-1">
                {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
              </p>
              {plan.id === currentPlan?.id && (
                <span className="text-xs text-green-400 mt-1">Current Plan</span>
              )}
              {recommended && plan.plan_type === suggestedPlan && (
                <span className="text-xs text-blue-400 mt-1">Recommended</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Categories */}
      {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-2">
          {/* Category Header */}
          <button
            onClick={() => toggleCategory(category)}
            className="w-full flex items-center justify-between p-4 text-left bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <h3 className="text-lg font-medium text-white capitalize">{category}</h3>
            {expandedCategories.includes(category) ? (
              <ChevronUp className="w-5 h-5 text-white/60" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white/60" />
            )}
          </button>

          {/* Features */}
          {expandedCategories.includes(category) && (
            <div className="space-y-2">
              {categoryFeatures.map((feature) => (
                <div
                  key={feature.name}
                  className="grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg"
                  onMouseEnter={() => setHoveredFeature(feature.name)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  {/* Feature Name */}
                  <div className="col-span-1">
                    <div className="flex items-start space-x-2">
                      <div>
                        <h4 className="text-sm font-medium text-white">{feature.name}</h4>
                        <p className="text-xs text-white/60 mt-1">{feature.description}</p>
                      </div>
                      {showTooltips && (
                        <div className="relative">
                          <Info className="w-4 h-4 text-white/40" />
                          {hoveredFeature === feature.name && (
                            <div className="absolute left-0 top-6 w-64 p-2 bg-black/90 border border-white/20 rounded-lg text-xs text-white/80 z-20">
                              {feature.tooltip}
                              {feature.documentation && (
                                <a
                                  href={feature.documentation}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center space-x-1 text-blue-400 mt-1 hover:text-blue-300"
                                >
                                  <span>Learn more</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Feature Values */}
                  {plans?.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-center">
                      {getFeatureDisplay(feature, plan)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Mobile View Notice */}
      <div className="lg:hidden p-4 bg-white/5 rounded-lg">
        <p className="text-sm text-white/60 text-center">
          Scroll horizontally to view all plans
        </p>
      </div>
    </div>
  );
};

export default FeatureComparison; 