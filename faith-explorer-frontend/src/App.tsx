import { useState } from 'react';
import { Search, Bookmark } from 'lucide-react';
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

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Navigation */}
        <nav className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'saved'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved</span>
          </button>
        </nav>

        {/* Content */}
        {activeTab === 'search' ? (
          <div className="space-y-8">
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
