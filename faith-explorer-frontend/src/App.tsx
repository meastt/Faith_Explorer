import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { ReligionSelector } from './components/ReligionSelector';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { ChatDrawer } from './components/ChatDrawer';
import { SavedLibrary } from './components/SavedLibrary';
import { OnboardingModal } from './components/OnboardingModal';
import { ReviewPromptModal } from './components/ReviewPromptModal';
import { TopicExplorer } from './components/TopicExplorer';
import { DailyWisdom } from './components/DailyWisdom';
import { LearningPaths } from './components/LearningPaths';
import { BottomNav } from './components/BottomNav';
import { Settings } from './components/Settings';
import { SubscriptionModal } from './components/SubscriptionModal';
import { EmailOptInModal } from './components/EmailOptInModal';
import { useStore } from './store/useStore';
import { Toast, showToast } from './components/Toast';
import { searchSubsets, getComparativeAnalysis } from './services/api';
import { LearnTab } from './components/LearnTab';
import { ScriptureReader } from './components/ScriptureReader';
import { initializeScriptures } from './services/search';
import { notificationService } from './services/notifications';
import { DialogueSimulator } from './components/DialogueSimulator';
import type { Religion, Verse, ReligionSubsetId } from './types';

type Tab = 'search' | 'read' | 'saved' | 'learn';

export interface SearchResultWithAnswer {
  religion: Religion;
  subset: ReligionSubsetId;
  answer: string;
  verses: Verse[];
}

