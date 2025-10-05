import { X, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { revenueCat } from '../services/revenuecat';

interface SubscriptionModalProps {
  onClose: () => void;
  onSubscribe: () => void;
}

export function SubscriptionModal({ onClose, onSubscribe }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await revenueCat.purchaseSubscription('premium_monthly');
      onSubscribe();
      onClose();
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to process subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upgrade to Premium</h2>
          <p className="text-gray-600">Unlock unlimited access to Faith Explorer</p>
        </div>

        <div className="space-y-4 mb-8">
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

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-4 mb-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl font-bold text-gray-900">$9.99</span>
            <span className="text-gray-600">/month</span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-1">Cancel anytime</p>
        </div>

        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          {isLoading ? 'Processing...' : 'Subscribe Now'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          Subscription managed through RevenueCat. Cancel anytime from your account settings.
        </p>
      </div>
    </div>
  );
}
