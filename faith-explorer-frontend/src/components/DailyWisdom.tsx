import { Sparkles, RefreshCw, ChevronDown, ChevronUp, Quote, MessageCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { searchReligion } from '../services/api';
import { RELIGIONS, type Religion } from '../types';
import { formatAIResponse } from '../utils/markdown';
import { useStore } from '../store/useStore';
import { SubscriptionModal } from './SubscriptionModal';

const WISDOM_QUERIES = [
  'What brings inner peace?', 'How should we treat others?', 'What is true wisdom?',
  'How do we find meaning?', 'What is the path to enlightenment?', 'How should we face challenges?',
  'What is compassion?', 'How do we cultivate gratitude?',
];

export function DailyWisdom() {
  const [wisdom, setWisdom] = useState<{ answer: string; religion: Religion; query: string; personalizedIntro?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const { usage, setPremium, setActiveVerseChat, savedVerses, getTopRecentTopics } = useStore();

  const loadDailyWisdom = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toDateString();
      const queryIndex = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % WISDOM_QUERIES.length;
      const religionIndex = today.length % RELIGIONS.filter(r => r.coverage === 'full').length;
      const query = WISDOM_QUERIES[queryIndex];
      const fullCoverageReligions = RELIGIONS.filter(r => r.coverage === 'full');
      const religion = fullCoverageReligions[religionIndex].id;

      // Pass isPremium flag to get longer insights for premium users
      const result = await searchReligion(religion, query, usage.isPremium);

      // Generate personalized intro based on recent topics
      let personalizedIntro: string | undefined;
      if (usage.isPremium) {
        const topTopics = getTopRecentTopics(2);
        if (topTopics.length > 0) {
          const topics = topTopics.join(' and ');
          personalizedIntro = `Based on your recent interest in ${topics}, today's wisdom explores ${query.toLowerCase()}`;
        }
      }

      setWisdom({ answer: result.answer, religion, query, personalizedIntro });
    } catch (error) {
      console.error('Failed to load daily wisdom:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lastLoaded = localStorage.getItem('dailyWisdom_lastLoaded');
    const today = new Date().toDateString();
    if (lastLoaded !== today) {
      loadDailyWisdom();
      localStorage.setItem('dailyWisdom_lastLoaded', today);
    } else {
      const cached = localStorage.getItem('dailyWisdom_cache');
      if (cached) setWisdom(JSON.parse(cached));
      else loadDailyWisdom();
    }
  }, []);

  useEffect(() => {
    if (wisdom) localStorage.setItem('dailyWisdom_cache', JSON.stringify(wisdom));
  }, [wisdom]);

  const handleDeepDive = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!usage.isPremium) {
      setShowSubscriptionModal(true);
      return;
    }
    // Open chat drawer with the wisdom
    if (wisdom) {
      setActiveVerseChat({
        verseReference: `Daily Wisdom: ${wisdom.query}`,
        verseText: wisdom.answer,
        religion: wisdom.religion,
        messages: [],
      });
    }
  };

  if (!wisdom && !isLoading) return null;

  const religionInfo = RELIGIONS.find(r => r.id === wisdom?.religion);
  const getPreviewText = (text: string) => {
    const plainText = text.replace(/<[^>]*>/g, '').replace(/\*\*/g, '');
    return plainText.length > 120 ? plainText.slice(0, 120) + '...' : plainText;
  };

  return (
    <div
      onClick={() => !isLoading && setIsExpanded(!isExpanded)}
      className="group relative bg-white dark:bg-stone-800 rounded-2xl shadow-paper border border-sand-200 dark:border-stone-700 p-5 cursor-pointer transition-all duration-300 hover:shadow-float overflow-hidden"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-16 h-16 text-bronze-900" />
      </div>

      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-sand-100 dark:bg-stone-700 rounded-full flex items-center justify-center flex-shrink-0 border border-sand-200 dark:border-stone-600">
            <Sparkles className="w-5 h-5 text-bronze-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-bold uppercase tracking-wider text-bronze-600 dark:text-bronze-400">Daily Wisdom</h3>
            <p className="text-base font-serif font-medium text-stone-900 dark:text-stone-100 truncate">
              {wisdom ? wisdom.query : 'Seeking wisdom...'}
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
            className="p-2 text-stone-400 hover:text-bronze-600 hover:bg-sand-100 dark:hover:bg-stone-700 rounded-full transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {!isLoading && (
            <div className="p-2 text-stone-400">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 pt-4 border-t border-sand-100 dark:border-stone-700">
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-sand-200 dark:bg-stone-700 rounded w-full"></div>
            <div className="h-3 bg-sand-200 dark:bg-stone-700 rounded w-5/6"></div>
          </div>
        </div>
      ) : wisdom && (
        <>
          {!isExpanded && (
            <div className="mt-3 pl-13">
              <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2 font-serif italic">
                "{getPreviewText(wisdom.answer)}"
              </p>
            </div>
          )}

          {isExpanded && (
            <div className="mt-4 pt-4 border-t border-sand-100 dark:border-stone-700 animate-slide-up">
              {/* Personalized Intro for Premium users */}
              {wisdom.personalizedIntro && usage.isPremium && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-900 dark:text-amber-200 italic">
                    ✨ {wisdom.personalizedIntro}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wide">
                  From {religionInfo?.name}
                </p>
                {usage.isPremium && (
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-800 dark:text-amber-300 rounded-full border border-amber-300 dark:border-amber-700 font-medium">
                    Enhanced Insight
                  </span>
                )}
              </div>
              <div
                className="prose prose-sm max-w-none prose-p:font-serif prose-p:text-stone-700 dark:prose-p:text-stone-300 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatAIResponse(wisdom.answer) }}
              />

              {/* Deep Dive Button */}
              <div className="mt-4 pt-4 border-t border-sand-100 dark:border-stone-700">
                <button
                  onClick={handleDeepDive}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    usage.isPremium
                      ? 'bg-gradient-to-r from-bronze-500 to-bronze-600 text-white hover:from-bronze-600 hover:to-bronze-700 shadow-md hover:shadow-lg'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50 text-bronze-700 border-2 border-bronze-200 hover:border-bronze-300'
                  }`}
                >
                  {usage.isPremium ? (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      <span>Deep Dive with AI</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Unlock Deep Dive (Premium)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            setPremium(true);
            setShowSubscriptionModal(false);
          }}
        />
      )}
    </div>
  );
}