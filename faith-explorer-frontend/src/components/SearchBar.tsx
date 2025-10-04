import { Search, Sparkles } from 'lucide-react';
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

  const remainingSearches = usage.searchLimit - usage.searchesUsed;
  const isLowOnSearches = !usage.isPremium && remainingSearches <= 5;

  return (
    <div className="bg-white rounded-2xl shadow-soft border border-sage-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-sage-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              viewMode === 'single'
                ? 'Search for wisdom, guidance, or specific teachings...'
                : 'Compare perspectives on love, forgiveness, compassion...'
            }
            className="w-full pl-12 pr-32 py-4 text-base bg-sage-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 placeholder-sage-400 text-sage-900 transition-all duration-200"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Searching...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </>
            )}
          </button>
        </div>

        {!usage.isPremium && (
          <div className={`mt-3 flex items-center justify-between text-xs ${
            isLowOnSearches ? 'text-amber-700' : 'text-sage-600'
          }`}>
            <div className="flex items-center gap-1.5">
              {isLowOnSearches && <Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              <span className="font-medium">
                {remainingSearches} free {remainingSearches === 1 ? 'search' : 'searches'} remaining
              </span>
            </div>
            {isLowOnSearches && (
              <span className="text-primary-600 font-semibold hover:text-primary-700 cursor-pointer">
                Upgrade →
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  );
}
