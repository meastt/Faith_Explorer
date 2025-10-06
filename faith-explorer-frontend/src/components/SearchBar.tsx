import { Search } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ICON_SIZES } from '../styles/design-system';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { isSearching, viewMode, selectedSubsets, usage } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      // Check if user has exceeded search limit
      const { isPremium, searchesUsed, searchLimit } = usage;
      if (!isPremium && searchesUsed >= searchLimit) {
        alert('You\'ve reached your free search limit (10/month). Upgrade to Premium for unlimited searches starting at just $4.99/month!');
        return;
      }

      if (viewMode === 'comparison' && selectedSubsets.length < 2) {
        alert('Please select at least 2 religious texts to compare');
        return;
      }

      if (selectedSubsets.length === 0) {
        alert('Please select at least one religious text');
        return;
      }

      onSearch(query.trim());
      setQuery(''); // Clear input after search
    }
  };

  return (
    <div className="bg-white dark:bg-gradient-to-br dark:from-blue-950 dark:to-indigo-950 sepia:from-amber-50 sepia:to-orange-100 rounded-2xl border border-gray-200 dark:border-blue-800 sepia:border-amber-300 p-6 shadow-soft">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className={`${ICON_SIZES.MD} text-gray-400 dark:text-gray-500 sepia:text-amber-600`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              viewMode === 'single'
                ? 'Search for wisdom, guidance, or teachings...'
                : 'Compare perspectives across traditions...'
            }
            className="block w-full pl-12 pr-24 py-4 border border-gray-200 dark:border-gray-600 sepia:border-amber-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 sepia:text-amber-900 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 placeholder-gray-400 dark:placeholder-gray-400 sepia:placeholder-amber-600 transition-all duration-200"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className={`inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              isSearching || !query.trim()
                ? 'text-gray-400 dark:text-gray-600 sepia:text-amber-500 cursor-not-allowed'
                : 'text-primary-600 dark:text-primary-400 sepia:text-amber-700 hover:text-primary-700 dark:hover:text-primary-300 sepia:hover:text-amber-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 sepia:hover:bg-amber-100'
            }`}>
              {isSearching ? 'Searching...' : 'Search'}
            </span>
          </button>
        </div>
        {!isSearching && query.trim() && (
          <div className="mt-2 flex items-center justify-end gap-2 text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-600">
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 sepia:bg-amber-100 border border-gray-300 dark:border-gray-600 sepia:border-amber-300 rounded font-mono text-gray-700 dark:text-gray-300 sepia:text-amber-800">
              Enter
            </kbd>
            <span>to search</span>
          </div>
        )}
      </form>
    </div>
  );
}
