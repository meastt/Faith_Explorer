import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const { isSearching, canSearch, usage } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      if (!canSearch()) {
        alert('You have reached your free search limit.');
        return;
      }
      onSearch(query.trim());
    }
  };

  return (
    <div className="relative mt-2">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-bronze-200 via-sand-300 to-bronze-200 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
        
        <div className="relative bg-white dark:bg-stone-800 rounded-2xl shadow-paper flex items-center p-2 border border-sand-200 dark:border-stone-700">
          
          <div className="pl-4 pr-3 text-bronze-500 dark:text-bronze-400">
            {isSearching ? <Sparkles className="w-6 h-6 animate-pulse" /> : <Search className="w-6 h-6" />}
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question of the texts (e.g., 'Why do we suffer?')"
            className="flex-1 bg-transparent border-none focus:ring-0 text-stone-800 dark:text-stone-100 text-lg placeholder-stone-400 font-medium py-3"
            disabled={isSearching}
          />

          <button
            type="submit"
            disabled={!query.trim() || isSearching}
            className={`p-3 rounded-xl transition-all duration-200 ${
              query.trim() && !isSearching
                ? 'bg-bronze-500 text-white shadow-md hover:bg-bronze-600 transform hover:scale-105'
                : 'bg-sand-100 text-sand-400 dark:bg-stone-700 dark:text-stone-500'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>

      {/* Usage Meter */}
      {!usage.isPremium && (
        <div className="mt-3 px-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-stone-500 dark:text-stone-400 font-medium">
              Free searches remaining
            </span>
            <span className="text-bronze-600 dark:text-bronze-400 font-bold">
              {Math.max(0, usage.searchLimit - usage.searchesUsed)} / {usage.searchLimit}
            </span>
          </div>
          <div className="h-1.5 bg-sand-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-bronze-500 to-bronze-600 rounded-full transition-all duration-500"
              style={{
                width: `${Math.max(0, ((usage.searchLimit - usage.searchesUsed) / usage.searchLimit) * 100)}%`
              }}
            />
          </div>
        </div>
      )}

      <div className="text-center mt-3">
        <p className="text-xs text-stone-400 dark:text-stone-500 font-medium tracking-wide">
          AI-POWERED • SCRIPTURE-BACKED • INTERFAITH
        </p>
      </div>
    </div>
  );
}