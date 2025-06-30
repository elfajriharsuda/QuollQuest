import Purchases, { PurchasesOffering, PurchasesPackage, CustomerInfo } from '@revenuecat/purchases-js';

// RevenueCat configuration
const REVENUECAT_API_KEY = import.meta.env.VITE_REVENUECAT_API_KEY;

export interface SubscriptionPlan {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  popular?: boolean;
  rcPackage?: PurchasesPackage;
}

export interface UserSubscription {
  isActive: boolean;
  productId: string | null;
  expirationDate: Date | null;
  willRenew: boolean;
  isInGracePeriod: boolean;
  isInTrialPeriod: boolean;
}

class RevenueCatService {
  private initialized = false;
  private offerings: PurchasesOffering[] = [];

  async initialize(userId: string): Promise<void> {
    if (this.initialized) return;

    if (!REVENUECAT_API_KEY) {
      console.warn('⚠️ RevenueCat API key not found. Payments will not work.');
      return;
    }

    try {
      console.log('🚀 Initializing RevenueCat...');
      
      // Configure RevenueCat
      await Purchases.configure({
        apiKey: REVENUECAT_API_KEY,
        appUserId: userId,
      });

      // Set user attributes for better analytics
      await Purchases.setAttributes({
        'platform': 'web',
        'app_version': '1.0.0',
      });

      this.initialized = true;
      console.log('✅ RevenueCat initialized successfully');
      
      // Load offerings
      await this.loadOfferings();
    } catch (error) {
      console.error('❌ Failed to initialize RevenueCat:', error);
      throw error;
    }
  }

  async loadOfferings(): Promise<void> {
    try {
      const offerings = await Purchases.getOfferings();
      this.offerings = offerings.all;
      console.log('📦 Loaded RevenueCat offerings:', this.offerings);
    } catch (error) {
      console.error('❌ Failed to load offerings:', error);
    }
  }

  getSubscriptionPlans(): SubscriptionPlan[] {
    // Default plans if RevenueCat is not configured
    const defaultPlans: SubscriptionPlan[] = [
      {
        id: 'free',
        title: 'Free Adventurer',
        description: 'Perfect for getting started',
        price: '$0',
        period: 'forever',
        features: [
          '3 quests per day',
          'Basic AI questions',
          'Community access',
          'Progress tracking',
          'Basic avatars'
        ]
      },
      {
        id: 'premium_monthly',
        title: 'Premium Quester',
        description: 'Unlock your full potential',
        price: '$9.99',
        period: 'month',
        popular: true,
        features: [
          'Unlimited quests',
          'Advanced AI questions',
          'Priority support',
          'Detailed analytics',
          'Premium avatars',
          'Custom topics',
          'Offline mode',
          'Export certificates'
        ]
      },
      {
        id: 'premium_yearly',
        title: 'Master Adventurer',
        description: 'Best value for serious learners',
        price: '$99.99',
        period: 'year',
        features: [
          'Everything in Premium',
          '2 months free',
          'Early access to features',
          'Personal learning coach',
          'Advanced analytics',
          'Team collaboration',
          'API access',
          'White-label options'
        ]
      }
    ];

    // If RevenueCat is not initialized, return default plans
    if (!this.initialized || this.offerings.length === 0) {
      return defaultPlans;
    }

    // Map RevenueCat offerings to our plan structure
    const rcPlans: SubscriptionPlan[] = [];
    
    this.offerings.forEach(offering => {
      offering.availablePackages.forEach(pkg => {
        const plan: SubscriptionPlan = {
          id: pkg.identifier,
          title: pkg.product.title,
          description: pkg.product.description,
          price: pkg.product.priceString,
          period: this.getPeriodFromPackage(pkg),
          features: this.getFeaturesForPackage(pkg.identifier),
          popular: pkg.identifier.includes('monthly'),
          rcPackage: pkg
        };
        rcPlans.push(plan);
      });
    });

    return rcPlans.length > 0 ? rcPlans : defaultPlans;
  }

