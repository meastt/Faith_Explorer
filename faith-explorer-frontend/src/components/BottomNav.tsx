import { Home, Bookmark, Settings } from 'lucide-react';

type Tab = 'search' | 'saved';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  onSettingsClick: () => void;
}

export function BottomNav({ activeTab, onTabChange, onSettingsClick }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-200 pb-safe z-40">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-around h-14 py-1">
          {/* Home / Search Tab */}
          <button
            onClick={() => onTabChange('search')}
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
              activeTab === 'search'
                ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">Home</span>
          </button>

          {/* Saved Tab */}
          <button
            onClick={() => onTabChange('saved')}
            className={`flex flex-col items-center justify-center flex-1 gap-1 transition-colors ${
              activeTab === 'saved'
                ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800'
            }`}
          >
            <Bookmark className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">Saved</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onSettingsClick}
            className="flex flex-col items-center justify-center flex-1 gap-1 text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 transition-colors"
          >
            <Settings className="w-6 h-6" />
            <span className="text-[10px] font-medium leading-none">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

