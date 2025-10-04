import { Search as SearchIcon } from 'lucide-react';
import type { Religion, Verse } from '../types';
import { VerseCard } from './VerseCard';
import { useStore } from '../store/useStore';
import { RELIGIONS } from '../types';

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
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <p className="mt-6 text-sage-600 font-medium">Searching sacred texts...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Single religion view
  if (viewMode === 'single') {
    const { religion, verses } = results[0];
    const religionInfo = RELIGIONS.find((r) => r.id === religion);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sage-900">Search Results</h2>
            <p className="text-sm text-sage-600 mt-1">
              {verses.length} {verses.length === 1 ? 'verse' : 'verses'} found in {religionInfo?.name}
            </p>
          </div>
        </div>

        {verses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft border border-sage-200 p-12 sm:p-16 text-center">
            <div className="w-20 h-20 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-sage-400" />
            </div>
            <h3 className="text-xl font-bold text-sage-900 mb-2">No Results Found</h3>
            <p className="text-sage-600 max-w-md mx-auto">
              Try different keywords or phrases to discover relevant verses
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
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
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-sage-900">Comparison Results</h2>
        <p className="text-sm text-sage-600 mt-1">
          Exploring perspectives across {results.length} traditions
        </p>
      </div>

      {results.map(({ religion, verses }) => {
        const religionInfo = RELIGIONS.find((r) => r.id === religion);
        
        return (
          <div key={religion} className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b-2" style={{ borderColor: religionInfo?.color }}>
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-soft flex-shrink-0"
                style={{ backgroundColor: `${religionInfo?.color}15` }}
              >
                <span className="text-xl font-bold" style={{ color: religionInfo?.color }}>
                  {religionInfo?.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold" style={{ color: religionInfo?.color }}>
                  {religionInfo?.name}
                </h3>
                <p className="text-sm text-sage-600">
                  {verses.length} {verses.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>

            {/* Verses */}
            {verses.length === 0 ? (
              <div className="bg-sage-50 border border-sage-200 rounded-xl p-6 text-center">
                <p className="text-sm text-sage-600">
                  No results found in {religionInfo?.name}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
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
        );
      })}
    </div>
  );
}
