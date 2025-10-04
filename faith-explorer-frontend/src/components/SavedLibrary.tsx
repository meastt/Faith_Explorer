import { BookmarkCheck, Trash2, Edit3, Share2 } from 'lucide-react';
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
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <BookmarkCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Verses</h3>
        <p className="text-gray-600">Save verses while searching to access them here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Saved Verses ({savedVerses.length})</h2>
      </div>

      <div className="space-y-4">
        {savedVerses.map((verse) => {
          const religionInfo = RELIGIONS.find((r) => r.id === verse.religion);
          const isEditing = editingId === verse.id;

          return (
            <div
              key={verse.id}
              className="bg-white rounded-lg shadow-sm border-l-4 p-4"
              style={{ borderColor: religionInfo?.color }}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold" style={{ color: religionInfo?.color }}>
                      {religionInfo?.name}
                    </span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm font-medium text-gray-700">{verse.reference}</span>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-xs text-gray-500">{formatDate(verse.savedAt)}</span>
                  </div>
                  <p className="text-gray-800 leading-relaxed">{verse.text}</p>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      placeholder="Add your notes..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveNotes(verse.id)}
                        className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Save Notes
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {verse.notes && (
                      <p className="text-sm text-gray-700 mb-2 italic">"{verse.notes}"</p>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditNotes(verse.id, verse.notes)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        {verse.notes ? 'Edit Notes' : 'Add Notes'}
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
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        Chat
                      </button>
                      <button
                        onClick={() => handleShare(verse.reference, verse.text, verse.notes)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this saved verse?')) {
                            deleteVerse(verse.id);
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
