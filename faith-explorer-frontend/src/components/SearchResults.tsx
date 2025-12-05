import { Search as SearchIcon, Sparkles, ArrowLeft, MessageCircle, BookmarkPlus, Share2, ChevronDown, Lock, Star } from 'lucide-react';
import { useState } from 'react';
import type { Religion, Verse, ReligionSubsetId } from '../types';
import { CompactVerseCard } from './CompactVerseCard';
import { useStore } from '../store/useStore';
import { RELIGIONS } from '../types';
import { CommonGroundVisualizer } from './CommonGroundVisualizer';
import { formatAIResponse } from '../utils/markdown';
import { shareInsight, shareComparison, copyToClipboard } from '../utils/helpers';

interface SearchResultsProps {
  results: {
    religion: Religion;
    subset: ReligionSubsetId;
    answer: string;
    verses: Verse[];
  }[];
  isLoading: boolean;
  comparativeAnalysis?: string;
  onBack?: () => void;
  isGated?: boolean;
  onUpgrade?: () => void;
}

export function SearchResults({ results, isLoading, comparativeAnalysis, onBack, isGated = false, onUpgrade }: SearchResultsProps) {
  const { setActiveVerseChat, viewMode, saveComparison, incrementShareCount, saveVerse } = useStore();
  const [expandedVerseId, setExpandedVerseId] = useState<string | null>(null);
  const [showAllVerses, setShowAllVerses] = useState(false);
  const [showCommonGround, setShowCommonGround] = useState(false);

  const INITIAL_VERSE_COUNT = 5;

  const handleChatClick = (verse: Verse, religion: Religion) => {
    setActiveVerseChat({
      verseReference: verse.reference,
      verseText: verse.text,
      religion,
      messages: [],
    });
  };

  const handleVerseToggle = (verseId: string) => {
    setExpandedVerseId(expandedVerseId === verseId ? null : verseId);
  };

  const handleSaveComparison = () => {
    if (comparativeAnalysis && results.length > 0) {
      saveComparison({
        id: Date.now().toString(),
        searchTerm: 'Comparative Analysis',
        religions: results.map(r => r.religion),
        results: results.map(r => ({
          religion: r.religion,
          verses: r.verses,
        })),
        savedAt: Date.now(),
        notes: comparativeAnalysis,
      });
      alert('Comparison saved to your library!');
    }
  };

  const handleShareComparison = async () => {
    if (comparativeAnalysis) {
      try {
        const religions = results.map(r => {
          const religionInfo = RELIGIONS.find(ri => ri.id === r.religion);
          return religionInfo?.name || r.religion;
        });
        const formattedText = shareComparison(comparativeAnalysis, religions);
        await copyToClipboard(formattedText);
        incrementShareCount();
        alert('Analysis copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy:', error);
      }
    }
  };

  const handleShareInsight = async (text: string, religion?: Religion) => {
    try {
      const religionInfo = religion ? RELIGIONS.find(r => r.id === religion) : undefined;
      const formattedText = shareInsight(text, religionInfo?.name);
      await copyToClipboard(formattedText);
      incrementShareCount();
      alert('Insight copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleChatWithInsight = (insightText: string, religion: Religion) => {
    setActiveVerseChat({
      verseReference: 'AI Insight',
      verseText: insightText,
      religion,
      messages: [],
    });
  };

  const handleSaveInsight = (insightText: string, religion: Religion, subset?: ReligionSubsetId) => {
    const religionInfo = RELIGIONS.find(r => r.id === religion);
    const subsetInfo = religionInfo?.subsets?.find(s => s.id === subset);

    // Strip HTML tags and markdown formatting for clean storage
    let plainText = insightText
      .replace(/<[^>]*>/g, '')           // Remove HTML tags
      .replace(/\*\*/g, '')               // Remove bold markdown
      .replace(/##\s+/g, '')              // Remove heading markers
      .replace(/\n\n+/g, '\n\n')          // Normalize line breaks
      .replace(/^\s+|\s+$/g, '')          // Trim whitespace
      .trim();

    saveVerse({
      reference: `AI Insight: ${subsetInfo?.name || religionInfo?.name}`,
      text: plainText,
      religion,
      id: `insight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: Date.now(),
      notes: '',
      tags: ['AI Insight'],
      highlights: [],
    });
    alert('AI Insight saved to your library!');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 rounded-full animate-spin" style={{
            borderImage: 'linear-gradient(to right, #9333ea, #4f46e5) 1',
            background: 'linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))',
            borderRadius: '50%'
          }}></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-indigo-600 dark:border-b-indigo-400 rounded-full animate-spin" style={{
            animationDirection: 'reverse',
            animationDuration: '1s',
            borderImage: 'linear-gradient(to left, #4f46e5, #9333ea) 1',
            borderRadius: '50%'
          }}></div>
        </div>
        <p className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400 sepia:from-amber-700 sepia:to-amber-600 font-medium">Searching sacred texts...</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  // Single religion view
  if (viewMode === 'single') {
    const { religion, subset, answer, verses } = results[0];
    const religionInfo = RELIGIONS.find((r) => r.id === religion);
    const subsetInfo = religionInfo?.subsets?.find((s) => s.id === subset);

    return (
      <div className="space-y-6 relative">
        {/* Back Button - positioned below header */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 sepia:bg-amber-50 text-sage-600 dark:text-sage-400 sepia:text-amber-700 hover:text-sage-700 dark:hover:text-sage-300 sepia:hover:text-amber-800 hover:bg-sage-50 dark:hover:bg-sage-900/20 sepia:hover:bg-amber-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 sepia:border-amber-200 transition-all duration-200 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Soft Gating Overlay */}
        {isGated && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Unlock Full Wisdom
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You've used all your free searches! The app <span className="font-semibold">can</span> answer your question. Upgrade to Premium to see the full results and continue your spiritual journey.
              </p>
              <button
                onClick={onUpgrade}
                className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3"
              >
                <Star className="w-5 h-5 fill-current" />
                Upgrade to Premium
              </button>
              <button
                onClick={onBack}
                className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        )}

        <div className={isGated ? 'filter blur-lg pointer-events-none select-none' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-100 sepia:text-amber-900">Search Results</h2>
              <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700 mt-1">
                {verses.length} {verses.length === 1 ? 'verse' : 'verses'} found in {subsetInfo?.name || religionInfo?.name}
              </p>
            </div>
          </div>

          {/* AI Answer */}
          {answer && (
            <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-950 dark:to-indigo-950 sepia:from-amber-100 sepia:to-amber-200 rounded-2xl shadow-soft border-2 border-primary-200 dark:border-primary-800 sepia:border-amber-300 p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-1">AI Insight</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">Based on {subsetInfo?.name || religionInfo?.text}</p>
                </div>
              </div>
              <div
                className="prose prose-sm max-w-none text-gray-900 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900"
                dangerouslySetInnerHTML={{ __html: formatAIResponse(answer) }}
              />

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-primary-200 dark:border-primary-700 sepia:border-amber-300">
                <button
                  onClick={() => handleChatWithInsight(answer, religion)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 sepia:text-amber-700 hover:text-primary-700 dark:hover:text-primary-300 sepia:hover:text-amber-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Discuss</span>
                </button>
                <button
                  onClick={() => handleSaveInsight(answer, religion, subset)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <BookmarkPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={() => handleShareInsight(answer, religion)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-3">
                Source Passages ({verses.length})
              </h3>
              <div className="space-y-2">
                {verses.slice(0, showAllVerses ? verses.length : INITIAL_VERSE_COUNT).map((verse, idx) => (
                  <CompactVerseCard
                    key={`${verse.reference}-${idx}`}
                    verse={verse}
                    religion={religion}
                    isExpanded={expandedVerseId === `${verse.reference}-${idx}`}
                    onToggle={() => handleVerseToggle(`${verse.reference}-${idx}`)}
                    onChatClick={() => handleChatClick(verse, religion)}
                  />
                ))}
              </div>

              {/* Show More Button */}
              {verses.length > INITIAL_VERSE_COUNT && !showAllVerses && (
                <button
                  onClick={() => setShowAllVerses(true)}
                  className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 sepia:from-amber-100 sepia:to-amber-200 text-indigo-700 dark:text-indigo-300 sepia:text-amber-800 font-medium rounded-xl border border-indigo-200 dark:border-indigo-800 sepia:border-amber-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 sepia:hover:from-amber-200 sepia:hover:to-amber-300 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ChevronDown className="w-4 h-4" />
                  Show {verses.length - INITIAL_VERSE_COUNT} More Verses
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Comparison view
  return (
    <div className="space-y-8 relative">
      {/* Back Button - positioned below header */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 sepia:bg-amber-50 text-sage-600 dark:text-sage-400 sepia:text-amber-700 hover:text-sage-700 dark:hover:text-sage-300 sepia:hover:text-amber-800 hover:bg-sage-50 dark:hover:bg-sage-900/20 sepia:hover:bg-amber-100 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 sepia:border-amber-200 transition-all duration-200 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* Soft Gating Overlay */}
      {isGated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Unlock Full Wisdom
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You've used all your free searches! The app <span className="font-semibold">can</span> answer your question. Upgrade to Premium to see the full results and continue your spiritual journey.
            </p>
            <button
              onClick={onUpgrade}
              className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 mb-3"
            >
              <Star className="w-5 h-5 fill-current" />
              Upgrade to Premium
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      )}

      <div className={isGated ? 'filter blur-lg pointer-events-none select-none' : ''}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-sage-900 dark:text-sage-100 sepia:text-amber-900">Comparison Results</h2>
            <p className="text-sm text-sage-600 dark:text-sage-400 sepia:text-amber-700 mt-1">
              Exploring perspectives across {results.length} traditions
            </p>
          </div>
        </div>

        {/* Comparative Analysis - Now at the TOP */}
        {comparativeAnalysis && (
          <>
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
                className="prose prose-sm max-w-none text-gray-900 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900"
                dangerouslySetInnerHTML={{ __html: formatAIResponse(comparativeAnalysis) }}
              />

              {/* Comparison Actions */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-purple-200 dark:border-purple-700 sepia:border-amber-300">
                <button
                  onClick={() => setShowCommonGround(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">Visualize Common Ground</span>
                </button>
                <button
                  onClick={() => alert('Chat feature coming soon! For now, you can discuss specific verses by clicking "Discuss" on individual verses below.')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-purple-600 dark:text-purple-400 sepia:text-amber-700 hover:text-purple-700 dark:hover:text-purple-300 sepia:hover:text-amber-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <MessageCircle className="w-3 h-3" />
                  <span className="hidden sm:inline">Discuss</span>
                </button>
                <button
                  onClick={handleSaveComparison}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <BookmarkPlus className="w-3 h-3" />
                  <span className="hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={handleShareComparison}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                >
                  <Share2 className="w-3 h-3" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Common Ground Modal */}
            {showCommonGround && results.length >= 2 && (
              <CommonGroundVisualizer
                religions={results.map(r => r.religion)}
                question={comparativeAnalysis ? "Analysis" : "Search Query"} // We will pass the implicit question via context or just use the results for analysis
                results={results}
                onClose={() => setShowCommonGround(false)}
              />
            )}

            {/* Separator */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600 sepia:border-amber-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 dark:bg-gray-900 sepia:bg-amber-50 text-gray-600 dark:text-gray-400 sepia:text-amber-700 font-medium">
                  Individual Perspectives
                </span>
              </div>
            </div>
          </>
        )}

        {results.map(({ religion, subset, answer, verses }) => {
          const religionInfo = RELIGIONS.find((r) => r.id === religion);
          const subsetInfo = religionInfo?.subsets?.find((s) => s.id === subset);

          return (
            <div key={`${religion}-${subset}`} className="space-y-4">
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
                    {subsetInfo?.name || religionInfo?.name}
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
                      <h4 className="font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{subsetInfo?.name || religionInfo?.name} Perspective</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700">Based on {subsetInfo?.name || religionInfo?.text}</p>
                    </div>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-900 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900"
                    dangerouslySetInnerHTML={{ __html: formatAIResponse(answer) }}
                  />

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t" style={{ borderColor: `${religionInfo?.color}40` }}>
                    <button
                      onClick={() => handleChatWithInsight(answer, religion)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                      style={{ color: religionInfo?.color }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Discuss</span>
                    </button>
                    <button
                      onClick={() => handleSaveInsight(answer, religion, subset)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                    >
                      <BookmarkPlus className="w-4 h-4" />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button
                      onClick={() => handleShareInsight(answer, religion)}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Share</span>
                    </button>
                  </div>
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
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 sepia:text-amber-800 mb-2">
                    Source Passages ({verses.length})
                  </h4>
                  <div className="space-y-2">
                    {verses.slice(0, 3).map((verse, idx) => (
                      <CompactVerseCard
                        key={`${religion}-${verse.reference}-${idx}`}
                        verse={verse}
                        religion={religion}
                        isExpanded={expandedVerseId === `${religion}-${verse.reference}-${idx}`}
                        onToggle={() => handleVerseToggle(`${religion}-${verse.reference}-${idx}`)}
                        onChatClick={() => handleChatClick(verse, religion)}
                      />
                    ))}
                  </div>
                  {verses.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 sepia:text-amber-600 mt-2 text-center">
                      + {verses.length - 3} more passages in {religionInfo?.name}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
