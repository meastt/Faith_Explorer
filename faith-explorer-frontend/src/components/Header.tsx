import { BookOpen, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { ReadingPreferences } from './ReadingPreferences';
import { revenueCat } from '../services/revenuecat';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium, searchesUsed, searchLimit, chatMessagesUsed, chatLimit } = usage;
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    // Initialize RevenueCat with PUBLIC key (safe for frontend)
    const publicKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (publicKey && publicKey !== 'your_revenuecat_public_key_here') {
      revenueCat.initialize(publicKey);

      // Check subscription status on mount
      revenueCat.getSubscriptionStatus().then(status => {
        setPremium(status.isSubscribed);
      });
    }
  }, [setPremium]);

  const handleUpgradeClick = () => {
    if (isPremium) {
      // Show manage subscription options
      alert('Subscription managed through your app store. To cancel, visit your subscription settings.');
    } else {
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscribed = () => {
    setPremium(true);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 sepia:bg-amber-50 border-b border-gray-200 dark:border-gray-700 sepia:border-amber-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Faith Explorer</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 sepia:text-amber-700">Explore sacred texts across traditions</p>
              </div>
            </div>

            {/* Usage & Premium */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {!isPremium && (
                <div className="hidden md:block text-right text-sm text-gray-500 dark:text-gray-400 sepia:text-amber-700">
                  <div>{searchLimit - searchesUsed} searches left</div>
                  <div>{chatLimit - chatMessagesUsed} chats left</div>
                </div>
              )}

              <ReadingPreferences />

              <button
                onClick={handleUpgradeClick}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 sepia:from-amber-200 sepia:to-amber-300 text-yellow-900 dark:text-yellow-200 sepia:text-amber-900 border border-yellow-300 dark:border-yellow-700 sepia:border-amber-400'
                    : 'bg-blue-600 dark:bg-blue-700 sepia:bg-amber-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 sepia:hover:bg-amber-800'
                }`}
              >
                <Star className={`w-4 h-4 ${isPremium ? 'fill-current' : ''}`} />
                <span>{isPremium ? 'Premium' : 'Upgrade'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribed}
        />
      )}
    </>
  );
}
