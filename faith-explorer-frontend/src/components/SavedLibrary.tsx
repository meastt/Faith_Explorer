import { BookmarkCheck, Search, Filter, Download, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { SavedVerseCard } from './SavedVerseCard';
import { exportCollection } from '../utils/export';
import { RELIGIONS, type Religion } from '../types';

type SortOption = 'date-desc' | 'date-asc' | 'religion' | 'reference';

export function SavedLibrary() {
  const { savedVerses } = useStore();
  const [expandedVerseId, setExpandedVerseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReligion, setFilterReligion] = useState<Religion | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  const handleVerseToggle = (verseId: string) => {
    setExpandedVerseId(expandedVerseId === verseId ? null : verseId);
  };

  // Filter, search, and sort verses
  const filteredVerses = useMemo(() => {
    let filtered = savedVerses.filter(verse => {
      // Religion filter
      if (filterReligion !== 'all' && verse.religion !== filterReligion) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          verse.text.toLowerCase().includes(query) ||
          verse.reference.toLowerCase().includes(query) ||
          verse.notes.toLowerCase().includes(query) ||
          RELIGIONS.find(r => r.id === verse.religion)?.name.toLowerCase().includes(query)
        );
      }

      return true;
    });

    // Sort filtered verses
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return b.savedAt - a.savedAt;
        case 'date-asc':
          return a.savedAt - b.savedAt;
        case 'religion':
          const religionA = RELIGIONS.find(r => r.id === a.religion)?.name || '';
          const religionB = RELIGIONS.find(r => r.id === b.religion)?.name || '';
          return religionA.localeCompare(religionB);
        case 'reference':
          return a.reference.localeCompare(b.reference);
        default:
          return 0;
      }
    });
  }, [savedVerses, searchQuery, filterReligion, sortBy]);

  // Get unique religions from saved verses
  const savedReligions = useMemo(() => {
    const religions = new Set(savedVerses.map(v => v.religion).filter(Boolean));
    return Array.from(religions);
  }, [savedVerses]);

  if (savedVerses.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-soft border border-sage-200 dark:border-gray-700 sepia:border-amber-200 p-12 sm:p-16 text-center">
        <div className="w-20 h-20 bg-sage-100 dark:bg-gray-700 sepia:bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookmarkCheck className="w-10 h-10 text-sage-400 dark:text-gray-400 sepia:text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-2">No Saved Verses Yet</h3>
        <p className="text-sage-600 dark:text-gray-400 sepia:text-amber-700 max-w-md mx-auto">
          Save meaningful verses while searching to build your personal collection of wisdom
        </p>
      </div>
    );
  }

  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleExport = (format: 'markdown' | 'mla' | 'apa' | 'chicago') => {
    exportCollection(filteredVerses, format);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900">Your Saved Collection</h2>
          <p className="text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700 mt-1">
            {filteredVerses.length} of {savedVerses.length} {savedVerses.length === 1 ? 'verse' : 'verses'}
          </p>
        </div>

        {savedVerses.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowExportMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 z-20 py-2">
                  <button
                    onClick={() => handleExport('markdown')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100 sepia:text-amber-900">Markdown</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700">Formatted document</div>
                  </button>
                  <div className="border-t border-gray-100 dark:border-gray-700 sepia:border-amber-200 my-1" />
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 sepia:text-amber-600">Citations</div>
                  <button
                    onClick={() => handleExport('mla')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    MLA Format
                  </button>
                  <button
                    onClick={() => handleExport('apa')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    APA Format
                  </button>
                  <button
                    onClick={() => handleExport('chicago')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                  >
                    Chicago Format
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Search, Filter, and Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your saved verses..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 sepia:bg-amber-50 border border-gray-300 dark:border-gray-600 sepia:border-amber-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sepia:text-amber-900 placeholder-gray-500 dark:placeholder-gray-400 sepia:placeholder-amber-600"
          />
        </div>

        <div className="relative sm:w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={filterReligion}
            onChange={(e) => setFilterReligion(e.target.value as Religion | 'all')}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 sepia:bg-amber-50 border border-gray-300 dark:border-gray-600 sepia:border-amber-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sepia:text-amber-900 appearance-none"
          >
            <option value="all">All Religions</option>
            {savedReligions.map(religionId => {
              const religion = RELIGIONS.find(r => r.id === religionId);
              return religion ? (
                <option key={religionId} value={religionId}>
                  {religion.name}
                </option>
              ) : null;
            })}
          </select>
        </div>

        <div className="relative sm:w-48">
          <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 sepia:bg-amber-50 border border-gray-300 dark:border-gray-600 sepia:border-amber-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 sepia:text-amber-900 appearance-none"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="religion">By Religion</option>
            <option value="reference">By Reference</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {filteredVerses.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-soft border border-sage-200 dark:border-gray-700 sepia:border-amber-200 p-12 text-center">
          <div className="w-16 h-16 bg-sage-100 dark:bg-gray-700 sepia:bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-sage-400 dark:text-gray-400 sepia:text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-2">No verses found</h3>
          <p className="text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredVerses.map((verse) => (
            <SavedVerseCard
              key={verse.id}
              verse={verse}
              isExpanded={expandedVerseId === verse.id}
              onToggle={() => handleVerseToggle(verse.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
