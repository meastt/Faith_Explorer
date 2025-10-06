import { BookOpen, Star, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { About } from './About';
import { Settings } from './Settings';
import { UsageStatusIndicator } from './UsageStatusIndicator';
import { revenueCat } from '../services/revenuecat';
import { ICON_SIZES } from '../styles/design-system';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium } = usage;
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDesktopMenu, setShowDesktopMenu] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

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

  // Swipe gesture handlers
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;

    if (isUpSwipe) {
      setShowMobileMenu(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 shadow-lg">
          {/* Decorative Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 pt-safe">
            <div className="flex items-center justify-between h-16">
              {/* Logo & Title */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg border border-white/30">
                  <BookOpen className={`${ICON_SIZES.SM} text-white`} strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-base font-bold text-white tracking-tight">Faith Explorer</h1>
                  <p className="text-xs text-white/70 -mt-0.5 hidden sm:block">Sacred wisdom across traditions</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1.5">
                <UsageStatusIndicator onClick={handleUpgradeClick} />
                <button
                  onClick={handleUpgradeClick}
                  className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all text-xs shadow-md ${
                    isPremium
                      ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border border-yellow-400/50 shadow-yellow-500/25'
                      : 'bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/30 hover:shadow-lg'
                  }`}
                >
                  <Star className={`${ICON_SIZES.SM} ${isPremium ? 'fill-current' : ''}`} />
                  <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
                </button>

                {/* Menu Button - All screens */}
                <button
                  onClick={() => {
                    setShowMobileMenu(!showMobileMenu);
                    setShowDesktopMenu(!showDesktopMenu);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/20 transition-colors"
                >
                  {(showMobileMenu || showDesktopMenu) ? <X className={`${ICON_SIZES.MD} text-white`} /> : <Menu className={`${ICON_SIZES.MD} text-white`} />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            className="sm:hidden bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-300 shadow-lg animate-slide-down"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Swipe indicator */}
            <div className="pt-2 pb-1 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleUpgradeClick();
                }}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                <Star className={`${ICON_SIZES.SM} ${isPremium ? 'fill-current' : ''}`} />
                <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowAbout(true);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 sepia:text-amber-800 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">About</span>
                </button>
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowSettings(true);
                  }}
                  className="flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 sepia:text-amber-800 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
                >
                  <span className="text-sm font-medium">Settings</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Menu Dropdown */}
        {showDesktopMenu && (
          <div className="hidden sm:block bg-white dark:bg-gray-800 sepia:bg-amber-50 border-b border-gray-200 dark:border-gray-700 sepia:border-amber-300 shadow-lg animate-slide-down">
            <div className="max-w-4xl mx-auto px-4 py-3">
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowDesktopMenu(false);
                    setShowAbout(true);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 sepia:text-amber-800 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    setShowDesktopMenu(false);
                    setShowSettings(true);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 sepia:text-amber-800 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={handleSubscribed}
        />
      )}

      {showAbout && (
        <About onClose={() => setShowAbout(false)} />
      )}

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)} />
      )}
    </>
  );
}
