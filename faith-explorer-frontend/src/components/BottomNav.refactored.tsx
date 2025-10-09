import { Home, Bookmark, Settings } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export type NavTab = 'search' | 'saved' | 'settings';

interface NavItem {
  id: NavTab;
  icon: LucideIcon;
  label: string;
}

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'search', icon: Home, label: 'Home' },
  { id: 'saved', icon: Bookmark, label: 'Saved' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const getTabStyles = (isActive: boolean) => 
  cn(
    'flex flex-col items-center justify-center flex-1 gap-0.5 transition-colors',
    isActive
      ? 'text-indigo-600 dark:text-indigo-400 sepia:text-amber-700'
      : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800'
  );

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-200 pb-safe z-40"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-around h-11 py-1">
          {NAV_ITEMS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={getTabStyles(activeTab === id)}
              aria-label={label}
              aria-current={activeTab === id ? 'page' : undefined}
            >
              <Icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-[9px] font-medium leading-none">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

