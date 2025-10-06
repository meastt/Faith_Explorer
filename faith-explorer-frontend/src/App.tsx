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
import { TabButton } from './components/TabButton';
import { Footer } from './components/Footer';
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
  const { viewMode, selectedSubsets, setIsSearching, incrementSearchUsage, clearSelectedSubsets } = useStore();
  const [searchResults, setSearchResults] = useState<SearchResultWithAnswer[]>([]);
  const [comparativeAnalysis, setComparativeAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Initialize scriptures on app start
  useEffect(() => {
    initializeScriptures();
  }, []);

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

  const handleClearResults = () => {
    setSearchResults([]);
    setComparativeAnalysis('');
    clearSelectedSubsets(); // Reset selected religions/subsets
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

  // Apply theme classes
  const themeClasses = {
    light: 'bg-gray-50',
    dark: 'bg-gray-900 dark',
    sepia: 'bg-amber-50',
  };

  const fontFamilyClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
    dyslexic: 'font-mono',
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClasses[readingPreferences.theme]} ${fontFamilyClasses[readingPreferences.fontFamily]}`}
      style={{ fontSize: `${readingPreferences.fontSize}px` }}
    >
      <Header />

      <main className="max-w-4xl mx-auto px-4 pt-8 pb-6 pb-safe">
        {/* Navigation */}
        <nav className="flex space-x-2 mb-8">
          <TabButton
            active={activeTab === 'search'}
            onClick={() => setActiveTab('search')}
            icon={Search}
            label="Search"
          />
          <TabButton
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            icon={Bookmark}
            label="Saved"
          />
        </nav>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="space-y-4">
            {searchResults.length === 0 && !isLoading && <DailyWisdom />}
            <ReligionSelector />
            <SearchBar onSearch={handleSearch} />
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

      <Footer />
      <ChatDrawer />
      {showOnboarding && <OnboardingModal onClose={handleCloseOnboarding} />}
    </div>
  );
}

export default App;
