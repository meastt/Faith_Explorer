import { Search as SearchIcon, Sparkles } from 'lucide-react';
import type { Religion, Verse } from '../types';
import { VerseCard } from './VerseCard';
import { useStore } from '../store/useStore';
import { RELIGIONS } from '../types';
import { formatAIResponse } from '../utils/markdown';

interface SearchResultsProps {
  results: {
    religion: Religion;
    answer: string;
    verses: Verse[];
  }[];
  isLoading: boolean;
  comparativeAnalysis?: string;
}

export function SearchResults({ results, isLoading, comparativeAnalysis }: SearchResultsProps) {
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
          <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 sepia:border-amber-300 border-t-primary-600 dark:border-t-primary-400 sepia:border-t-amber-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-primary-400 dark:border-b-primary-500 sepia:border-b-amber-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
        </div>
        <p className="mt-6 text-sage-600 dark:text-sage-400 sepia:text-amber-700 font-medium">Searching sacred texts...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Single religion view
  if (viewMode === 'single') {
    const { religion, answer, verses } = results[0];
    const religionInfo = RELIGIONS.find((r) => r.id === religion);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-100 sepia:text-amber-900">Search Results</h2>
            <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700 mt-1">
              {verses.length} {verses.length === 1 ? 'verse' : 'verses'} found in {religionInfo?.name}
            </p>
          </div>
        </div>

        {/* AI Answer */}
        {answer && (
          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-950 dark:to-indigo-950 sepia:from-amber-100 sepia:to-amber-200 rounded-2xl shadow-soft border-2 border-primary-200 dark:border-primary-800 sepia:border-amber-300 p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-1">AI Insight</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Based on {religionInfo?.text}</p>
              </div>
            </div>
            <div
              className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900"
              dangerouslySetInnerHTML={{ __html: formatAIResponse(answer) }}
            />
          </div>
        )}

        {verses.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-soft border border-sage-200 dark:border-sage-700 sepia:border-amber-200 p-12 sm:p-16 text-center">
            <div className="w-20 h-20 bg-sage-100 dark:bg-sage-800 sepia:bg-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SearchIcon className="w-10 h-10 text-sage-400 dark:text-sage-500 sepia:text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-sage-900 dark:text-sage-100 sepia:text-amber-900 mb-2">No Results Found</h3>
            <p className="text-sage-600 dark:text-sage-400 sepia:text-amber-700 max-w-md mx-auto">
              Try different keywords or phrases to discover relevant verses
            </p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-4">Source Passages</h3>
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
          </div>
        )}
      </div>
    );
  }

  // Comparison view
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-100 sepia:text-amber-900">Comparison Results</h2>
        <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700 mt-1">
          Exploring perspectives across {results.length} traditions
        </p>
      </div>

      {/* Comparative Analysis */}
      {comparativeAnalysis && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 sepia:from-amber-100 sepia:to-amber-200 rounded-2xl shadow-soft border-2 border-purple-200 dark:border-purple-800 sepia:border-amber-300 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-1">Comparative Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Synthesis across traditions</p>
            </div>
          </div>
          <div
            className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900"
            dangerouslySetInnerHTML={{ __html: formatAIResponse(comparativeAnalysis) }}
          />
        </div>
      )}

      {results.map(({ religion, answer, verses }) => {
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
                <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700">
                  {verses.length} {verses.length === 1 ? 'result' : 'results'} found
                </p>
              </div>
            </div>

            {/* AI Answer */}
            {answer && (
              <div
                className="rounded-xl shadow-soft border-2 p-5"
                style={{
                  backgroundColor: `${religionInfo?.color}08`,
                  borderColor: `${religionInfo?.color}40`
                }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: religionInfo?.color }}
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{religionInfo?.name} Perspective</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700">Based on {religionInfo?.text}</p>
                  </div>
                </div>
                <div
                  className="text-sm text-gray-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatAIResponse(answer) }}
                />
              </div>
            )}

            {/* Verses */}
            {verses.length === 0 ? (
              <div className="bg-sage-50 dark:bg-sage-800 sepia:bg-amber-100 border border-sage-200 dark:border-sage-700 sepia:border-amber-300 rounded-xl p-6 text-center">
                <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700">
                  No results found in {religionInfo?.name}
                </p>
              </div>
            ) : (
              <div>
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 sepia:text-amber-800 mb-3">Source Passages</h4>
                <div className="grid gap-3">
                  {verses.map((verse, idx) => (
                    <VerseCard
                      key={`${religion}-${verse.reference}-${idx}`}
                      verse={verse}
                      religion={religion}
                      onChatClick={() => handleChatClick(verse, religion)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
