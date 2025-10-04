import { useState } from 'react';
import { Search, Library } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ReligionSelector } from './components/ReligionSelector';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { ChatDrawer } from './components/ChatDrawer';
import { SavedLibrary } from './components/SavedLibrary';
import { useStore } from './store/useStore';
import { searchReligion, searchMultipleReligions } from './services/api';
import type { Religion, Verse } from './types';

type Tab = 'search' | 'saved';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('search');
  const { viewMode, selectedReligions, setIsSearching, incrementSearchUsage } = useStore();
  const [searchResults, setSearchResults] = useState<{ religion: Religion; verses: Verse[] }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    // Check usage limit
    if (!incrementSearchUsage()) {
      alert('You have reached your free search limit. Please upgrade to Premium for unlimited searches.');
      return;
    }

    setIsLoading(true);
    setIsSearching(true);
    setSearchResults([]);

    try {
      if (viewMode === 'single') {
        const religion = selectedReligions[0];
        const result = await searchReligion(religion, query);
        setSearchResults([{ religion, verses: result.sources }]);
      } else {
        const results = await searchMultipleReligions(selectedReligions, query);
        setSearchResults(
          results.map(({ religion, result }) => ({
            religion,
            verses: result.sources,
          }))
        );
      }
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sage-50 via-white to-primary-50/20">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex bg-white rounded-xl p-1 shadow-soft border border-sage-200 gap-1">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft'
                  : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-soft'
                  : 'text-sage-600 hover:text-sage-900 hover:bg-sage-50'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Library</span>
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="space-y-6">
            <ReligionSelector />
            <SearchBar onSearch={handleSearch} />
            <SearchResults results={searchResults} isLoading={isLoading} />
          </div>
        ) : (
          <SavedLibrary />
        )}
      </main>

      <Footer />
      <ChatDrawer />
    </div>
  );
}

export default App;
