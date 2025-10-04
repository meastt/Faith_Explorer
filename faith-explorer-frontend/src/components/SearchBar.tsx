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
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            viewMode === 'single'
              ? 'Search for topics, questions, or keywords...'
              : 'Compare what different religions say about...'
          }
          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>

      {!usage.isPremium && (
        <div className="mt-2 text-sm text-gray-600">
          {usage.searchLimit - usage.searchesUsed} searches remaining this month
        </div>
      )}
    </form>
  );
}
