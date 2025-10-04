import { Loader2 } from 'lucide-react';
import type { Religion, Verse } from '../types';
import { VerseCard } from './VerseCard';
import { useStore } from '../store/useStore';

interface SearchResultsProps {
  results: {
    religion: Religion;
    verses: Verse[];
  }[];
  isLoading: boolean;
}

export function SearchResults({ results, isLoading }: SearchResultsProps) {
  const { setActiveVerseChat, viewMode } = useStore();

  const handleChatClick = (verse: Verse, religion: Religion) => {
    setActiveVerseChat({
      verseReference: verse.reference,
      verseText: verse.text,
      religion,
      messages: [],
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Single religion view
  if (viewMode === 'single') {
    const { religion, verses } = results[0];
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          Search Results ({verses.length})
        </h2>
        {verses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-600">
            No verses found for your search. Try different keywords.
          </div>
        ) : (
          <div className="space-y-4">
            {verses.map((verse, idx) => (
              <VerseCard
                key={`${verse.reference}-${idx}`}
                verse={verse}
                religion={religion}
                onChatClick={() => handleChatClick(verse, religion)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Comparison view
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">
        Comparison Results
      </h2>

      {results.map(({ religion, verses }) => (
        <div key={religion} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span className="w-1 h-6 rounded" style={{ backgroundColor: '#6B7280' }}></span>
            {religion.charAt(0).toUpperCase() + religion.slice(1)} ({verses.length} results)
          </h3>

          {verses.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              No results found in {religion}
            </div>
          ) : (
            <div className="space-y-3">
              {verses.map((verse, idx) => (
                <VerseCard
                  key={`${religion}-${verse.reference}-${idx}`}
                  verse={verse}
                  religion={religion}
                  onChatClick={() => handleChatClick(verse, religion)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