  private getPeriodFromPackage(pkg: PurchasesPackage): string {
    const identifier = pkg.identifier.toLowerCase();
    if (identifier.includes('monthly')) return 'month';
    if (identifier.includes('yearly') || identifier.includes('annual')) return 'year';
    if (identifier.includes('weekly')) return 'week';
    return 'month';
  }

  private getFeaturesForPackage(identifier: string): string[] {
    const id = identifier.toLowerCase();
    
    if (id.includes('premium') || id.includes('pro')) {
      return [
        'Unlimited quests',
        'Advanced AI questions',
        'Priority support',
        'Detailed analytics',
        'Premium avatars',
        'Custom topics',
        'Offline mode',
        'Export certificates'
      ];
    }
    
    return [
      'Limited quests',
      'Basic features',
      'Community access'
    ];
  }

  async purchasePackage(plan: SubscriptionPlan): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      return { success: false, error: 'RevenueCat not initialized' };
    }

    if (!plan.rcPackage) {
      return { success: false, error: 'Package not available' };
    }

    try {
      console.log('💳 Purchasing package:', plan.id);
      
      const { customerInfo } = await Purchases.purchasePackage(plan.rcPackage);
      
      console.log('✅ Purchase successful:', customerInfo);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Purchase failed:', error);
      
      // Handle specific error cases
      if (error.userCancelled) {
        return { success: false, error: 'Purchase cancelled by user' };
      }
      
      return { success: false, error: error.message || 'Purchase failed' };
    }
  }

  async restorePurchases(): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) {
      return { success: false, error: 'RevenueCat not initialized' };
    }

    try {
      console.log('🔄 Restoring purchases...');
      
      const customerInfo = await Purchases.restorePurchases();
      
      console.log('✅ Purchases restored:', customerInfo);
      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to restore purchases:', error);
      return { success: false, error: error.message || 'Failed to restore purchases' };
    }
  }

  async getUserSubscription(): Promise<UserSubscription> {
    if (!this.initialized) {
      return {
        isActive: false,
        productId: null,
        expirationDate: null,
        willRenew: false,
        isInGracePeriod: false,
        isInTrialPeriod: false
      };
    }

    try {
      const customerInfo = await Purchases.getCustomerInfo();
      
      // Check for active entitlements
      const activeEntitlements = customerInfo.entitlements.active;
      const premiumEntitlement = activeEntitlements['premium']; // Adjust based on your entitlement identifier
      
      if (premiumEntitlement) {
        return {
          isActive: true,
          productId: premiumEntitlement.productIdentifier,
          expirationDate: premiumEntitlement.expirationDate ? new Date(premiumEntitlement.expirationDate) : null,
          willRenew: premiumEntitlement.willRenew,
          isInGracePeriod: premiumEntitlement.isInGracePeriod,
          isInTrialPeriod: premiumEntitlement.isInTrialPeriod
        };
      }
      
      return {
        isActive: false,
        productId: null,
        expirationDate: null,
        willRenew: false,
        isInGracePeriod: false,
        isInTrialPeriod: false
      };
    } catch (error) {
      console.error('❌ Failed to get customer info:', error);
      return {
        isActive: false,
        productId: null,
        expirationDate: null,
        willRenew: false,
        isInGracePeriod: false,
        isInTrialPeriod: false
      };
    }
  }

  async updateUserId(newUserId: string): Promise<void> {
    if (!this.initialized) return;

    try {
      await Purchases.logIn(newUserId);
      console.log('✅ RevenueCat user ID updated:', newUserId);
    } catch (error) {
      console.error('❌ Failed to update RevenueCat user ID:', error);
    }
  }

  async logOut(): Promise<void> {
    if (!this.initialized) return;

    try {
      await Purchases.logOut();
      console.log('✅ RevenueCat user logged out');
    } catch (error) {
      console.error('❌ Failed to log out from RevenueCat:', error);
    }
  }
}

export const revenueCatService = new RevenueCatService();