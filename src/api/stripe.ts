// src/api/stripe.ts
// Stripe client setup and integration utilities
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe, StripeConfig, StripeError, CheckoutSession } from '../types/stripe';
import api from './client';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string;

// Validate that Stripe key is available
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables');
}

// Stripe instance (singleton)
let stripeInstance: Stripe | null = null;
let stripeLoadPromise: Promise<Stripe | null> | null = null;

/**
 * Load and initialize Stripe SDK
 * Returns a promise that resolves to Stripe instance
 */
export const initializeStripe = async (): Promise<Stripe | null> => {
  // Return existing promise if already loading
  if (stripeLoadPromise) {
    return stripeLoadPromise;
  }

  // Return existing instance if already loaded
  if (stripeInstance) {
    return stripeInstance;
  }

  // Create new load promise
  stripeLoadPromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  
  try {
    stripeInstance = await stripeLoadPromise;
    
    if (!stripeInstance) {
      throw new Error('Failed to initialize Stripe');
    }

    console.log('✅ Stripe SDK loaded successfully');
    return stripeInstance;
  } catch (error) {
    console.error('❌ Failed to load Stripe SDK:', error);
    stripeLoadPromise = null; // Reset so we can try again
    throw error;
  }
};

/**
 * Get Stripe instance (loads if not already loaded)
 */
export const getStripe = async (): Promise<Stripe | null> => {
  if (stripeInstance) {
    return stripeInstance;
  }
  
  return await initializeStripe();
};

/**
 * Check if Stripe is loaded and ready
 */
export const isStripeReady = (): boolean => {
  return stripeInstance !== null;
};

/**
 * Get Stripe configuration from backend
 */
export const getStripeConfig = async (): Promise<StripeConfig> => {
  const response = await api.get<StripeConfig>('/api/stripe/config');
  return response.data;
};

/**
 * Create and redirect to checkout in one step
 * @param planType - Plan to subscribe to
 */
export const createAndRedirectToCheckout = async (
  planType: 'developer' | 'professional'
): Promise<void> => {
  try {
    console.log('🚀 Creating checkout session for plan:', planType);
    
    // Create the checkout session via our API
    const response = await api.post('/api/subscription/create-checkout', {
      plan_type: planType,
    });

    console.log('📋 Checkout API response:', response.data);

    if (response.data.status === 'success') {
      console.log('✅ Checkout session created, redirecting to:', response.data.checkout_url);
      
      // Redirect to Stripe Checkout
      window.location.href = response.data.checkout_url;
    } else {
      console.error('❌ Checkout creation failed:', response.data);
      throw new Error(response.data.message || 'Failed to create checkout session');
    }
  } catch (error: any) {
    console.error('💥 Checkout creation error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    // Extract meaningful error message
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to create checkout session';
    
    throw new Error(errorMessage);
  }
};

/**
 * Open Stripe billing portal
 */
export const openBillingPortal = async (): Promise<void> => {
  try {
    console.log('🏛️ Opening billing portal...');
    
    const response = await api.post('/api/subscription/billing-portal');

    console.log('📋 Billing portal response:', response.data);

    if (response.data.status === 'success') {
      console.log('✅ Opening billing portal:', response.data.portal_url);
      
      // Open billing portal in new tab
      window.open(response.data.portal_url, '_blank');
    } else {
      console.error('❌ Billing portal creation failed:', response.data);
      throw new Error(response.data.message || 'Failed to create billing portal session');
    }
  } catch (error: any) {
    console.error('💥 Billing portal error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        'Failed to open billing portal';
    
    throw new Error(errorMessage);
  }
};

/**
 * Handle successful payment callback
 * @param sessionId - Stripe session ID from URL parameters
 */
export const handlePaymentSuccess = async (sessionId: string): Promise<boolean> => {
  try {
    const stripe = await getStripe();
    
    if (!stripe) {
      console.error('Stripe not loaded for payment success handling');
      return false;
    }

    // Retrieve the session to verify it was successful
    console.log('✅ Payment successful for session:', sessionId);
    
    // The actual subscription update will happen via webhook
    // We just need to poll for the updated subscription status
    return true;
  } catch (error) {
    console.error('Error handling payment success:', error);
    return false;
  }
};

/**
 * Poll for subscription update after payment
 * Useful after payment success to wait for webhook processing
 */
export const pollForSubscriptionUpdate = async (
  maxAttempts: number = 10,
  interval: number = 2000
): Promise<boolean> => {
  console.log('🔄 Starting subscription polling...');
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.log(`🔍 Polling attempt ${attempt + 1}/${maxAttempts}`);
      
      const response = await api.get('/api/subscription/status');
      
      if (response.data.status === 'success' && 
          response.data.subscription?.status === 'active') {
        console.log('✅ Subscription updated successfully');
        return true;
      }
      
      // Wait before next attempt
      if (attempt < maxAttempts - 1) {
        console.log(`⏳ Waiting ${interval}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    } catch (error) {
      console.error(`❌ Polling attempt ${attempt + 1} failed:`, error);
    }
  }
  
  console.warn('⚠️ Subscription polling timed out');
  return false;
};

/**
 * Format price for display
 * @param amount - Amount in cents
 * @param currency - Currency code (default: 'usd')
 */
export const formatPrice = (amount: number, currency: string = 'usd'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
};

/**
 * Stripe error handler
 * @param error - Stripe error object
 */
export const handleStripeError = (error: any): string => {
  if (error?.type === 'card_error') {
    return error.message || 'Your card was declined';
  }
  
  if (error?.type === 'validation_error') {
    return 'Please check your payment information';
  }
  
  if (error?.type === 'authentication_required') {
    return 'Authentication required for this payment method';
  }
  
  return error?.message || 'An unexpected error occurred';
};

/**
 * Validate Stripe environment
 */
export const validateStripeEnvironment = (): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (!STRIPE_PUBLISHABLE_KEY) {
    errors.push('VITE_STRIPE_PUBLISHABLE_KEY is not configured');
  }
  
  if (STRIPE_PUBLISHABLE_KEY && !STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    errors.push('Invalid Stripe publishable key format');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get Stripe test mode status
 */
export const isTestMode = (): boolean => {
  return STRIPE_PUBLISHABLE_KEY?.startsWith('pk_test_') ?? true;
};