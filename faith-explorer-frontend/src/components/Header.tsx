import { Star, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { revenueCat } from '../services/revenuecat';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium } = usage;
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    const publicKey = import.meta.env.VITE_REVENUECAT_PUBLIC_KEY;
    if (publicKey && !publicKey.includes('your_revenuecat')) {
      revenueCat.initialize(publicKey);
      revenueCat.getSubscriptionStatus().then(status => setPremium(status.isSubscribed));
    }
  }, [setPremium]);

  const handleUpgradeClick = () => {
    if (!isPremium) setShowSubscriptionModal(true);
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphism Header */}
        <header className="relative bg-sand-50/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-sand-200 dark:border-stone-800">
          <div className="max-w-4xl mx-auto px-4 pt-safe">
            <div className="flex items-center justify-between h-16">
              
              {/* Brand */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-bronze-500 text-white rounded-full flex items-center justify-center shadow-glow">
                  <span className="font-serif font-bold text-lg">F</span>
                </div>
                <div>
                  <h1 className="font-serif text-xl font-bold text-stone-800 dark:text-stone-100 leading-none">
                    Faith Explorer
                  </h1>
                  <p className="text-[10px] font-medium text-bronze-600 dark:text-bronze-400 tracking-widest uppercase mt-0.5">
                    Wisdom of Ages
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpgradeClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                    isPremium
                      ? 'text-bronze-700 bg-bronze-100 dark:bg-bronze-900/30 dark:text-bronze-300 border border-bronze-200'
                      : 'bg-stone-900 text-white shadow-float hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{isPremium ? 'Premium' : 'Upgrade'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => setPremium(true)}
        />
      )}
    </>
  );
}