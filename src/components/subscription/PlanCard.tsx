// File: src/components/subscription/PlanCard.tsx
import React from 'react'
import type { Plan } from '@/types/subscription'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '@/types/subscription'
import { PlanType } from '@/api/subscription'

interface PlanCardProps {
  plan: Plan
  isCurrent: boolean
  loading: boolean
  error: AxiosError<ApiErrorResponse> | null
  onSelect: () => void
}

/**
 * Displays one subscription plan with a Select/Upgrade button.
 */
const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isCurrent,
  loading,
  error,
  onSelect,
}) => {
  const isFreePlan = plan.plan_type === PlanType.FREE

  // Button label logic
  let buttonLabel: string
  if (isCurrent) {
    buttonLabel = 'Current Plan'
  } else if (loading) {
    buttonLabel = 'Processing…'
  } else {
    buttonLabel = isFreePlan ? 'Select Free' : 'Upgrade'
  }

  return (
    <div
      className={`border rounded-lg p-6 shadow-sm flex flex-col justify-between ${
        isCurrent ? 'border-blue-600' : 'border-gray-200'
      }`}
    >
      <div>
        <h3 className="text-2xl font-semibold">{plan.name}</h3>
        <p className="mt-2 text-gray-600">{plan.description}</p>
        <div className="mt-4 text-3xl font-bold">
          {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
        </div>
        <ul className="mt-4 space-y-1 text-gray-700">
          <li>Max code input: {plan.max_code_input_chars}</li>
          <li>
            Daily requests:{' '}
            {plan.max_daily_usage != null ? plan.max_daily_usage : 'Unlimited'}
          </li>
          <li>
            Monthly requests:{' '}
            {plan.max_monthly_usage != null ? plan.max_monthly_usage : 'Unlimited'}
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <button
          onClick={onSelect}
          disabled={isCurrent || loading}
          className={`w-full py-2 rounded-md font-medium transition ${
            isCurrent
              ? 'bg-gray-300 text-gray-700 cursor-default'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {buttonLabel}
        </button>

        {error && (
          <p className="mt-2 text-sm text-red-600">
            {error.response?.data.message || error.message}
          </p>
        )}
      </div>
    </div>
  )
}

export default PlanCard
