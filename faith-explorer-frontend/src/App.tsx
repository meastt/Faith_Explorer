import { useState, useEffect } from 'react';
import { Search, Bookmark } from 'lucide-react';
import { Header } from './components/Header';
import { ReligionSelector } from './components/ReligionSelector';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { ChatDrawer } from './components/ChatDrawer';
import { SavedLibrary } from './components/SavedLibrary';
import { OnboardingModal } from './components/OnboardingModal';
import { TopicExplorer } from './components/TopicExplorer';
import { DailyWisdom } from './components/DailyWisdom';
import { LearningPaths } from './components/LearningPaths';
import { useStore } from './store/useStore';
import { searchReligion, searchMultipleReligions, getComparativeAnalysis } from './services/api';
import type { Religion, Verse } from './types';

type Tab = 'search' | 'saved';

export interface SearchResultWithAnswer {
  religion: Religion;
  answer: string;
  verses: Verse[];
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { viewMode, selectedReligions, setIsSearching, incrementSearchUsage } = useStore();
  const [searchResults, setSearchResults] = useState<SearchResultWithAnswer[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('faithExplorer_hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('faithExplorer_hasSeenOnboarding', 'true');
  };

  const handleSearch = async (query: string) => {
    // Check usage limit
    if (!incrementSearchUsage()) {
      alert('You have reached your free search limit. Please upgrade to Premium for unlimited searches.');
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    setSearchResults([]);
    setComparativeAnalysis('');

    try {
      if (viewMode === 'single') {
        const religion = selectedReligions[0];
        const result = await searchReligion(religion, query);
        setSearchResults([{ religion, answer: result.answer, verses: result.sources }]);
      } else {
        const results = await searchMultipleReligions(selectedReligions, query);
        const formattedResults = results.map(({ religion, result }) => ({
          religion,
          answer: result.answer,
          verses: result.sources,
        }));
        setSearchResults(formattedResults);

        // Get comparative analysis if we have results from multiple religions
        if (formattedResults.length >= 2 && formattedResults.some(r => r.answer)) {
          try {
            const analysis = await getComparativeAnalysis(
              selectedReligions,
              query,
              formattedResults.map(r => ({ religion: r.religion, answer: r.answer }))
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

  // Apply theme classes
  const themeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 dark',
    sepia: 'bg-amber-50',
  };

  const textThemeClasses = {
    light: 'text-gray-900',
    dark: 'text-gray-100',
    sepia: 'text-amber-900',
  };

  const fontFamilyClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    dyslexic: 'font-mono',
  };

  return (
    <div
      className={`min-h-screen ${themeClasses[readingPreferences.theme]} ${fontFamilyClasses[readingPreferences.fontFamily]}`}
      style={{ fontSize: `${readingPreferences.fontSize}px` }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-white dark:bg-gray-800 sepia:bg-amber-100 text-gray-900 dark:text-gray-100 sepia:text-amber-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-white/50 dark:hover:bg-gray-800/50 sepia:hover:bg-amber-100/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-white dark:bg-gray-800 sepia:bg-amber-100 text-gray-900 dark:text-gray-100 sepia:text-amber-900 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-white/50 dark:hover:bg-gray-800/50 sepia:hover:bg-amber-100/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
        </nav>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="space-y-8">
            {searchResults.length === 0 && !isLoading && <DailyWisdom />}
            <ReligionSelector />
            <SearchBar onSearch={handleSearch} />
            {searchResults.length === 0 && !isLoading && (
              <>
                <TopicExplorer onTopicSelect={handleSearch} />
                <LearningPaths onStepSelect={(query) => handleSearch(query)} />
              </>
            )}
            <SearchResults results={searchResults} isLoading={isLoading} comparativeAnalysis={comparativeAnalysis} />
          </div>
        ) : (
          <SavedLibrary />
        )}
      </main>

      <ChatDrawer />
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
    </div>
  );
}

export default App;
