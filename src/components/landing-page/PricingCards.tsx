import React from "react";
import { Check, Minus, MoveRight, PhoneCall } from "lucide-react";

const plans = [
  {
    name: "Free Plan",
    price: 0,
    period: "forever",
    description: "Lightweight plan for initial exploration and basic code optimization",
    features: [
      "5 requests/day",
      "Up to 300 lines per request",
      "Essential code diagnostics",
      "Basic optimization guidance",
      "Email support"
    ],
    buttonText: "Get Started",
    buttonIcon: MoveRight
  },
  {
    name: "Beginner Plan",
    price: 9.99,
    period: "per month",
    description: "Ideal for analysts and data practitioners regularly improving analytical scripts",
    features: [
      "50 requests/day",
      "Up to 800 lines per request",
      "Comprehensive code diagnostics",
      "Interactive workflow visualizations",
      "Priority support"
    ],
    buttonText: "Subscribe Now",
    buttonIcon: MoveRight
  },
  {
    name: "Professional Plan",
    price: 30,
    period: "per month",
    description: "Designed for data science professionals optimizing analytical scripts",
    features: [
      "Unlimited requests/day",
      "Up to 1000 lines per request",
      "Detailed optimization reports",
      "Priority support"
    ],
    buttonText: "Upgrade to OptiFlow",
    buttonIcon: MoveRight
  },
  {
    name: "Enterprise Plan",
    price: "Custom",
    period: "solution",
    description: "Perfect for organizations with unique or complex needs",
    features: [
      "Custom-tailored solutions",
      "Dedicated consultation team",
      "Setup and integration support",
      "Implementation assistance"
    ],
    buttonText: "Contact Us",
    buttonIcon: PhoneCall
  },
  {
    name: "Call an Expert",
    price: 200,
    period: "30 min",
    description: "Ideal for individual guidance and mentorship",
    features: [
      "One-on-one consultation",
      "Platform usage guidance",
      "Requirements analysis",
      "Integration strategy"
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
                <div className="min-h-[140px]">
                  <h3 className="text-2xl font-bold text-white mb-3">{plan.name}</h3>
                  <p className="text-sm text-white/60">
                    {plan.description}
                  </p>
                </div>

                {/* Pricing */}
                <div className="flex flex-col items-start mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-white">
                      {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                    </span>
                    <span className="text-sm text-white/60 ml-1">/{plan.period}</span>
                  </div>
                </div>

                {/* Features List */}
                <div className="flex-1 space-y-6 mb-8">
                  <div className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                        <span className="text-sm text-white/80">{feature}</span>
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