import { Star, Flame } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { revenueCat } from '../services/revenuecat';

export function Header() {
  const { usage, setPremium, streak, updateStreak, useStreakFreeze, checkAndUnlockBadges } = useStore();
  const { isPremium } = usage;
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showStreakFreeze, setShowStreakFreeze] = useState(false);

  // Update streak when component mounts
  useEffect(() => {
    updateStreak();
    // Check for streak-based badge unlocks
    checkAndUnlockBadges();
  }, [updateStreak, checkAndUnlockBadges]);

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

  const handleStreakClick = () => {
    // Check if streak is broken and freeze is available
    const today = new Date().toISOString().split('T')[0];
    const lastActive = streak.lastActiveDate;
    if (lastActive) {
      const diffDays = Math.floor((new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 2 && isPremium && streak.freezesAvailable > 0) {
        setShowStreakFreeze(true);
      }
    }
  };

  const applyStreakFreeze = () => {
    const success = useStreakFreeze();
    if (success) {
      updateStreak();
      setShowStreakFreeze(false);
    }
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
                  <p className="text-xs font-medium text-bronze-700 dark:text-bronze-400 tracking-widest uppercase mt-0.5">
                    Wisdom of Ages
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                {/* Usage Meter for Free Users */}
                {!isPremium && (
                  <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sand-100 dark:bg-stone-800 border border-sand-200 dark:border-stone-700">
                    <span className="text-xs font-medium text-stone-600 dark:text-stone-400">
                      {Math.max(0, usage.searchLimit - usage.searchesUsed)} free searches
                    </span>
                  </div>
                )}

                {/* Streak Counter */}
                {streak.current > 0 && (
                  <button
                    onClick={handleStreakClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-100 to-bronze-100 dark:from-gold-900/20 dark:to-bronze-900/20 border border-gold-200 dark:border-gold-800 transition-all duration-300 hover:scale-105"
                    title={`Longest: ${streak.longest} days${isPremium && streak.freezesAvailable > 0 ? ` • ${streak.freezesAvailable} freeze available` : ''}`}
                  >
                    <Flame className="w-4 h-4 text-bronze-600 dark:text-bronze-400" />
                    <span className="text-sm font-bold text-bronze-800 dark:text-bronze-200">
                      {streak.current}
                    </span>
                  </button>
                )}

                <button
                  onClick={handleUpgradeClick}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shadow-sm ${isPremium
                    ? 'text-bronze-700 bg-bronze-100 dark:bg-bronze-900/30 dark:text-bronze-300 border border-bronze-200'
                    : 'bg-gradient-to-r from-bronze-600 to-gold-600 text-white hover:from-bronze-700 hover:to-gold-700 shadow-gold-500/20'
                    }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span className="font-bold tracking-wide">{isPremium ? 'Premium' : 'Upgrade'}</span>
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

      {/* Streak Freeze Modal */}
      {showStreakFreeze && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-sand-50 dark:bg-stone-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-sand-200 dark:border-stone-700">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-bronze-100 dark:from-gold-900/30 dark:to-bronze-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold-300 dark:border-gold-700">
                <Flame className="w-8 h-8 text-bronze-600 dark:text-bronze-400" />
              </div>
              <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-2 font-serif">
                Streak Freeze Available!
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400 mb-6">
                You missed yesterday, but you can use your monthly streak freeze (Premium perk) to keep your {streak.current}-day streak alive!
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowStreakFreeze(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-sand-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-medium hover:bg-sand-100 dark:hover:bg-stone-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={applyStreakFreeze}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-bronze-500 to-gold-500 text-white font-medium hover:from-bronze-600 hover:to-gold-600 transition-all shadow-md hover:shadow-lg"
                >
                  Use Freeze
                </button>
              </div>

              <p className="text-xs text-stone-500 dark:text-stone-400 mt-4">
                You have {streak.freezesAvailable} freeze{streak.freezesAvailable !== 1 ? 's' : ''} available this month
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}