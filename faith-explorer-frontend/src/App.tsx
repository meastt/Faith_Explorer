import { useState } from 'react';
import { Search, BookmarkCheck } from 'lucide-react';
import { Header } from './components/Header';
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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search className="w-5 h-5" />
            Search
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'saved'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookmarkCheck className="w-5 h-5" />
            Saved
          </button>
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

      <ChatDrawer />
    </div>
  );
}

export default App;