function App() {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { viewMode, selectedSubsets, setIsSearching, clearSelectedSubsets, shouldShowReviewPrompt, reviewPrompt, checkAndUnlockBadges, incrementSessionCount, shouldShowEmailOptIn } = useStore();
  const [searchResults, setSearchResults] = useState<SearchResultWithAnswer[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showEmailOptIn, setShowEmailOptIn] = useState(false);
  const [isGatedResult, setIsGatedResult] = useState(false);
  const [comparativeAnalysisError, setComparativeAnalysisError] = useState(false);
  const [showPersonas, setShowPersonas] = useState(false);

  // Reset scroll position when switching to DialogueSimulator
  useEffect(() => {
    if (showPersonas && activeTab === 'learn') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        const scrollableContainers = document.querySelectorAll('[class*="overflow"], main, [role="main"]');
        scrollableContainers.forEach(container => {
          if (container instanceof HTMLElement && container.scrollTop > 0) {
            container.scrollTop = 0;
          }
        });
      });
    }
  }, [showPersonas, activeTab]);

  // Initialize scriptures on app start
  useEffect(() => {
    initializeScriptures();
    // Check for new badge unlocks on app load
    checkAndUnlockBadges();

    // Schedule re-engagement notification (resets timer on every open)
    // Delay notification initialization slightly to allow Capacitor to fully initialize
    setTimeout(() => {
      notificationService.scheduleReEngagement().catch(err => {
        console.error('Failed to schedule re-engagement notification:', err);
      });
    }, 1000);

    // Schedule notifications based on user preferences
    const { notificationPreferences, streak } = useStore.getState();

    // Re-schedule daily wisdom if enabled (handles app restart, time changes)
    // Delay to allow Capacitor to fully initialize
    setTimeout(() => {
      if (notificationPreferences.dailyWisdomEnabled) {
        notificationService.scheduleDailyWisdom(notificationPreferences.dailyWisdomTime).catch(err => {
          console.error('Failed to schedule daily wisdom:', err);
        });
      }

      // Schedule streak reminder if enabled and streak is at risk
      if (notificationPreferences.streakRemindersEnabled && streak.current >= 2) {
        notificationService.scheduleStreakReminder(streak.current, streak.lastActiveDate).catch(err => {
          console.error('Failed to schedule streak reminder:', err);
        });
      }
    }, 1000);

    // Increment session count for email opt-in tracking
    incrementSessionCount();
  }, [checkAndUnlockBadges, incrementSessionCount]);

  // Check app version and clear cache if needed
  useEffect(() => {
    const currentVersion = '3.2-24'; // version-build
    const storedVersion = localStorage.getItem('faithExplorer_appVersion');

    if (storedVersion !== currentVersion) {
      console.log(`App updated from ${storedVersion} to ${currentVersion}, clearing cache...`);

      // Update stored version FIRST to prevent reload loops
      localStorage.setItem('faithExplorer_appVersion', currentVersion);

      // Clear Zustand storage to reset default selections
      localStorage.removeItem('faith-explorer-storage');

      // Clear specific cached data that might be stale
      const allKeys = Object.keys(localStorage);
      allKeys.forEach(key => {
        if (!key.includes('faithExplorer_hasSeenOnboarding') &&
          !key.includes('faithExplorer_premium') &&
          !key.includes('faithExplorer_usage') &&
          key !== 'faithExplorer_appVersion') {
          localStorage.removeItem(key);
        }
      });

      console.log('Cache cleared for app update - all selections reset');

      // Only reload in production builds, not during development
      if (import.meta.env.PROD) {
        // Force page reload to ensure clean state
        window.location.reload();
      }
    }
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('faithExplorer_hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Check if we should show the review prompt
  useEffect(() => {
    if (shouldShowReviewPrompt()) {
      // Delay slightly to ensure the save action completes
      setTimeout(() => {
        setShowReviewPrompt(true);
      }, 500);
    }
  }, [reviewPrompt.savesCount, reviewPrompt.sharesCount, shouldShowReviewPrompt]);

  // Check if we should show email opt-in
  useEffect(() => {
    // Delay to not interrupt initial app experience
    const timer = setTimeout(() => {
      if (shouldShowEmailOptIn() && !showOnboarding) {
        setShowEmailOptIn(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [shouldShowEmailOptIn, showOnboarding]);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('faithExplorer_hasSeenOnboarding', 'true');
  };

  const handleClearResults = () => {
    setSearchResults([]);
    setComparativeAnalysis('');
    setIsGatedResult(false);
    setComparativeAnalysisError(false);
    clearSelectedSubsets(); // Reset selected religions/subsets
  };

  const handleSearch = async (query: string) => {
    // Check usage limit first (without incrementing)
    const { canSearch, incrementSearchUsage, addRecentTopic } = useStore.getState();
    const hasSearchesLeft = canSearch();

    // Soft gating: Allow search to proceed even if limit reached, but mark as gated
    const isSearchGated = !hasSearchesLeft;

    setIsLoading(true);
    setIsSearching(true);
    setSearchResults([]);
    setComparativeAnalysis('');
    setIsGatedResult(isSearchGated);
    setComparativeAnalysisError(false);

    try {
      if (selectedSubsets.length === 0) {
        showToast(t('usage.selectAtLeastOne'), 'info');
        return;
      }

      let searchSuccessful = false;

      if (viewMode === 'single') {
        // For single mode, search all selected subsets together
        const result = await searchSubsets(selectedSubsets, query);
        setSearchResults([{
          religion: selectedSubsets[0].religion,
          subset: selectedSubsets[0].subset,
          answer: result.answer,
          verses: result.sources
        }]);
        searchSuccessful = true;
      } else {
        // For comparison mode, search each subset separately
        const results = await Promise.all(
          selectedSubsets.map(async (selectedSubset) => {
            const result = await searchSubsets([selectedSubset], query);
            return {
              religion: selectedSubset.religion,
              subset: selectedSubset.subset,
              answer: result.answer,
              verses: result.sources,
            };
          })
        );

        setSearchResults(results);
        searchSuccessful = results.length > 0;

        // Get comparative analysis if we have results from multiple subsets
        if (results.length >= 2 && results.some(r => r.answer)) {
          try {
            const analysis = await getComparativeAnalysis(
              selectedSubsets.map(s => s.religion),
              query,
              results.map(r => ({ religion: r.religion, answer: r.answer }))
            );
            setComparativeAnalysis(analysis);
          } catch (error) {
            console.error('Comparative analysis error:', error);
            setComparativeAnalysisError(true);
          }
        }
      }

      // Only increment usage if search was successful AND not gated
      if (searchSuccessful && !isSearchGated) {
        incrementSearchUsage();
      }

      // Track topic for personalized recommendations (regardless of gated status)
      if (searchSuccessful) {
        addRecentTopic(query);
        // Check for badge unlocks after successful search
        checkAndUnlockBadges();
      }
    } catch (error) {
      console.error('Search error:', error);
      showToast(t('toast.searchFailed'), 'error');
      // Don't increment usage on failure
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const { readingPreferences } = useStore();

  // Ensure theme class is applied to document root for proper Tailwind dark mode
  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes first
    root.classList.remove('dark', 'sepia');

    // Add the appropriate theme class
    if (readingPreferences.theme === 'dark') {
      root.classList.add('dark');
    } else if (readingPreferences.theme === 'sepia') {
      root.classList.add('sepia');
    }

    // Update color-scheme meta tag to prevent iOS WebView from forcing its own appearance
    let metaColorScheme = document.querySelector('meta[name="color-scheme"]');
    if (!metaColorScheme) {
      metaColorScheme = document.createElement('meta');
      metaColorScheme.setAttribute('name', 'color-scheme');
      document.head.appendChild(metaColorScheme);
    }
    // Always set to 'light' to prevent iOS from applying dark mode automatically
    // Our app handles dark mode via CSS classes
    metaColorScheme.setAttribute('content', 'light');
  }, [readingPreferences.theme]);

  // Apply theme classes
  const themeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 dark',
    sepia: 'bg-amber-50 sepia',
  };

  const fontFamilyClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    dyslexic: 'font-mono',
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses[readingPreferences.theme]} ${fontFamilyClasses[readingPreferences.fontFamily]}`}
      style={{
        fontSize: `${readingPreferences.fontSize}px`,
        backgroundColor: readingPreferences.theme === 'dark' ? '#1c1917' : '#fdfcfb',
        color: readingPreferences.theme === 'dark' ? '#e7e5e4' : '#4a453e',
        minHeight: '100vh',
        width: '100%'
      }}
    >
      {!(activeTab === 'learn' && showPersonas) && <Header />}

      <main className={`flex-1 max-w-4xl mx-auto w-full px-4 pb-28 ${!(activeTab === 'learn' && showPersonas) ? 'pt-[120px]' : 'pt-[calc(env(safe-area-inset-top)+1rem)]'}`}>
        {/* Content */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            {/* Core action first */}
            {searchResults.length === 0 && !isLoading && <ReligionSelector />}
            {searchResults.length === 0 && !isLoading && <SearchBar onSearch={handleSearch} />}

            {/* Discovery content */}
            {searchResults.length === 0 && !isLoading && <DailyWisdom />}
            {searchResults.length === 0 && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TopicExplorer onTopicSelect={handleSearch} />
                <LearningPaths />
              </div>
            )}
            {/* Personas Feature - Prominent Card */}
            {searchResults.length === 0 && !isLoading && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setActiveTab('learn');
                    setShowPersonas(true);
                  }}
                  className="w-full p-5 bg-gradient-to-br from-stone-700 via-stone-800 to-stone-900 rounded-2xl text-left text-white shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 to-transparent"></div>
                  <div className="relative flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/15 rounded-xl flex items-center justify-center text-2xl backdrop-blur-sm flex-shrink-0">
                      💬
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-white mb-1">{t('personas.title', { ns: 'search' })}</h3>
                      <p className="text-sm text-stone-300">{t('personas.subtitle', { ns: 'search' })}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">{t('religionNames.islam', { ns: 'common' })}</span>
                        <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">{t('religionNames.christianity', { ns: 'common' })}</span>
                        <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">{t('religionNames.judaism', { ns: 'common' })}</span>
                        <span className="text-xs bg-white/15 px-2 py-0.5 rounded-full backdrop-blur-sm">{t('app.religionLabels.moreCount', { ns: 'search' })}</span>
                      </div>
                    </div>
                    <div className="text-white/70 group-hover:translate-x-1 transition-transform flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            )}
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              comparativeAnalysis={comparativeAnalysis}
              comparativeAnalysisError={comparativeAnalysisError}
              onBack={searchResults.length > 0 ? handleClearResults : undefined}
              isGated={isGatedResult}
              onUpgrade={() => setShowSubscriptionModal(true)}
            />
          </div>
        )}

        {activeTab === 'read' && (
          <div className="pb-24">
            <ScriptureReader />
          </div>
        )}

        {activeTab === 'learn' && (
          <div className="pb-24">
            {showPersonas ? (
              <div>
                <button
                  onClick={() => setShowPersonas(false)}
                  className="mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← {t('backToLearning', { ns: 'learn' })}
                </button>
                <DialogueSimulator />
              </div>
            ) : (
              <LearnTab onDialogueClick={() => setShowPersonas(true)} />
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="pb-24">
            <SavedLibrary />
          </div>
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          // Only reset when double-tapping the search tab (already on it)
          if (tab === 'search' && activeTab === 'search') {
            handleClearResults();
          }
          setActiveTab(tab);
          // Reset personas view when switching away from learn tab
          if (tab !== 'learn') {
            setShowPersonas(false);
          }
        }}
        onSettingsClick={() => setShowSettings(true)}
      />
      <Toast />
      <ChatDrawer />
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      {showReviewPrompt && <ReviewPromptModal onClose={() => setShowReviewPrompt(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      {showSubscriptionModal && (
        <SubscriptionModal
          onClose={() => setShowSubscriptionModal(false)}
          onSubscribe={() => {
            useStore.getState().setPremium(true);
            setShowSubscriptionModal(false);
          }}
        />
      )}
      {showEmailOptIn && (
        <EmailOptInModal onClose={() => setShowEmailOptIn(false)} />
      )}
    </div>
  );
}

export default App;
