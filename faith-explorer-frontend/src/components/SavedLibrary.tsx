import { BookmarkCheck, Trash2, Edit3, Share2, MessageCircle, Calendar } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDate, shareVerse, copyToClipboard } from '../utils/helpers';
import { RELIGIONS } from '../types';

export function SavedLibrary() {
  const { savedVerses, updateVerseNotes, deleteVerse, setActiveVerseChat } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');

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

  if (savedVerses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft border border-sage-200 p-12 sm:p-16 text-center">
        <div className="w-20 h-20 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <BookmarkCheck className="w-10 h-10 text-sage-400" />
        </div>
        <h3 className="text-xl font-bold text-sage-900 mb-2">No Saved Verses Yet</h3>
        <p className="text-sage-600 max-w-md mx-auto">
          Save meaningful verses while searching to build your personal collection of wisdom
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-sage-900">Your Saved Collection</h2>
          <p className="text-sm text-sage-600 mt-1">
            {savedVerses.length} {savedVerses.length === 1 ? 'verse' : 'verses'} saved
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {savedVerses.map((verse) => {
          const religionInfo = RELIGIONS.find((r) => r.id === verse.religion);
          const isEditing = editingId === verse.id;

          return (
            <div
              key={verse.id}
              className="group bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-sage-200 overflow-hidden transition-all duration-300"
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
                      <h4 className="font-bold text-sage-900 text-sm sm:text-base truncate">
                        {religionInfo?.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-medium text-sage-500 truncate">
                        {verse.reference}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sage-500 flex-shrink-0">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{formatDate(verse.savedAt)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-4">
                  <p className="text-sage-800 leading-relaxed text-sm sm:text-base font-serif">
                    "{verse.text}"
                  </p>
                </div>

                {/* Notes Section */}
                <div className="pt-4 border-t border-sage-100">
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add your personal notes and reflections..."
                        className="w-full px-4 py-3 bg-sage-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-sm placeholder-sage-400 text-sage-900 resize-none transition-all duration-200"
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
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                          <p className="text-sm text-amber-900 italic leading-relaxed">
                            {verse.notes}
                          </p>
                        </div>
                      )}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => handleEditNotes(verse.id, verse.notes)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sage-700 bg-sage-100 hover:bg-sage-200 rounded-lg transition-colors duration-200"
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
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Discuss</span>
                        </button>
                        <button
                          onClick={() => handleShare(verse.reference, verse.text, verse.notes)}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sage-700 bg-sage-100 hover:bg-sage-200 rounded-lg transition-colors duration-200"
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
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200 ml-auto"
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
    </div>
  );
}
