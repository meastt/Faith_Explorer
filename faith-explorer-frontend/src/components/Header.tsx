import { BookOpen, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium, searchesUsed, searchLimit, chatMessagesUsed, chatLimit } = usage;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-primary-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faith Explorer</h1>
              <p className="text-sm text-gray-600">Explore sacred texts across traditions</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isPremium && (
              <div className="text-sm text-gray-600">
                <div>Searches: {searchesUsed}/{searchLimit}</div>
                <div>Chat: {chatMessagesUsed}/{chatLimit}</div>
              </div>
            )}

            <button
              onClick={() => setPremium(!isPremium)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                isPremium
                  ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {isPremium ? 'Premium Active' : 'Upgrade to Premium'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
