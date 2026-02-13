import { Zap } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTranslation } from 'react-i18next';

interface UsageStatusIndicatorProps {
  onClick?: () => void;
}

export function UsageStatusIndicator({ onClick }: UsageStatusIndicatorProps) {
  const { usage } = useStore();
  const { searchesUsed, searchLimit, isPremium } = usage;
  const { t } = useTranslation('common');

  const remaining = searchLimit - searchesUsed;

  // Determine color based on remaining searches
  let statusColor: string;
  let statusText: string;

  if (isPremium) {
    statusColor = 'text-purple-600 dark:text-purple-400 sepia:text-purple-700';
    statusText = t('usage.premium');
  } else if (remaining > 5) {
    statusColor = 'text-green-600 dark:text-green-400 sepia:text-green-700';
    statusText = `${remaining} ${t('usage.leftSuffix')}`;
  } else if (remaining > 2) {
    statusColor = 'text-yellow-600 dark:text-yellow-400 sepia:text-yellow-700';
    statusText = `${remaining} ${t('usage.leftSuffix')}`;
  } else {
    statusColor = 'text-red-600 dark:text-red-400 sepia:text-red-700';
    statusText = `${remaining} ${t('usage.leftSuffix')}`;
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-lg border border-gray-200 dark:border-gray-700 sepia:border-amber-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 transition-colors cursor-pointer"
    >
      <Zap className={`w-4 h-4 ${statusColor}`} />
      <span className={`text-sm font-medium ${statusColor}`}>
        {statusText}
      </span>
    </button>
  );
}
