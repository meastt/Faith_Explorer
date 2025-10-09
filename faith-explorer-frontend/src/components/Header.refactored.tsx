import { BookOpen, Star, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';
import { About } from './About';
import { Settings } from './Settings';
import { UsageStatusIndicator } from './UsageStatusIndicator';
import { HeaderMenu } from './HeaderMenu';
import { useModalManager } from '../hooks/useModalManager';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { ICON_SIZES } from '../styles/design-system';

export function Header() {
  const { usage } = useStore();
  const { isPremium } = usage;
  const { isOpen, openModal, closeModal, toggleModal } = useModalManager();

  const swipeHandlers = useSwipeGesture({
    onSwipeUp: () => closeModal('mobileMenu'),
  });

  const handleUpgradeClick = () => {
    if (isPremium) {
      // TODO: Replace with proper toast notification
      alert('Your subscription is active! To manage or cancel, go to Settings > [Your Name] > Subscriptions on your device.');
    } else {
      openModal('subscription');
    }
  };

  const menuItems = [
    { label: 'About', onClick: () => { closeModal('mobileMenu'); closeModal('desktopMenu'); openModal('about'); } },
    { label: 'Settings', onClick: () => { closeModal('mobileMenu'); closeModal('desktopMenu'); openModal('settings'); } },
  ];

  const handleMenuToggle = () => {
    const isMobile = window.innerWidth < 640;
    toggleModal(isMobile ? 'mobileMenu' : 'desktopMenu');
  };

  const upgradeButtonClasses = isPremium
    ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border border-yellow-400/50 shadow-yellow-500/25'
    : 'bg-white/25 backdrop-blur-md text-white border border-white/40 hover:bg-white/35';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 shadow-md">
        <header className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700">
          {/* Decorative Pattern - extracted to Tailwind utility or CSS class in production */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_2px_2px,white_1px,transparent_0)] bg-[length:32px_32px]" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

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
                  className={`hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all text-xs shadow-lg hover:shadow-xl transform hover:scale-105 ${upgradeButtonClasses}`}
                >
                  <Star className={`${ICON_SIZES.SM} ${isPremium ? 'fill-current' : ''}`} />
                  <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
                </button>

                <button
                  onClick={handleMenuToggle}
                  className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/25 transition-all backdrop-blur-sm border border-white/20"
                  aria-label={isOpen('mobileMenu') || isOpen('desktopMenu') ? 'Close menu' : 'Open menu'}
                >
                  {(isOpen('mobileMenu') || isOpen('desktopMenu')) ? 
                    <X className={`${ICON_SIZES.MD} text-white`} /> : 
                    <Menu className={`${ICON_SIZES.MD} text-white`} />
                  }
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isOpen('mobileMenu') && (
          <HeaderMenu items={menuItems} className="sm:hidden" {...swipeHandlers}>
            {/* Swipe indicator */}
            <div className="pt-2 pb-3 flex justify-center">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>
            <button
              onClick={() => { closeModal('mobileMenu'); handleUpgradeClick(); }}
              className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all text-sm mb-2 ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              <Star className={`${ICON_SIZES.SM} ${isPremium ? 'fill-current' : ''}`} />
              <span>{isPremium ? 'Pro' : 'Go Pro'}</span>
            </button>
          </HeaderMenu>
        )}

        {/* Desktop Menu */}
        {isOpen('desktopMenu') && (
          <HeaderMenu items={menuItems} className="hidden sm:block" />
        )}
      </div>

      {/* Modals */}
      {isOpen('subscription') && (
        <SubscriptionModal
          onClose={() => closeModal('subscription')}
          onSubscribe={() => closeModal('subscription')}
        />
      )}

      {isOpen('about') && (
        <About onClose={() => closeModal('about')} />
      )}

      {isOpen('settings') && (
        <Settings onClose={() => closeModal('settings')} />
      )}
    </>
  );
}

