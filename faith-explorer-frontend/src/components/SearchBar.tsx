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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
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
            className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <span className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md ${
              isSearching || !query.trim()
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:text-blue-500'
            }`}>
              {isSearching ? 'Searching...' : 'Search'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
