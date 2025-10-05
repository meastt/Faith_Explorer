import { Purchases } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export interface SubscriptionStatus {
  isSubscribed: boolean;
  entitlements: string[];
  expirationDate?: Date;
  productId?: string;
}

class RevenueCatService {
  private isInitialized = false;

  async initialize(apiKey: string) {
    if (this.isInitialized) return;
    
    try {
      // Only initialize on native platforms
      if (Capacitor.isNativePlatform()) {
        await Purchases.configure({ apiKey });
        console.log('RevenueCat initialized successfully');
        this.isInitialized = true;
      } else {
        console.log('RevenueCat: Running on web platform, using fallback');
        // For web, we'll use localStorage as fallback
        this.isInitialized = true;
      }
    } catch (error) {
      console.error('RevenueCat initialization failed:', error);
      // Fallback to localStorage for web
      this.isInitialized = true;
    }
  }

  async identify(userId: string) {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await Purchases.logIn({ appUserID: userId });
        console.log('User identified:', userId);
      }
    } catch (error) {
      console.error('Failed to identify user:', error);
    }
  }

  async getSubscriptionStatus(): Promise<SubscriptionStatus> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        const { customerInfo } = await Purchases.getCustomerInfo();
        const isSubscribed = customerInfo.entitlements.active['premium'] !== undefined;
        const premiumEntitlement = customerInfo.entitlements.active['premium'];
        
        return {
          isSubscribed,
          entitlements: isSubscribed ? ['premium'] : [],
          expirationDate: premiumEntitlement?.expirationDate ? new Date(premiumEntitlement.expirationDate) : undefined,
          productId: premiumEntitlement?.productIdentifier,
        };
      } else {
        // Web fallback
        const isPremium = localStorage.getItem('faithExplorer_premium') === 'true';
        return {
          isSubscribed: isPremium,
          entitlements: isPremium ? ['premium'] : [],
        };
      }
    } catch (error) {
      console.error('Failed to get subscription status:', error);
      // Fallback to localStorage
      const isPremium = localStorage.getItem('faithExplorer_premium') === 'true';
      return {
        isSubscribed: isPremium,
        entitlements: isPremium ? ['premium'] : [],
      };
    }
  }

  async purchaseSubscription(productId: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        console.log('Starting purchase for product:', productId);
        
        // Get available packages
        const offerings = await Purchases.getOfferings();
        const currentOffering = offerings.current;
        
        if (!currentOffering) {
          throw new Error('No offerings available');
        }

        // Find the package for the product
        const packageToPurchase = currentOffering.availablePackages.find(
          pkg => pkg.identifier === productId
        );

        if (!packageToPurchase) {
          throw new Error(`Package not found: ${productId}`);
        }

        console.log('Purchasing package:', packageToPurchase.identifier);
        
        // Make the purchase
        const { customerInfo } = await Purchases.purchasePackage({ 
          aPackage: packageToPurchase 
        });

        const isSubscribed = customerInfo.entitlements.active['premium'] !== undefined;
        
        if (isSubscribed) {
          console.log('Purchase successful!');
          return true;
        } else {
          throw new Error('Purchase completed but subscription not active');
        }
      } else {
        // Web fallback - simulate purchase
        console.log('Web platform: Simulating purchase for', productId);
        localStorage.setItem('faithExplorer_premium', 'true');
        return true;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases(): Promise<SubscriptionStatus> {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        console.log('Restoring purchases...');
        const { customerInfo } = await Purchases.restorePurchases();
        const isSubscribed = customerInfo.entitlements.active['premium'] !== undefined;
        const premiumEntitlement = customerInfo.entitlements.active['premium'];
        
        return {
          isSubscribed,
          entitlements: isSubscribed ? ['premium'] : [],
          expirationDate: premiumEntitlement?.expirationDate ? new Date(premiumEntitlement.expirationDate) : undefined,
          productId: premiumEntitlement?.productIdentifier,
        };
      } else {
        // Web fallback
        const isPremium = localStorage.getItem('faithExplorer_premium') === 'true';
        return {
          isSubscribed: isPremium,
          entitlements: isPremium ? ['premium'] : [],
        };
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      // Fallback to localStorage
      const isPremium = localStorage.getItem('faithExplorer_premium') === 'true';
      return {
        isSubscribed: isPremium,
        entitlements: isPremium ? ['premium'] : [],
      };
    }
  }

  async cancelSubscription(): Promise<void> {
    // RevenueCat doesn't handle cancellation - this is done through the App Store
    console.log('To cancel subscription, please go to your App Store settings');
    throw new Error('Cancellation must be done through App Store settings');
  }

  async getOfferings() {
    if (!this.isInitialized) {
      throw new Error('RevenueCat not initialized');
    }

    try {
      if (Capacitor.isNativePlatform()) {
        return await Purchases.getOfferings();
      } else {
        // Return mock offerings for web
        return {
          current: {
            identifier: 'default',
            availablePackages: [
              {
                identifier: 'premium_monthly',
                storeProduct: {
                  identifier: 'premium_monthly',
                  description: 'Faith Explorer Premium Monthly',
                  title: 'Premium Monthly',
                  price: 9.99,
                  priceString: '$9.99',
                  currencyCode: 'USD',
                },
                offeringIdentifier: 'default',
              },
            ],
          },
        };
      }
    } catch (error) {
      console.error('Failed to get offerings:', error);
      throw error;
    }
  }
}

export const revenueCat = new RevenueCatService();
