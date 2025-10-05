import { Sparkles, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchReligion } from '../services/api';
import { RELIGIONS, type Religion } from '../types';
import { formatAIResponse } from '../utils/markdown';

const WISDOM_QUERIES = [
  'What brings inner peace?',
  'How should we treat others?',
  'What is true wisdom?',
  'How do we find meaning?',
  'What is the path to enlightenment?',
  'How should we face challenges?',
  'What is compassion?',
  'How do we cultivate gratitude?',
];

export function DailyWisdom() {
  const [wisdom, setWisdom] = useState<{ answer: string; religion: Religion; query: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const loadDailyWisdom = async () => {
    setIsLoading(true);
    try {
      // Get today's date as seed for consistent daily wisdom
      const today = new Date().toDateString();
      const queryIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % WISDOM_QUERIES.length;
      const religionIndex = today.length % RELIGIONS.filter(r => r.coverage === 'full').length;

      const query = WISDOM_QUERIES[queryIndex];
      const fullCoverageReligions = RELIGIONS.filter(r => r.coverage === 'full');
      const religion = fullCoverageReligions[religionIndex].id;

      const result = await searchReligion(religion, query);

      setWisdom({
        answer: result.answer,
        religion,
        query,
      });
    } catch (error) {
      console.error('Failed to load daily wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Check if we already loaded wisdom today
    const lastLoaded = localStorage.getItem('dailyWisdom_lastLoaded');
    const today = new Date().toDateString();

    if (lastLoaded !== today) {
      loadDailyWisdom();
      localStorage.setItem('dailyWisdom_lastLoaded', today);
    } else {
      // Load cached wisdom
      const cached = localStorage.getItem('dailyWisdom_cache');
      if (cached) {
        setWisdom(JSON.parse(cached));
      } else {
        loadDailyWisdom();
      }
    }
  }, []);

  useEffect(() => {
    if (wisdom) {
      localStorage.setItem('dailyWisdom_cache', JSON.stringify(wisdom));
    }
  }, [wisdom]);

  if (!wisdom && !isLoading) return null;

  const religionInfo = RELIGIONS.find(r => r.id === wisdom?.religion);

  // Get preview text (first 120 characters)
  const getPreviewText = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').replace(/\*\*/g, '');
    return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText;
  };

  return (
    <div
      onClick={() => !isLoading && setIsExpanded(!isExpanded)}
      className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 sepia:from-amber-100 sepia:via-amber-50 sepia:to-amber-200 rounded-xl border border-indigo-200 dark:border-indigo-800 sepia:border-amber-300 p-4 shadow-soft cursor-pointer transition-all hover:shadow-medium"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Daily Wisdom</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700 truncate">
              {wisdom ? wisdom.query : 'Loading...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              loadDailyWisdom();
            }}
            disabled={isLoading}
            className="p-2 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 sepia:hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {!isLoading && (
            <div className="p-2">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400 sepia:text-amber-700" />
              )}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800 sepia:border-amber-300">
          <div className="flex items-center gap-2 mb-3 animate-pulse">
            <div className="w-16 h-4 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded"></div>
            <div className="w-24 h-4 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded"></div>
          </div>
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-full"></div>
            <div className="h-3 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-11/12"></div>
            <div className="h-3 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-5/6"></div>
          </div>
        </div>
      ) : wisdom && (
        <>
          {!isExpanded && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 line-clamp-2">
                {getPreviewText(wisdom.answer)}
              </p>
            </div>
          )}

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800 sepia:border-amber-300">
              <p className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 sepia:text-amber-800 mb-2">
                From {religionInfo?.name}
              </p>
              <div
                className="text-sm text-gray-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: formatAIResponse(wisdom.answer) }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
