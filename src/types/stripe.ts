// src/types/stripe.ts
// Types for Stripe integration

import type { Stripe } from '@stripe/stripe-js';

export interface StripeConfig {
  status: string;
  stripe_publishable_key: string;
  webhook_endpoint: string;
  test_mode: boolean;
}

export interface StripeError {
  type: string;
  code?: string;
  message: string;
  decline_code?: string;
}

export interface CheckoutSession {
  id: string;
  object: 'checkout.session';
  payment_status: 'paid' | 'unpaid' | 'no_payment_required';
  status: 'open' | 'complete' | 'expired';
}

// Re-export Stripe type for convenience
export type { Stripe }; 