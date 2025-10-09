import { BookOpen, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { UsageStatusIndicator } from './UsageStatusIndicator';
import { revenueCat } from '../services/revenuecat';
import { ICON_SIZES } from '../styles/design-system';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium } = usage;
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
      // For premium users, show how to manage subscription
      // On iOS, this should direct them to App Store settings
      alert('Your subscription is active! To manage or cancel, go to Settings > [Your Name] > Subscriptions on your device.');
    } else {
      // For non-premium users, show the subscription modal
      setShowSubscriptionModal(true);
    }
  };

  const handleSubscribed = () => {
    setPremium(true);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>
          
          {/* Subtle gradient shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          <div className="relative max-w-4xl mx-auto px-4 pt-safe">
            <div className="flex items-center justify-between h-14">
              {/* Logo & Title */}
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 bg-white/25 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/40 ring-2 ring-white/20">
                  <BookOpen className={`${ICON_SIZES.SM} text-white`} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white tracking-tight drop-shadow-sm">Faith Explorer</h1>
                  <p className="text-xs text-white/80 -mt-0.5 hidden sm:block font-medium">Sacred wisdom across traditions</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <UsageStatusIndicator onClick={handleUpgradeClick} />
                <button
                  onClick={handleUpgradeClick}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all text-xs shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isPremium
                      ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border border-yellow-400/50 shadow-yellow-500/25'
                      : 'bg-white/25 backdrop-blur-md text-white border border-white/40 hover:bg-white/35'
                  }`}
                >
                  <Star className={`${ICON_SIZES.SM} ${isPremium ? 'fill-current' : ''}`} />
                  <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

      </div>

      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribed}
        />
      )}

    </>
  );
}
