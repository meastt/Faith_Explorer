import { BookmarkCheck, Trash2, Edit3, Share2, MessageCircle, Calendar, Search, Filter, Download } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { formatDate, shareVerse, copyToClipboard } from '../utils/helpers';
import { exportCollection } from '../utils/export';
import { RELIGIONS, type Religion } from '../types';

export function SavedLibrary() {
  const { savedVerses, updateVerseNotes, deleteVerse, setActiveVerseChat } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReligion, setFilterReligion] = useState<Religion | 'all'>('all');

  const handleEditNotes = (id: string, currentNotes: string) => {
    setEditingId(id);
    setEditNotes(currentNotes);
  };

  const handleSaveNotes = (id: string) => {
    updateVerseNotes(id, editNotes);
    setEditingId(null);
  };

  const handleShare = async (reference: string, text: string, notes: string) => {
    const shareText = shareVerse(reference, text, notes);
    try {
      await copyToClipboard(shareText);
      alert('Verse copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Filter and search verses
  const filteredVerses = useMemo(() => {
    return savedVerses.filter(verse => {
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
  }, [savedVerses, searchQuery, filterReligion]);

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

      {/* Search and Filter */}
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
        <div className="grid gap-4">
          {filteredVerses.map((verse) => {
          const religionInfo = RELIGIONS.find((r) => r.id === verse.religion);
          const isEditing = editingId === verse.id;

          return (
            <div
              key={verse.id}
              className="group bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl shadow-soft hover:shadow-soft-lg border border-sage-200 dark:border-gray-700 sepia:border-amber-200 overflow-hidden transition-all duration-300"
            >
              {/* Color accent bar */}
              <div className="h-1.5" style={{ backgroundColor: religionInfo?.color }}></div>
              
              <div className="p-5 sm:p-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft"
                      style={{ backgroundColor: `${religionInfo?.color}15` }}
                    >
                      <span className="text-lg font-bold" style={{ color: religionInfo?.color }}>
                        {religionInfo?.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 text-sm sm:text-base truncate">
                        {religionInfo?.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-sage-500 dark:text-gray-400 sepia:text-amber-600 truncate">
                        {verse.reference}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sage-500 dark:text-gray-400 sepia:text-amber-600 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{formatDate(verse.savedAt)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-sage-800 dark:text-gray-200 sepia:text-amber-800 leading-relaxed text-sm sm:text-base font-serif">
                    "{verse.text}"
                  </p>
                </div>

                {/* Notes Section */}
                <div className="pt-4 border-t border-sage-100 dark:border-gray-700 sepia:border-amber-200">
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add your personal notes and reflections..."
                        className="w-full px-4 py-3 bg-sage-50 dark:bg-gray-700 sepia:bg-amber-100 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-600 sepia:focus:bg-amber-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-sm placeholder-sage-400 dark:placeholder-gray-400 sepia:placeholder-amber-600 text-sage-900 dark:text-gray-100 sepia:text-amber-900 resize-none transition-all duration-200"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveNotes(verse.id)}
                          className="px-4 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-soft hover:shadow-soft-lg transition-all duration-200"
                        >
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 text-sm font-semibold bg-sage-100 text-sage-700 rounded-lg hover:bg-sage-200 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {verse.notes && (
                        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 sepia:bg-amber-100 border border-amber-200 dark:border-amber-700/30 sepia:border-amber-300 rounded-xl">
                          <p className="text-sm text-amber-900 dark:text-amber-100 sepia:text-amber-800 italic leading-relaxed">
                            {verse.notes}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleEditNotes(verse.id, verse.notes)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sage-700 dark:text-gray-300 sepia:text-amber-700 bg-sage-100 dark:bg-gray-700 sepia:bg-amber-100 hover:bg-sage-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded-lg transition-colors duration-200"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>{verse.notes ? 'Edit Notes' : 'Add Notes'}</span>
                        </button>
                        <button
                          onClick={() => {
                            if (verse.religion) {
                              setActiveVerseChat({
                                verseReference: verse.reference,
                                verseText: verse.text,
                                religion: verse.religion,
                                messages: [],
                              });
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 dark:text-primary-300 sepia:text-primary-700 bg-primary-50 dark:bg-primary-900/20 sepia:bg-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900/30 sepia:hover:bg-primary-200 rounded-lg transition-colors duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Discuss</span>
                        </button>
                        <button
                          onClick={() => handleShare(verse.reference, verse.text, verse.notes)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sage-700 dark:text-gray-300 sepia:text-amber-700 bg-sage-100 dark:bg-gray-700 sepia:bg-amber-100 hover:bg-sage-200 dark:hover:bg-gray-600 sepia:hover:bg-amber-200 rounded-lg transition-colors duration-200"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Share</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to remove this verse from your collection?')) {
                              deleteVerse(verse.id);
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 dark:text-red-300 sepia:text-red-700 bg-red-50 dark:bg-red-900/20 sepia:bg-red-100 hover:bg-red-100 dark:hover:bg-red-900/30 sepia:hover:bg-red-200 rounded-lg transition-colors duration-200 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
