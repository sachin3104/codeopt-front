import React, { useState } from "react";
import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";

const soloPlans = [
  {
    name: "Free Plan",
    price: 0,
    period: "forever",
    description: "Perfect for trying out our AI optimization",
    features: {
      "Requests per day": "5 requests",
      "Lines of code per request": "300 lines",
      "AI optimization": "Basic",
      "Support": "Email support",
      "Community access": true,
      "Code analysis reports": false,
      "Multi-language support": false,
      "Performance insights": false,
      "Team collaboration": false,
      "Shared workspace": false
    },
    buttonText: "Start Free Now",
    buttonIcon: MoveRight
  },
  {
    name: "Beginner Plan",
    price: 9.99,
    period: "per month",
    description: "Most popular choice for serious developers",
    features: {
      "Requests per day": "50 requests",
      "Lines of code per request": "800 lines",
      "AI optimization": "Advanced",
      "Support": "Priority support",
      "Community access": true,
      "Code analysis reports": true,
      "Multi-language support": true,
      "Performance insights": true,
      "Team collaboration": false,
      "Shared workspace": false
    },
    buttonText: "Get Beginner Plan",
    buttonIcon: MoveRight
  },
  {
    name: "Professional Plan",
    price: 30,
    period: "per month",
    description: "For teams and enterprises scaling fast",
    features: {
      "Requests per day": "Unlimited",
      "Lines of code per request": "1000 lines",
      "AI optimization": "Premium",
      "Support": "Priority support",
      "Community access": true,
      "Code analysis reports": true,
      "Multi-language support": true,
      "Performance insights": true,
      "Team collaboration": true,
      "Shared workspace": true
    },
    buttonText: "Go Professional",
    buttonIcon: MoveRight
  }
];

const teamPlans = [
  {
    name: "Enterprise Plan",
    price: 50,
    period: "per month",
    description: "Perfect for growing teams and organizations",
    features: {
      "Team members": "Up to 5 members",
      "Lines of code per request": "1000 lines",
      "AI optimization": "Premium",
      "Support": "Priority support",
      "Community access": true,
      "Code analysis reports": true,
      "Multi-language support": true,
      "Performance insights": true,
      "Team collaboration": true,
      "Shared workspace": true,
      "Team analytics": true
    },
    buttonText: "Get Enterprise Plan",
    buttonIcon: MoveRight
  },
  {
    name: "Call for Expert Plan",
    price: 200,
    period: "per month",
    description: "Get expert guidance from industry veterans",
    features: {
      "Team members": "Unlimited",
      "Lines of code per request": "Unlimited",
      "AI optimization": "Premium",
      "Support": "24/7 Expert Support",
      "Community access": true,
      "Code analysis reports": true,
      "Multi-language support": true,
      "Performance insights": true,
      "Team collaboration": true,
      "Shared workspace": true,
      "Team analytics": true,
      "Expert consultation": true,
      "Weekly strategy sessions": true,
      "Custom optimization": true
    },
    buttonText: "Contact Sales",
    buttonIcon: PhoneCall
  }
];

export default function PricingCards() {
  const [activeTab, setActiveTab] = useState<'solo' | 'team'>('solo');
  const plans = activeTab === 'solo' ? soloPlans : teamPlans;

  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <div className="flex gap-2 flex-col">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Transform your code performance in minutes. Start free, upgrade anytime.
            </p>
          </div>

          {/* Plan Type Tabs */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('solo')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'solo'
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Solo Plans
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'team'
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              Team Plans
            </button>
          </div>

          <div className={`grid text-left w-full ${activeTab === 'solo' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} divide-x divide-white/10 pt-20`}>
            {/* Features Column */}
            <div className="col-span-1"></div>
            
            {/* Plan Columns */}
            {plans.map((plan, index) => (
              <div key={plan.name} className="px-3 py-1 md:px-6 md:py-4 gap-2 flex flex-col">
                <p className="text-2xl text-white">{plan.name}</p>
                <p className="text-sm text-white/60">
                  {plan.description}
                </p>
                <p className="flex flex-col lg:flex-row lg:items-center gap-2 text-xl mt-8">
                  <span className="text-4xl text-white">${plan.price}</span>
                  <span className="text-sm text-white/60">/{plan.period}</span>
                </p>
                <button 
                  className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl w-full text-white px-6 py-3 flex items-center justify-center gap-2"
                >
                  {plan.buttonText} <plan.buttonIcon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* Features List */}
            {Object.keys(plans[0].features).map((feature, index) => (
              <React.Fragment key={feature}>
                <div className="px-3 lg:px-6 col-span-1 py-4 text-white/80">
                  {feature}
                </div>
                {plans.map((plan) => (
                  <div key={`${plan.name}-${feature}`} className="px-3 py-1 md:px-6 md:py-4 flex justify-center">
                    {typeof plan.features[feature] === 'boolean' ? (
                      plan.features[feature] ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Minus className="w-4 h-4 text-white/40" />
                      )
                    ) : (
                      <p className="text-white/60 text-sm">{plan.features[feature]}</p>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}