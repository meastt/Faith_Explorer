import { BookOpen, Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { ReadingPreferences } from './ReadingPreferences';
import { revenueCat } from '../services/revenuecat';

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
      <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 sticky top-0 z-50 shadow-lg pt-safe">
        {/* Decorative Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg border border-white/30">
                <BookOpen className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Faith Explorer</h1>
                <p className="text-xs text-white/80 -mt-0.5">Sacred wisdom across traditions</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1.5">
              <ReadingPreferences />

              <button
                onClick={handleUpgradeClick}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all text-xs shadow-md ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border border-yellow-400/50 shadow-yellow-500/25'
                    : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 hover:shadow-lg'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isPremium ? 'fill-current' : ''}`} />
                <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
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
