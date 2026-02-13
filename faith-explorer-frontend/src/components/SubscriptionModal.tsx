import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { revenueCat } from '../services/revenuecat';
import { useTranslation } from 'react-i18next';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export function SubscriptionModal({ onClose, onSubscribe }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offerings, setOfferings] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('annual');
  const { t } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');

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
        setError(tCommon('errors.failedToLoadOfferings'));
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
        throw new Error(tCommon('errors.noPackagesFound'));
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
        setError(tCommon('errors.purchaseCancelled'));
      } else {
        setError(error.message || tCommon('errors.purchaseFailed'));
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
        setError(tCommon('errors.noRestorePurchases'));
      }
    } catch (error: any) {
      console.error('Restore error:', error);
      setError(error.message || tCommon('errors.restoreFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="bg-sand-50 dark:bg-stone-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-y-auto p-4 relative border-t border-gold-200 dark:border-gold-900/30 sm:border sm:mx-4" onClick={e => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-sand-200 dark:bg-stone-800 z-10"
        >
          <X className="w-4 h-4 text-stone-600 dark:text-stone-400" />
        </button>

        {/* Header - compact */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mb-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[10px] font-bold rounded-full">
            🎁 {t('subscription.urgencyBadge')}
          </div>
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">{t('subscription.title')}</h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">{t('subscription.subtitle')}</p>
        </div>

        {/* Features - 2 column grid */}
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400 flex-shrink-0" />
            <p className="text-xs text-stone-800 dark:text-stone-200">{t('subscription.features.unlimitedSearches.title')}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400 flex-shrink-0" />
            <p className="text-xs text-stone-800 dark:text-stone-200">{t('subscription.features.unlimitedChat.title')}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400 flex-shrink-0" />
            <p className="text-xs text-stone-800 dark:text-stone-200">{t('subscription.features.advancedComparisons.title')}</p>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-gold-700 dark:text-gold-400 flex-shrink-0" />
            <p className="text-xs text-stone-800 dark:text-stone-200">{t('subscription.features.prioritySupport.title')}</p>
          </div>
        </div>

        {/* Plan cards - side by side */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-lg p-2.5 border-2 transition-all text-center ${selectedPlan === 'monthly'
              ? 'border-bronze-400 bg-white dark:bg-stone-800'
              : 'border-sand-200 dark:border-stone-700 bg-white/50 dark:bg-stone-800/50'
              }`}
          >
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif block">
              {offerings?.current?.availablePackages?.find((pkg: any) =>
                pkg.packageType === 'MONTHLY' ||
                pkg.identifier?.toLowerCase().includes('monthly')
              )?.storeProduct?.priceString || t('subscription.plans.monthlyDefault')}
            </span>
            <span className="text-[11px] text-stone-500 block">{t('subscription.plans.monthSuffix')}</span>
          </button>

          <button
            onClick={() => setSelectedPlan('annual')}
            className={`rounded-lg p-2.5 border-2 transition-all text-center relative ${selectedPlan === 'annual'
              ? 'border-gold-500 bg-gold-50 dark:bg-stone-800 shadow-sm'
              : 'border-gold-200 bg-gold-50/50 dark:bg-stone-800/50'
              }`}
          >
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-bronze-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
              {t('subscription.plans.bestValue')}
            </div>
            <span className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif block">
              {offerings?.current?.availablePackages?.find((pkg: any) =>
                pkg.packageType === 'ANNUAL' ||
                pkg.identifier?.toLowerCase().includes('annual')
              )?.storeProduct?.priceString || t('subscription.plans.annualDefault')}
            </span>
            <span className="text-[11px] text-stone-500 block">{t('subscription.plans.yearSuffix')}</span>
            <span className="text-[10px] font-semibold text-bronze-700 dark:text-gold-400 block">{t('subscription.plans.annualMonthly')}</span>
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-1.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-800">{error}</p>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full py-2.5 bg-gradient-to-r from-bronze-600 to-gold-600 text-white rounded-xl font-bold disabled:opacity-50 transition-all shadow-lg flex items-center justify-center gap-2 uppercase tracking-wide text-sm mb-1"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t('subscription.buttons.processing')}
            </>
          ) : (
            t('subscription.buttons.becomePatron')
          )}
        </button>

        <button
          onClick={handleRestore}
          disabled={isLoading}
          className="w-full py-1.5 text-stone-500 text-xs font-medium disabled:opacity-50 transition-colors"
        >
          {t('subscription.buttons.restorePurchases')}
        </button>

        {/* Legal - collapsed */}
        <div className="mt-2 pt-2 border-t border-sand-200 dark:border-stone-800">
          <p className="text-[10px] text-stone-400 dark:text-stone-500 leading-snug text-center">
            {t('subscription.legalText.renewalTerms')} {' '}
            <a href="https://faithexplorer.app/privacy" target="_blank" rel="noopener noreferrer" className="underline">{t('subscription.links.privacyPolicy')}</a>
            {' · '}
            <a href="https://faithexplorer.app/terms/" target="_blank" rel="noopener noreferrer" className="underline">{t('subscription.links.termsOfUse')}</a>
          </p>
        </div>
      </div>
    </div>
  );
}
