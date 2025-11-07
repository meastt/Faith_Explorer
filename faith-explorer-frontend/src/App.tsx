import { useState, useEffect } from 'react';
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
import { useStore } from './store/useStore';
import { searchSubsets, getComparativeAnalysis } from './services/api';
import { initializeScriptures } from './services/search';
import type { Religion, Verse, ReligionSubsetId } from './types';

type Tab = 'search' | 'saved';

export interface SearchResultWithAnswer {
  religion: Religion;
  subset: ReligionSubsetId;
  answer: string;
  verses: Verse[];
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { viewMode, selectedSubsets, setIsSearching, incrementSearchUsage, clearSelectedSubsets, shouldShowReviewPrompt, reviewPrompt } = useStore();
  const [searchResults, setSearchResults] = useState<SearchResultWithAnswer[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize scriptures on app start
  useEffect(() => {
    initializeScriptures();
  }, []);

  // Check app version and clear cache if needed
  useEffect(() => {
    const currentVersion = '2.0.3-12'; // version-build
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

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('faithExplorer_hasSeenOnboarding', 'true');
  };

  const handleClearResults = () => {
    setSearchResults([]);
    setComparativeAnalysis('');
    clearSelectedSubsets(); // Reset selected religions/subsets
  };

  const handleSearch = async (query: string) => {
    // Check usage limit
    if (!incrementSearchUsage()) {
      alert('You\'ve reached your free search limit (10/month). Upgrade to Premium for unlimited searches starting at just $4.99/month!');
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    setSearchResults([]);
    setComparativeAnalysis('');

    try {
      if (selectedSubsets.length === 0) {
        alert('Please select at least one religious text to search.');
        return;
      }

      if (viewMode === 'single') {
        // For single mode, search all selected subsets together
        const result = await searchSubsets(selectedSubsets, query);
        setSearchResults([{ 
          religion: selectedSubsets[0].religion, 
          subset: selectedSubsets[0].subset,
          answer: result.answer, 
          verses: result.sources 
        }]);
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
          }
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
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
      style={{ fontSize: `${readingPreferences.fontSize}px` }}
    >
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 pt-40 pb-28">
        {/* Content */}
        {activeTab === 'search' ? (
          <div className="space-y-4">
            {searchResults.length === 0 && !isLoading && <DailyWisdom />}
            {searchResults.length === 0 && !isLoading && <ReligionSelector />}
            {searchResults.length === 0 && !isLoading && <SearchBar onSearch={handleSearch} />}
            {searchResults.length === 0 && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TopicExplorer onTopicSelect={handleSearch} />
                <LearningPaths onStepSelect={(query) => handleSearch(query)} />
              </div>
            )}
            <SearchResults
              results={searchResults}
              isLoading={isLoading}
              comparativeAnalysis={comparativeAnalysis}
              onBack={searchResults.length > 0 ? handleClearResults : undefined}
            />
          </div>
        ) : (
          <SavedLibrary />
        )}
      </main>

      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onSettingsClick={() => setShowSettings(true)}
      />
      <ChatDrawer />
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
      {showReviewPrompt && <ReviewPromptModal onClose={() => setShowReviewPrompt(false)} />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
