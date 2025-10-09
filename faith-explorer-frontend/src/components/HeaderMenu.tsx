import type { ReactNode } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface HeaderMenuProps {
  items: MenuItem[];
  className?: string;
  children?: ReactNode;
}

export function HeaderMenu({ items, className = '', children }: HeaderMenuProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 sepia:bg-amber-50 border-t border-gray-200 dark:border-gray-700 sepia:border-amber-300 shadow-lg animate-slide-down ${className}`}>
      <div className="max-w-4xl mx-auto px-4 py-3">
        {children}
        <div className="flex flex-col space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={item.onClick}
              className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 sepia:text-amber-800 hover:bg-gray-100 dark:hover:bg-gray-700 sepia:hover:bg-amber-200 rounded-lg transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

