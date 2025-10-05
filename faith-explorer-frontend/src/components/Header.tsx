import { BookOpen, Star } from 'lucide-react';
import { useStore } from '../store/useStore';

export function Header() {
  const { usage, setPremium } = useStore();
  const { isPremium, searchesUsed, searchLimit, chatMessagesUsed, chatLimit } = usage;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Faith Explorer</h1>
              <p className="text-sm text-gray-500">Explore sacred texts across traditions</p>
            </div>
          </div>

          {/* Usage & Premium */}
          <div className="flex items-center space-x-4">
            {!isPremium && (
              <div className="text-right text-sm text-gray-500">
                <div>{searchLimit - searchesUsed} searches left</div>
                <div>{chatLimit - chatMessagesUsed} chats left</div>
              </div>
            )}
            
            <button
              onClick={() => setPremium(!isPremium)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isPremium
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Star className="w-4 h-4" />
              <span>{isPremium ? 'Premium' : 'Upgrade'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
