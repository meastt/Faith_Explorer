import { LucideIcon } from 'lucide-react';
import { ICON_SIZES } from '../styles/design-system';

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

export function TabButton({ active, onClick, icon: Icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
        active
          ? 'bg-white dark:bg-gray-800 sepia:bg-amber-100 text-gray-900 dark:text-gray-100 sepia:text-amber-900 shadow-soft border border-gray-200 dark:border-gray-700 sepia:border-amber-200'
          : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-white/50 dark:hover:bg-gray-800/50 sepia:hover:bg-amber-100/50 hover:shadow-soft'
      }`}
    >
      <Icon className={ICON_SIZES.SM} />
      <span>{label}</span>
    </button>
  );
}
