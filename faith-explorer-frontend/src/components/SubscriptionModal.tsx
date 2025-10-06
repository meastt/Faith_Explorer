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
        const offeringsData = await revenueCat.getOfferings();
        setOfferings(offeringsData);
      } catch (error) {
        console.error('Failed to load offerings:', error);
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
        throw new Error('No subscription packages available. Please check your RevenueCat configuration.');
      }

      // Look for packages by packageType or identifier
      const packages = offerings.current.availablePackages;
      let packageToUse = null;

      if (selectedPlan === 'annual') {
        // Try to find annual package by packageType first, then by identifier
        packageToUse = packages.find((pkg: any) => pkg.packageType === 'ANNUAL') ||
                      packages.find((pkg: any) => pkg.identifier?.toLowerCase().includes('annual') || pkg.identifier?.toLowerCase().includes('yearly'));
      } else {
        // Try to find monthly package by packageType first, then by identifier
        packageToUse = packages.find((pkg: any) => pkg.packageType === 'MONTHLY') ||
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600">Unlock unlimited access to Faith Explorer</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Unlimited Searches</p>
              <p className="text-sm text-gray-600">Explore as much as you want</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Unlimited Chat Messages</p>
              <p className="text-sm text-gray-600">Deep dive into any verse or topic</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Advanced Comparisons</p>
              <p className="text-sm text-gray-600">Compare up to 7 religions at once</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Priority Support</p>
              <p className="text-sm text-gray-600">Get help when you need it</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {/* Monthly Plan */}
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-2 transition-all ${
              selectedPlan === 'monthly' ? 'border-purple-500 ring-2 ring-purple-200' : 'border-purple-200 hover:border-purple-300'
            }`}
          >
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {offerings?.current?.availablePackages?.find((pkg: any) => 
                  pkg.packageType === 'MONTHLY' || 
                  pkg.identifier?.toLowerCase().includes('monthly') || 
                  pkg.identifier?.toLowerCase().includes('month')
                )?.storeProduct?.priceString || '$4.99'}
              </span>
              <span className="text-gray-600">/month</span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-1">Cancel anytime</p>
          </button>

          {/* Annual Plan with Badge */}
          <button
            onClick={() => setSelectedPlan('annual')}
            className={`w-full bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 transition-all relative ${
              selectedPlan === 'annual' ? 'border-green-500 ring-2 ring-green-200' : 'border-green-300 hover:border-green-400'
            }`}
          >
            <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
              SAVE 33%
            </div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-3xl font-bold text-gray-900">
                {offerings?.current?.availablePackages?.find((pkg: any) => 
                  pkg.packageType === 'ANNUAL' || 
                  pkg.identifier?.toLowerCase().includes('annual') || 
                  pkg.identifier?.toLowerCase().includes('yearly')
                )?.storeProduct?.priceString || '$39.99'}
              </span>
              <span className="text-gray-600">/year</span>
            </div>
            <p className="text-center text-sm text-gray-600 mt-1">Just $3.33/month • Best value</p>
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
            className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Subscribe Now'
            )}
          </button>

          <button
            onClick={handleRestore}
            disabled={isLoading}
            className="w-full py-2 text-gray-600 hover:text-gray-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Restore Purchases
          </button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-4">
          Subscription managed through App Store. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
