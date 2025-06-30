import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { revenueCatService, SubscriptionPlan, UserSubscription } from '../lib/revenuecat';
import toast from 'react-hot-toast';

interface SubscriptionContextType {
  subscription: UserSubscription;
  plans: SubscriptionPlan[];
  loading: boolean;
  purchasePlan: (plan: SubscriptionPlan) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  refreshSubscription: () => Promise<void>;
  isPremium: boolean;
  canAccessFeature: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<UserSubscription>({
    isActive: false,
    productId: null,
    expirationDate: null,
    willRenew: false,
    isInGracePeriod: false,
    isInTrialPeriod: false
  });
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      initializeRevenueCat();
    } else {
      setLoading(false);
    }
  }, [user]);

  const initializeRevenueCat = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Initialize RevenueCat with user ID
      await revenueCatService.initialize(user.id);
      
      // Load subscription plans
      const availablePlans = revenueCatService.getSubscriptionPlans();
      setPlans(availablePlans);
      
      // Get current subscription status
      await refreshSubscription();
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      // Set default plans even if RevenueCat fails
      setPlans(revenueCatService.getSubscriptionPlans());
    } finally {
      setLoading(false);
    }
  };

  const refreshSubscription = async () => {
    try {
      const userSub = await revenueCatService.getUserSubscription();
      setSubscription(userSub);
    } catch (error) {
      console.error('Failed to refresh subscription:', error);
    }
  };

  const purchasePlan = async (plan: SubscriptionPlan): Promise<boolean> => {
    try {
      const result = await revenueCatService.purchasePackage(plan);
      
      if (result.success) {
        toast.success(`🎉 Welcome to ${plan.title}! Your subscription is now active.`);
        await refreshSubscription();
        return true;
      } else {
        if (result.error !== 'Purchase cancelled by user') {
          toast.error(`Purchase failed: ${result.error}`);
        }
        return false;
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('An unexpected error occurred during purchase');
      return false;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      const result = await revenueCatService.restorePurchases();
      
      if (result.success) {
        toast.success('✅ Purchases restored successfully!');
        await refreshSubscription();
        return true;
      } else {
        toast.error(`Failed to restore purchases: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error('Restore error:', error);
      toast.error('An unexpected error occurred while restoring purchases');
      return false;
    }
  };

  const isPremium = subscription.isActive;

  const canAccessFeature = (feature: string): boolean => {
    // Define feature access rules
    const premiumFeatures = [
      'unlimited_quests',
      'advanced_ai',
      'custom_topics',
      'detailed_analytics',
      'premium_avatars',
      'offline_mode',
      'export_certificates',
      'priority_support'
    ];

    // Free features available to everyone
    const freeFeatures = [
      'basic_quests',
      'community_access',
      'progress_tracking',
      'basic_avatars',
      'leaderboard'
    ];

    if (freeFeatures.includes(feature)) {
      return true;
    }

    if (premiumFeatures.includes(feature)) {
      return isPremium;
    }

    // Default to free access for unknown features
    return true;
  };

  const value = {
    subscription,
    plans,
    loading,
    purchasePlan,
    restorePurchases,
    refreshSubscription,
    isPremium,
    canAccessFeature
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};