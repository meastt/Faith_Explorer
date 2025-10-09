import { Home, Bookmark, Settings } from 'lucide-react';
import { ICON_SIZES } from '../styles/design-system';

type Tab = 'search' | 'saved';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSettingsClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-200 pb-safe z-40">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Home / Search Tab */}
          <button
            onClick={() => onTabChange('search')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800'
            }`}
          >
            <Home className={ICON_SIZES.LG} />
            <span className="text-xs font-medium mt-1">Home</span>
          </button>

          {/* Saved Tab */}
          <button
            onClick={() => onTabChange('saved')}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              activeTab === 'saved'
                ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800'
            }`}
          >
            <Bookmark className={ICON_SIZES.LG} />
            <span className="text-xs font-medium mt-1">Saved</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            className="flex flex-col items-center justify-center flex-1 h-full text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 transition-colors"
          >
            <Settings className={ICON_SIZES.LG} />
            <span className="text-xs font-medium mt-1">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

