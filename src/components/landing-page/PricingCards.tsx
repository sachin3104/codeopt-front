import React from "react";
import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";

const plans = [
  {
    name: "optqo Free",
    price: 0,
    period: "forever",
    description: "Perfect for exploration and small projects.",
    features: [
      "5 AI optimization requests per day",
      "Up to 300 lines per request",
      "Essential code diagnostics",
      "Basic optimization insights",
      "Email-based support"
    ],
    buttonText: "Get Started",
    buttonIcon: MoveRight
  },
  {
    name: "optqo Pro",
    price: 9.99,
    period: "per month",
    description: "For analysts seeking deeper diagnostics and more insights.",
    features: [
      "50 AI optimization requests per day",
      "Up to 800 lines per request",
      "Comprehensive diagnostics",
      "Visual workflow mapping",
      "Priority support"
    ],
    buttonText: "Subscribe Now",
    buttonIcon: MoveRight
  },
  {
    name: "optqo OptiFlow",
    price: 30,
    period: "per month",
    description: "For professionals focused on ML and analytics.",
    features: [
      "Unlimited AI requests",
      "Up to 1000 lines per request",
      "Refactoring with Optimus",
      "Real-time  analytics",
      "Documentation reports with Scribe"
    ],
    buttonText: "Upgrade to OptiFlow",
    buttonIcon: MoveRight
  },
  {
    name: "optqo Enterprise",
    price: "Custom",
    period: "solution",
    description: "Custom AI solutions for enterprise-scale optimization.",
    features: [
      "Tailored platform with workflows",
      "Legacy system modernization",
      "Custom AI models with core agents",
      "Dedicated consulting team",
      "Expert-led delivery"
    ],
    buttonText: "Contact Us",
    buttonIcon: PhoneCall
  },
  {
    name: "optqo Expert",
    price: 200,
    period: "30 min",
    description: "One-on-one mentoring with a senior analytics leader.",
    features: [
      "$200 per 30-minute session",
      "Personalized platform guidance",
      "Help defining optimization needs",
      "Toolchain advisory",
      "Third-party solutions support"
    ],
    buttonText: "Schedule a Call",
    buttonIcon: PhoneCall
  }
];

export default function PricingCards() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex text-center justify-center items-center gap-4 flex-col">
          <div className="flex gap-2 flex-col">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
              Choose Your Plan
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Transform your code performance in minutes. Start free, upgrade anytime.
            </p>
          </div>

          <div className="grid text-left w-full lg:grid-cols-5 gap-6 pt-20">
            {plans.map((plan, index) => (
              <div key={plan.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col">
                {/* Plan Name and Description */}
                <div className="min-h-[120px]">
                  <h3 className="text-xl font-bold text-white mb-3 leading-tight">{plan.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex flex-col items-start mb-6">
                  <div className="flex items-baseline">
                    <span className="text-xl font-bold text-white">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-sm text-white/60 ml-1">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-4 mb-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-white/80 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button 
                  className="w-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-6 py-3 flex items-center justify-center gap-2 mt-auto"
                >
                  {plan.buttonText} <plan.buttonIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}