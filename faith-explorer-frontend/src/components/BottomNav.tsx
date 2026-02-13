import { Home, Bookmark, Settings, Compass, BookOpen } from 'lucide-react';

type Tab = 'search' | 'read' | 'saved' | 'learn';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSettingsClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-200 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 4px)' }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-stretch justify-around">
          <button
            onClick={() => onTabChange('search')}
            className={`flex items-center justify-center flex-1 min-h-[44px] py-2 transition-colors active:opacity-70 ${activeTab === 'search'
              ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
              : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600'
              }`}
          >
            <Home className="w-6 h-6" />
          </button>

          <button
            onClick={() => onTabChange('read')}
            className={`flex items-center justify-center flex-1 min-h-[44px] py-2 transition-colors active:opacity-70 ${activeTab === 'read'
              ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
              : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600'
              }`}
          >
            <BookOpen className="w-6 h-6" />
          </button>

          <button
            onClick={() => onTabChange('saved')}
            className={`flex items-center justify-center flex-1 min-h-[44px] py-2 transition-colors active:opacity-70 ${activeTab === 'saved'
              ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
              : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600'
              }`}
          >
            <Bookmark className="w-6 h-6" />
          </button>

          <button
            onClick={() => onTabChange('learn')}
            className={`flex items-center justify-center flex-1 min-h-[44px] py-2 transition-colors active:opacity-70 ${activeTab === 'learn'
              ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
              : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600'
              }`}
          >
            <Compass className="w-6 h-6" />
          </button>

          <button
            onClick={onSettingsClick}
            className="flex items-center justify-center flex-1 min-h-[44px] py-2 text-gray-500 dark:text-gray-400 sepia:text-amber-600 transition-colors active:opacity-70"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
}
