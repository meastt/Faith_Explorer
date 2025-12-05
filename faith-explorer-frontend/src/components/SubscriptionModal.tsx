import { X, Check, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { revenueCat } from '../services/revenuecat';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export function SubscriptionModal({ onClose, onSubscribe }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');

  useEffect(() => {
    // Load offerings when modal opens
    const loadOfferings = async () => {
      try {
        const offeringsData: any = await revenueCat.getOfferings();
        console.log('Loaded offerings:', offeringsData);

        // Check if we have a current offering
        if (!offeringsData?.current) {
          console.error('No current offering found');

          // Try to use the first available offering if current is not set
          if (offeringsData?.all) {
            const allOfferings = offeringsData.all as Record<string, any>;
            const firstOfferingKey = Object.keys(allOfferings)[0];
            if (firstOfferingKey) {
              console.log('Using first available offering:', firstOfferingKey);
              const updatedOfferings = { ...offeringsData, current: allOfferings[firstOfferingKey] };
              setOfferings(updatedOfferings);
              return;
            }
          }
        }

        setOfferings(offeringsData);
      } catch (error) {
        console.error('Failed to load offerings:', error);
        setError('Failed to load subscription options. Please check your internet connection and try again.');
      }
    };
    loadOfferings();
  }, []);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting subscription process...');
      console.log('Current offerings:', offerings);

      // Find the appropriate package from available packages
      if (!offerings?.current?.availablePackages || offerings.current.availablePackages.length === 0) {
        console.error('Offerings structure:', offerings);
        throw new Error('No subscription packages available. Please make sure:\n1. You have created products in RevenueCat\n2. Products are attached to an Offering\n3. The offering is set as "Current" in RevenueCat dashboard');
      }

      // Look for packages by packageType or identifier
      const packages = offerings.current.availablePackages;
      console.log('Available packages:', packages.map((pkg: any) => ({
        identifier: pkg.identifier,
        packageType: pkg.packageType,
        price: pkg.storeProduct?.priceString
      })));

      let packageToUse = null;

      if (selectedPlan === 'annual') {
        // Try to find annual package - check RevenueCat defaults, custom IDs, packageType, then pattern
        packageToUse = packages.find((pkg: any) => pkg.identifier === '$rc_annual') ||
          packages.find((pkg: any) => pkg.identifier === 'prod_734d9efaca') ||
          packages.find((pkg: any) => pkg.packageType === 'ANNUAL') ||
          packages.find((pkg: any) => pkg.identifier?.toLowerCase().includes('annual') || pkg.identifier?.toLowerCase().includes('yearly'));
      } else {
        // Try to find monthly package - check RevenueCat defaults, custom IDs, packageType, then pattern
        packageToUse = packages.find((pkg: any) => pkg.identifier === '$rc_monthly') ||
          packages.find((pkg: any) => pkg.identifier === 'prod_e0339d2171') ||
          packages.find((pkg: any) => pkg.packageType === 'MONTHLY') ||
          packages.find((pkg: any) => pkg.identifier?.toLowerCase().includes('monthly') || pkg.identifier?.toLowerCase().includes('month'));
      }

      // Fallback to first package if no match found
      if (!packageToUse && packages.length > 0) {
        console.warn('Could not find matching package, using first available package');
        packageToUse = packages[0];
      }

      if (!packageToUse) {
        throw new Error('No subscription package found. Please contact support.');
      }

      console.log('Purchasing package:', packageToUse.identifier);

      const success = await revenueCat.purchaseSubscription(packageToUse.identifier);

      if (success) {
        console.log('Subscription successful!');
        onSubscribe();
        onClose();
      } else {
        throw new Error('Purchase was not successful');
      }
    } catch (error: any) {
      console.error('Subscription error:', error);

      // Handle user cancellation gracefully
      if (error.message?.includes('cancelled') || error.message?.includes('cancel')) {
        setError('Purchase cancelled');
      } else {
        setError(error.message || 'Failed to process subscription. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const status = await revenueCat.restorePurchases();
      if (status.isSubscribed) {
        onSubscribe();
        onClose();
      } else {
        setError('No previous purchases found to restore.');
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      setError(error.message || 'Failed to restore purchases. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-sand-50 dark:bg-stone-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative border border-gold-200 dark:border-gold-900/30">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-sand-200 dark:bg-stone-800 hover:bg-sand-300 dark:hover:bg-stone-700 transition-colors z-10"
        >
          <X className="w-6 h-6 text-stone-600 dark:text-stone-400" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-300 to-bronze-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">Become a Patron</h2>
          <p className="text-stone-600 dark:text-stone-400">Unlock the full wisdom of the ages</p>

          {/* Trust Indicator */}
          <div className="mt-3 flex items-center justify-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-gold-500">
              <span className="text-lg">★★★★★</span>
            </div>
            <span className="text-stone-500 dark:text-stone-500 font-medium">Trusted by thousands of seekers</span>
          </div>
        </div>

        <div className="space-y-3 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-gold-700 dark:text-gold-400" />
            </div>
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Unlimited Searches</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Explore as much as you want</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-gold-700 dark:text-gold-400" />
            </div>
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Unlimited Chat Messages</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Deep dive into any verse or topic</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-gold-700 dark:text-gold-400" />
            </div>
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Advanced Comparisons</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Compare up to 7 religions at once</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold-100 dark:bg-gold-900/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-gold-700 dark:text-gold-400" />
            </div>
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-200">Priority Support</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Get help when you need it</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mb-8 bg-sand-100 dark:bg-stone-800 rounded-xl p-4 border border-sand-200 dark:border-stone-700 relative">
          <div className="absolute -top-3 left-4 bg-sand-50 dark:bg-stone-900 px-2 text-2xl text-bronze-400 font-serif leading-none">"</div>
          <div className="flex items-start gap-3 pt-2">
            <div className="flex-1">
              <p className="text-sm text-stone-700 dark:text-stone-300 italic mb-2 font-serif">
                Faith Explorer has deepened my understanding of scripture and helped me discover wisdom across traditions I never knew existed.
              </p>
              <p className="text-xs text-bronze-600 dark:text-bronze-400 font-bold uppercase tracking-wider">— Sarah M., Patron</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {/* Monthly Plan */}
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full bg-white dark:bg-stone-800 rounded-xl p-4 border-2 transition-all ${selectedPlan === 'monthly'
              ? 'border-bronze-400 ring-1 ring-bronze-400/20'
              : 'border-sand-200 dark:border-stone-700 hover:border-bronze-300'
              }`}
          >
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                {offerings?.current?.availablePackages?.find((pkg: any) =>
                  pkg.packageType === 'MONTHLY' ||
                  pkg.identifier?.toLowerCase().includes('monthly') ||
                  pkg.identifier?.toLowerCase().includes('month')
                )?.storeProduct?.priceString || '$4.99'}
              </span>
              <span className="text-stone-500">/month</span>
            </div>
            <p className="text-center text-sm text-stone-500 mt-1">Cancel anytime</p>
          </button>

          {/* Annual Plan with Badge */}
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`w-full bg-gradient-to-r from-gold-50 to-sand-50 dark:from-stone-800 dark:to-stone-800 rounded-xl p-4 border-2 transition-all relative ${selectedPlan === 'annual'
              ? 'border-gold-500 ring-1 ring-gold-500/20 shadow-md'
              : 'border-gold-200 hover:border-gold-300'
              }`}
          >
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-gold-500 to-bronze-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
              Best Value
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-stone-900 dark:text-stone-100 font-serif">
                {offerings?.current?.availablePackages?.find((pkg: any) =>
                  pkg.packageType === 'ANNUAL' ||
                  pkg.identifier?.toLowerCase().includes('annual') ||
                  pkg.identifier?.toLowerCase().includes('yearly')
                )?.storeProduct?.priceString || '$39.99'}
              </span>
              <span className="text-stone-500">/year</span>
            </div>
            <p className="text-center text-sm font-semibold text-bronze-700 dark:text-gold-400 mt-1">Just $3.33/month</p>
            <p className="text-center text-xs text-stone-500 mt-0.5">Save over $20 compared to monthly</p>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-bronze-600 to-gold-600 text-white rounded-xl font-bold hover:from-bronze-700 hover:to-gold-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Become a Patron'
            )}
          </button>

          <button
            onClick={handleRestore}
            disabled={isLoading}
            className="w-full py-2 text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            Restore Purchases
          </button>
        </div>

        <div className="mt-6 space-y-3 border-t border-sand-200 dark:border-stone-800 pt-4">
          {/* Required Subscription Information */}
          <div className="text-xs text-stone-500 dark:text-stone-400 space-y-1.5 leading-relaxed">
            <p className="font-semibold text-stone-600 dark:text-stone-300">Subscription Details:</p>
            <ul className="space-y-1 pl-3 list-disc">
              <li><strong>Title:</strong> Faith Explorer Pro Auto-Renewable Subscription</li>
              <li><strong>Length:</strong> Monthly (1 month) or Annual (12 months)</li>
              <li><strong>Price:</strong> {
                offerings?.current?.availablePackages?.find((pkg: any) =>
                  pkg.packageType === 'MONTHLY' ||
                  pkg.identifier?.toLowerCase().includes('monthly')
                )?.storeProduct?.priceString || '$4.99'
              }/month or {
                  offerings?.current?.availablePackages?.find((pkg: any) =>
                    pkg.packageType === 'ANNUAL' ||
                    pkg.identifier?.toLowerCase().includes('annual')
                  )?.storeProduct?.priceString || '$39.99'
                }/year ($3.33/month)</li>
            </ul>
            <p className="pt-1">
              Payment will be charged to your Apple ID account at confirmation of purchase.
              Subscription automatically renews unless it is canceled at least 24 hours before
              the end of the current period. Your account will be charged for renewal within
              24 hours prior to the end of the current period. You can manage and cancel your
              subscriptions by going to your account settings on the App Store after purchase.
            </p>
          </div>

          {/* Required Links */}
          <div className="flex flex-col items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href="https://faithexplorer.app/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stone-800 font-medium"
              >
                Privacy Policy
              </a>
              <span>•</span>
              <a
                href="https://faithexplorer.app/terms/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-stone-800 font-medium"
              >
                Terms of Use (EULA)
              </a>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <a
                href="itms-apps://apps.apple.com/account/subscriptions"
                className="underline hover:text-stone-800"
              >
                Manage Subscription
              </a>
              <span>•</span>
              <button
                onClick={handleRestore}
                disabled={isLoading}
                className="underline hover:text-stone-800 disabled:opacity-50"
              >
                Restore Purchases
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
