import { X, Star, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { ICON_SIZES, Z_INDEX } from '../styles/design-system';
import { Capacitor } from '@capacitor/core';

interface ReviewPromptModalProps {
  onClose: () => void;
}

export function ReviewPromptModal({ onClose }: ReviewPromptModalProps) {
  const { setReviewPromptShown, setReviewPromptStatus } = useStore();

  const handleReview = async () => {
    setReviewPromptShown();
    setReviewPromptStatus('reviewed');
    
    const APP_STORE_ID = '6745939537';
    
    // Check if we're on a native iOS device
    if (Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios') {
      // On real iOS devices, use the App Store URL scheme
      // This will exit the app and open the App Store review page
      const appStoreUrl = `itms-apps://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
      window.location.href = appStoreUrl;
      
      console.log('Opening App Store on iOS device:', appStoreUrl);
    } else {
      // For simulator, web, or development
      // Open in web browser as fallback
      const webUrl = `https://apps.apple.com/app/id${APP_STORE_ID}?action=write-review`;
      window.open(webUrl, '_blank');
      
      console.log('Opening App Store in browser (simulator/web):', webUrl);
      alert('In the simulator, this opens in browser. On a real device, it opens the App Store app.');
    }
    
    onClose();
  };

  const handleMaybeLater = () => {
    setReviewPromptShown();
    setReviewPromptStatus('later');
    onClose();
  };

  const handleDismiss = () => {
    setReviewPromptShown();
    setReviewPromptStatus('dismissed');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}
      onClick={handleDismiss}
    >
      <div 
        className="bg-[var(--bg-secondary)] rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative border border-[var(--border-primary)]"
        style={{ zIndex: Z_INDEX.MODAL }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] hover:opacity-80 transition-opacity"
          aria-label="Close"
        >
          <X className={`${ICON_SIZES.MD} text-[var(--text-secondary)]`} />
        </button>

        {/* Header with icon */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            Light the Path for Others 🌟
          </h2>
        </div>

        {/* Body message */}
        <div className="mb-8 space-y-4">
          <p className="text-[var(--text-primary)] text-center leading-relaxed">
            You just saved insights that resonated with you. Help other seekers discover these same teachings by sharing your experience with Faith Explorer.
          </p>
          <p className="text-[var(--text-secondary)] text-center text-sm">
            Your review helps spiritual explorers worldwide find this interfaith resource.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handleReview}
            className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white rounded-xl font-semibold hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Star className={ICON_SIZES.MD} fill="currentColor" />
            Leave a Review
          </button>

          <button
            onClick={handleMaybeLater}
            className="w-full py-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors bg-[var(--bg-tertiary)] hover:bg-[var(--bg-tertiary)]/80 rounded-xl"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}

