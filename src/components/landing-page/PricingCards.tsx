import React from "react";
import { Check, Star, Zap, Crown, TrendingUp } from "lucide-react";
import clsx from "clsx";

const pricingPlans = [
  {
    name: "Free Plan",
    price: 0,
    originalPrice: null,
    period: "forever",
    icon: Star,
    description: "Perfect for trying out our AI optimization",
    highlight: "Start Free Today",
    features: [
      "5 requests per day",
      "300 lines of code per request",
      "Basic AI optimization",
      "Email support",
      "Community access"
    ],
    limitations: [
      "Limited daily usage",
      "Basic optimization only"
    ],
    buttonText: "Start Free Now",
    buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/20 hover:border-white/40",
    popular: false,
    savings: null
  },
  {
    name: "Developer Plan",
    price: 9.99,
    originalPrice: 19.99,
    period: "per month",
    icon: Zap,
    description: "Most popular choice for serious developers",
    highlight: "50% OFF - Limited Time",
    features: [
      "50 requests per month",
      "800 lines of code per request",
      "Advanced AI optimization",
      "Priority support",
      "Code analysis reports",
      "Multi-language support",
      "Performance insights",
     
    ],
    limitations: [],
    buttonText: "Get Developer Plan",
    buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/20 hover:border-white/40",
    popular: true,
    savings: "Save $120/year"
  },
  {
    name: "Professional Plan", 
    price: 30,
    originalPrice: null,
    period: "per month",
    icon: Crown,
    description: "For teams and enterprises scaling fast",
    highlight: "Best Value for Teams",
    features: [
      "Unlimited requests per month",
      "1000 lines of code per request", 
      "Premium AI optimization engine",
      "24/7 priority support",
      "Code analysis reports",
      "Multi-language support",
      "Performance insights",
    ],
    limitations: [],
    buttonText: "Go Professional",
    buttonStyle: "bg-white/20 hover:bg-white/30 text-white border border-white/20 hover:border-white/40",
    popular: false,
    savings: null
  }
];

export default function PricingCards() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          
          <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4">
            Choose Your Plan
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Transform your code performance in minutes. Start free, upgrade anytime.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => {
            const IconComponent = plan.icon;
            
            return (
              <div
                key={plan.name}
                className={clsx(
                  "relative group",
                  plan.popular && "lg:scale-105 lg:-mt-4 lg:mb-4"
                )}
              >
                

                {/* Savings Badge */}
                {plan.savings && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      {plan.savings}
                    </div>
                  </div>
                )}

                {/* Card */}
                <div className={clsx(
                  "relative h-full backdrop-blur-md bg-black/30 border rounded-3xl p-8 transition-all duration-300 hover:bg-black/40 group-hover:scale-[1.02]",
                  plan.popular 
                    ? "border-blue-400/50 shadow-2xl shadow-blue-500/20" 
                    : "border-white/10 hover:border-white/20"
                )}>
                  
                  {/* Card Header */}
                  <div className="text-center mb-8">
                    <div className={clsx(
                      "inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-all duration-300",
                      plan.popular 
                        ? "bg-gradient-to-br from-blue-500/20 to-purple-600/20 group-hover:from-blue-500/30 group-hover:to-purple-600/30" 
                        : "bg-white/10 group-hover:bg-white/20"
                    )}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>
                    
                    {/* Highlight */}
                    <div className={clsx(
                      "text-sm font-semibold mb-3 px-3 py-1 rounded-full inline-block",
                      plan.popular 
                        ? "bg-blue-500/20 text-blue-300 border border-blue-400/30" 
                        : "bg-white/10 text-white/80"
                    )}>
                      {plan.highlight}
                    </div>

                    {/* Description */}
                    <p className="text-white/60 text-sm mb-6">
                      {plan.description}
                    </p>

                    {/* Pricing */}
                    <div className="mb-8">
                      <div className="flex items-baseline justify-center gap-2 mb-2">
                        {plan.originalPrice && (
                          <span className="text-2xl text-white/40 line-through">
                            ${plan.originalPrice}
                          </span>
                        )}
                        <span className="text-5xl font-bold text-white">
                          ${plan.price}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-white/60 text-lg">
                            /{plan.period.split(' ')[1] || plan.period}
                          </span>
                        )}
                      </div>
                      <p className="text-white/50 text-sm">
                        {plan.price === 0 ? 'No credit card required' : 'Cancel anytime'}
                      </p>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-white/90 text-sm leading-relaxed font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {/* Limitations */}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={`limit-${limitIndex}`} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-orange-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-orange-400 text-xs font-bold">!</span>
                        </div>
                        <span className="text-white/60 text-sm leading-relaxed">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={clsx(
                      "w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 hover:scale-105 transform",
                      plan.buttonStyle
                    )}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Value Proposition */}
                  {plan.popular && (
                    <div className="text-center mt-4">
                      <p className="text-xs text-blue-300 font-semibold">
                        ⚡ 3x more requests than Free 
                      </p>
                    </div>
                  )}

                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {plan.popular && (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-3xl pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-12">
          <p className="text-white/60 text-sm mb-6">
            Trusted by developers at top companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/50">
            
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              No setup fees
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-400" />
              Instant activation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}