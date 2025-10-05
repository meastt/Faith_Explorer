import { X, Heart, BookOpen, Users, Globe, Shield, ExternalLink } from 'lucide-react';

interface AboutProps {
  onClose: () => void;
}

export function About({ onClose }: AboutProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">About Faith Explorer</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Version 1.0.0</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Mission */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Our Mission</h3>
            <p className="text-gray-700 dark:text-gray-300 sepia:text-amber-800 leading-relaxed">
              Faith Explorer is designed to bridge understanding between different religious traditions by providing 
              easy access to sacred texts and wisdom from around the world. We believe that by exploring diverse 
              perspectives on life's most important questions, we can foster greater understanding, respect, and 
              compassion in our global community.
            </p>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Sacred Texts</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Access to authentic translations of major religious texts</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
                <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Comparative Study</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Compare perspectives across different traditions</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
                <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">AI Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Get contextual understanding with AI assistance</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 rounded-lg">
                <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Respectful Approach</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Honoring the sacred nature of all traditions</p>
                </div>
              </div>
            </div>
          </div>

          {/* Traditions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">Supported Traditions</h3>
            <div className="flex flex-wrap gap-2">
              {['Christianity', 'Islam', 'Judaism', 'Hinduism', 'Buddhism', 'Sikhism', 'Taoism', 'Confucianism', 'Shinto'].map((tradition) => (
                <span
                  key={tradition}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 sepia:bg-amber-200 text-indigo-800 dark:text-indigo-200 sepia:text-amber-800 rounded-full text-sm font-medium"
                >
                  {tradition}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-300">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>for interfaith understanding</span>
            </div>
            <p className="text-center text-xs text-gray-500 dark:text-gray-500 sepia:text-amber-600 mt-2">
              © 2024 Faith Explorer. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}