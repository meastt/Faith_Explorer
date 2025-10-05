import { Sparkles, RefreshCw } from 'lucide-react';
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

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 sepia:from-amber-100 sepia:via-amber-50 sepia:to-amber-200 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 sepia:border-amber-300 p-6 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 sepia:text-amber-900">Daily Wisdom</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 sepia:text-amber-700">
              {wisdom ? `From ${religionInfo?.name}` : 'Loading...'}
            </p>
          </div>
        </div>

        <button
          onClick={loadDailyWisdom}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 sepia:text-amber-700 hover:text-indigo-700 dark:hover:text-indigo-300 sepia:hover:text-amber-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 sepia:hover:bg-amber-200 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-full"></div>
          <div className="h-4 bg-indigo-200 dark:bg-indigo-800 sepia:bg-amber-300 rounded w-5/6"></div>
        </div>
      ) : wisdom && (
        <>
          <div className="mb-3">
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-300 sepia:text-amber-800 mb-2">"{wisdom.query}"</p>
          </div>
          <div
            className="text-gray-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-strong:font-semibold prose-strong:text-gray-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900 prose-li:my-1"
            dangerouslySetInnerHTML={{ __html: formatAIResponse(wisdom.answer) }}
          />
        </>
      )}
    </div>
  );
}
