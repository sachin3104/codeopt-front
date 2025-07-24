// src/components/admin/admin-components/SubscriptionUpgradeModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Crown, Zap, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userEmail: string;
  currentPlan?: string;
  onUpgrade: (planType: string, days: number) => Promise<void>;
  isLoading?: boolean;
}

export default function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  userId,
  userEmail,
  currentPlan = 'FREE',
  onUpgrade,
  isLoading = false
}: SubscriptionUpgradeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [durationDays, setDurationDays] = useState<number>(30);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Plan options logic
  const getPlanOptions = () => {
    const plan = (currentPlan || '').toUpperCase();
    if (plan === 'PRO') {
      return [
        { value: 'ULTIMATE', label: 'Ultimate Plan', icon: <Crown className="w-4 h-4" /> },
      ];
    } else if (plan === 'ULTIMATE') {
      return [
        { value: 'PRO', label: 'Pro Plan', icon: <Zap className="w-4 h-4" /> },
      ];
    } else {
      // Default: Free
      return [
        { value: 'PRO', label: 'Pro Plan', icon: <Zap className="w-4 h-4" /> },
        { value: 'ULTIMATE', label: 'Ultimate Plan', icon: <Crown className="w-4 h-4" /> },
      ];
    }
  };

  // Set default plan selection based on options
  useEffect(() => {
    if (isOpen) {
      const options = getPlanOptions();
      setSelectedPlan(options[0]?.value || 'PRO');
      setDurationDays(30); // Fixed to 30 days
      setError(null);
    }
  }, [isOpen, currentPlan]);

  // Convert plan type to backend format
  const convertPlanTypeToBackend = (planType: string): 'pro' | 'ultimate' | 'free' => {
    switch (planType.toUpperCase()) {
      case 'PRO':
        return 'pro';
      case 'ULTIMATE':
        return 'ultimate';
      case 'FREE':
        return 'free';
      default:
        return 'pro'; // fallback
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) {
      setError('Please select a plan');
      return;
    }

    if (durationDays < 1) {
      setError('Duration must be at least 1 day');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const backendPlanType = convertPlanTypeToBackend(selectedPlan);
      
      await onUpgrade(backendPlanType, durationDays);
      onClose();
    } catch (err: any) {

      setError(err.message || 'Failed to upgrade subscription');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get plan icon
  const getPlanIcon = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'pro':
        return <Zap className="w-4 h-4" />;
      case 'ultimate':
        return <Crown className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  // Get plan color
  const getPlanColor = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'pro':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ultimate':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-white/20 rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-xl font-semibold text-white">Upgrade Subscription</h2>
            <p className="text-white/60 text-sm mt-1">Upgrade user's subscription plan</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/80 transition-colors"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* User Info */}
          <Card className="bg-gray-800/50 border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-sm">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Email:</span>
                <span className="text-white text-sm font-medium">{userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Current Plan:</span>
                <Badge variant="outline" className={getPlanColor(currentPlan)}>
                  {currentPlan}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Plan Selection */}
          <div className="space-y-3">
            <Label htmlFor="plan" className="text-white text-sm font-medium">
              Select New Plan
            </Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger className="bg-gray-800 border-white/20 text-white">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-white/20">
                {getPlanOptions().map(option => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-700 focus:bg-gray-700">
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Duration - Fixed to 30 days */}
          <div className="space-y-3">
            <Label htmlFor="duration" className="text-white text-sm font-medium">
              Duration
            </Label>
            <div className="relative">
              <Input
                id="duration"
                type="number"
                value={30}
                disabled
                className="bg-gray-700 border-white/20 text-white/60 cursor-not-allowed"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            </div>
            <p className="text-white/50 text-xs">
              Fixed duration of 30 days for all subscription upgrades
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedPlan}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Upgrading...
                </div>
              ) : (
                'Confirm Upgrade'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 