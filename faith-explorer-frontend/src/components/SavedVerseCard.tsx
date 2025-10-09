import { MessageCircle, Share2, Trash2, Edit3, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { SavedVerse } from '../types';
import { useStore } from '../store/useStore';
import { shareVerse, copyToClipboard, formatDate } from '../utils/helpers';
import { RELIGIONS } from '../types';

interface SavedVerseCardProps {
  verse: SavedVerse;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SavedVerseCard({ verse, isExpanded, onToggle }: SavedVerseCardProps) {
  const { updateVerseNotes, deleteVerse, setActiveVerseChat, incrementShareCount } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(verse.notes);

  const religionInfo = RELIGIONS.find((r) => r.id === verse.religion);
  const color = religionInfo?.color || '#6B7280';

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = shareVerse(verse.reference, verse.text, verse.notes);
    try {
      await copyToClipboard(shareText);
      incrementShareCount();
      alert('Verse copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (verse.religion) {
      setActiveVerseChat({
        verseReference: verse.reference,
        verseText: verse.text,
        religion: verse.religion,
        messages: [],
      });
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this from your collection?')) {
      deleteVerse(verse.id);
    }
  };

  const handleSaveNotes = () => {
    updateVerseNotes(verse.id, editNotes);
    setIsEditing(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  // Get preview text (first 120 characters)
  const previewText = verse.text.length > 120 ? verse.text.slice(0, 120) + '...' : verse.text;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 transition-all duration-200 ${
        isExpanded ? 'shadow-medium' : 'shadow-soft hover:shadow-medium'
      }`}
    >
      {/* Color accent bar */}
      <div className="h-1" style={{ backgroundColor: color }}></div>

      {/* Always Visible Header - Clickable to expand/collapse */}
      <div 
        onClick={onToggle}
        className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 sepia:hover:bg-amber-100/50 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* Religion Icon */}
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-medium text-xs flex-shrink-0 mt-0.5"
              style={{ backgroundColor: color }}
            >
              {religionInfo?.name.charAt(0)}
            </div>
            
            {/* Reference & Preview */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                  {verse.reference}
                </p>
                {verse.tags?.includes('AI Insight') && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                    AI
                  </span>
                )}
              </div>
              {!isExpanded && (
                <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700 line-clamp-2">
                  "{previewText}"
                </p>
              )}
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span className="hidden sm:inline">{formatDate(verse.savedAt).split(',')[0]}</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          <blockquote className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 leading-relaxed pl-3 border-l-2" style={{ borderColor: color }}>
            "{verse.text}"
          </blockquote>

          {/* Notes Section */}
          <div>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add your personal notes and reflections..."
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 sepia:bg-amber-100 border border-gray-200 dark:border-gray-600 sepia:border-amber-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900 resize-none"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-3 py-1.5 text-xs font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : verse.notes && (
              <div className="p-2.5 bg-amber-50 dark:bg-amber-900/20 sepia:bg-amber-100 border border-amber-200 dark:border-amber-700/30 sepia:border-amber-300 rounded-lg">
                <p className="text-xs text-amber-900 dark:text-amber-100 sepia:text-amber-800 italic leading-relaxed">
                  💭 {verse.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions - Always Visible */}
      <div className="flex items-center gap-1 px-3 pb-3 pt-2 border-t border-gray-100 dark:border-gray-700 sepia:border-amber-200">
        <button
          onClick={handleChat}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 sepia:text-amber-700 hover:text-primary-700 dark:hover:text-primary-300 sepia:hover:text-amber-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
          title="Discuss this verse"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Discuss</span>
        </button>
        <button
          onClick={handleEditClick}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
          title="Add or edit notes"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{verse.notes ? 'Edit' : 'Note'}</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
          title="Share verse"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200 ml-auto"
          title="Delete verse"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Delete</span>
        </button>
      </div>
    </div>
  );
}

