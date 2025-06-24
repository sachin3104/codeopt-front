// File: src/pages/subscription/PricingPage.tsx
import React, { useState, useEffect } from 'react'
import { PlanType, subscriptionService } from '@/api/subscription'
import { useSubscription } from '@/hooks/use-subscription'
import type { Plan } from '@/types/subscription'
import { Check, MoveRight, PhoneCall } from 'lucide-react'

const PricingPage: React.FC = () => {
  const {
    subscription,
    fetching,
    fetchError,
    startCheckout,
    checkoutLoading,
    checkoutError,
    createSubscription,
    createLoading,
    createError,
  } = useSubscription()

  const [plans, setPlans] = useState<Plan[]>([])
  const [loadingPlans, setLoadingPlans] = useState<boolean>(true)
  const [plansError, setPlansError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlans = async () => {
      setLoadingPlans(true)
      setPlansError(null)
      try {
        const data = await subscriptionService.getPlans()
        setPlans(data)
      } catch (err: any) {
        setPlansError(err.response?.data?.message || err.message)
      } finally {
        setLoadingPlans(false)
      }
    }
    fetchPlans()
  }, [])

  if (loadingPlans || fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }
  if (plansError || fetchError) {
    return (
      <div className="text-center text-red-600">
        <p>Error loading plans: {plansError || fetchError?.response?.data.message}</p>
      </div>
    )
  }

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
            {plans.map(plan => {
              const isCurrent = subscription?.plan.plan_type === plan.plan_type
              const isFreePlan = plan.plan_type === PlanType.FREE

              // Choose the right loading & error flag for this plan
              const loading = isFreePlan ? createLoading : checkoutLoading
              const error = isFreePlan ? createError : checkoutError

              const handleSelect = () => {
                if (isFreePlan) {
                  createSubscription(PlanType.FREE)
                } else {
                  startCheckout(plan.plan_type as PlanType)
                }
              }

              // Determine button text and icon based on plan type
              let buttonText = 'Get Started'
              let ButtonIcon = MoveRight
              
              if (isCurrent) {
                buttonText = 'Current Plan'
              } else if (loading) {
                buttonText = 'Processing…'
              } else if (isFreePlan) {
                buttonText = 'Select Free'
              } else {
                buttonText = 'Upgrade'
              }

              // Generate features list based on plan data
              const features = [
                `Max code input: ${plan.max_code_input_chars} characters`,
                `Daily requests: ${plan.max_daily_usage != null ? plan.max_daily_usage : 'Unlimited'}`,
                `Monthly requests: ${plan.max_monthly_usage != null ? plan.max_monthly_usage : 'Unlimited'}`,
              ]

              return (
                <div 
                  key={plan.id} 
                  className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 flex flex-col ${
                    isCurrent ? 'border-blue-400/50' : ''
                  }`}
                >
                  {/* Plan Name and Description */}
                  <div className="min-h-[120px]">
                    <h3 className="text-xl font-bold text-white mb-3 leading-tight">
                      {plan.name}
                      {isCurrent && <span className="ml-2 text-sm text-blue-400">(Current)</span>}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="flex flex-col items-start mb-6">
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-white">
                        {plan.price === 0 ? 'Free' : `$${plan.price}`}
                      </span>
                      <span className="text-sm text-white/60 ml-1">
                        {plan.price === 0 ? '/forever' : '/mo'}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="flex-1 space-y-4 mb-6">
                    <div className="space-y-3">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-white/80 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button 
                    onClick={handleSelect}
                    disabled={isCurrent || loading}
                    className={`w-full backdrop-blur-sm border transition-all duration-300 rounded-xl px-6 py-3 flex items-center justify-center gap-2 mt-auto ${
                      isCurrent
                        ? 'bg-gray-500/20 border-gray-400/30 text-gray-400 cursor-default'
                        : loading
                        ? 'bg-white/10 border-white/20 text-white/50 cursor-not-allowed'
                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                    }`}
                  >
                    {buttonText} <ButtonIcon className="w-4 h-4" />
                  </button>

                  {/* Error Display */}
                  {error && (
                    <p className="mt-2 text-sm text-red-400 text-center">
                      {error.response?.data.message || error.message}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingPage
