import { BookOpen, Crown } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium, searchesUsed, searchLimit, chatMessagesUsed, chatLimit } = usage;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-sage-200 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl blur opacity-20"></div>
              <div className="relative bg-gradient-to-br from-primary-600 to-primary-700 p-2 sm:p-2.5 rounded-xl shadow-soft">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-sage-900 to-sage-700 bg-clip-text text-transparent">
                Faith Explorer
              </h1>
              <p className="hidden sm:block text-xs text-sage-500 font-medium">Discover Sacred Wisdom</p>
            </div>
          </div>

          {/* Premium CTA */}
          <div className="flex items-center gap-3 sm:gap-4">
            {!isPremium && (
              <div className="hidden md:flex flex-col items-end text-xs">
                <div className="text-sage-600 font-medium">
                  {searchLimit - searchesUsed} searches left
                </div>
                <div className="text-sage-500">
                  {chatLimit - chatMessagesUsed} chat messages
                </div>
              </div>
            )}

            <button
              onClick={() => setPremium(!isPremium)}
              className={`group relative overflow-hidden px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base shadow-soft hover:shadow-soft-lg transition-all duration-300 ${
                isPremium
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-white'
                  : 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800'
              }`}
            >
              {isPremium ? (
                <>
                  <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-400 opacity-0 group-hover:opacity-20 transition-opacity"></span>
                  <div className="relative flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Premium Active</span>
                    <span className="sm:hidden">Premium</span>
                  </div>
                </>
              ) : (
                <>
                  <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                  <div className="relative flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span className="hidden sm:inline">Upgrade to Premium</span>
                    <span className="sm:hidden">Upgrade</span>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
