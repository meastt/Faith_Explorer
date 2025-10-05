import { Search } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { isSearching, viewMode, selectedReligions, usage } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      // Check if user has exceeded search limit
      const { isPremium, searchesUsed, searchLimit } = usage;
      if (!isPremium && searchesUsed >= searchLimit) {
        alert('You have reached your free search limit. Please upgrade to Premium for unlimited searches.');
        return;
      }

      if (viewMode === 'comparison' && selectedReligions.length < 2) {
        alert('Please select at least 2 religions to compare');
        return;
      }

      if (selectedReligions.length === 0) {
        alert('Please select at least one religion');
        return;
      }

      onSearch(query.trim());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-6 shadow-soft">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 sepia:text-amber-600" />
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
            className="block w-full pl-12 pr-24 py-4 border border-gray-300 dark:border-gray-600 sepia:border-amber-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-gray-100 sepia:text-amber-900 dark:bg-gray-700 sepia:bg-amber-100 placeholder-gray-500 dark:placeholder-gray-400 sepia:placeholder-amber-600 transition-all duration-200"
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
      </form>
    </div>
  );
}
