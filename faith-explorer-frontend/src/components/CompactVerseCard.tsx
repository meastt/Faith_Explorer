import { MessageCircle, BookmarkPlus, Share2, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react';
import type { Verse, Religion } from '../types';
import { useStore } from '../store/useStore';
import { generateId, shareVerse, copyToClipboard, getReligionColor } from '../utils/helpers';
import { RELIGIONS } from '../types';

interface CompactVerseCardProps {
  verse: Verse;
  religion: Religion;
  isExpanded: boolean;
  onToggle: () => void;
  onChatClick?: () => void;
}

export function CompactVerseCard({ verse, religion, isExpanded, onToggle, onChatClick }: CompactVerseCardProps) {
  const { saveVerse, savedVerses, incrementSaveCount, incrementShareCount } = useStore();
  const isSaved = savedVerses.some((v) => v.reference === verse.reference && v.text === verse.text);

  const religionInfo = RELIGIONS.find((r) => r.id === religion);
  const color = religionInfo?.color || getReligionColor(religion);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSaved) {
      saveVerse({
        ...verse,
        religion,
        id: generateId(),
        savedAt: Date.now(),
        notes: '',
        tags: [],
      });
      incrementSaveCount();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareText = shareVerse(verse.reference, verse.text);
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
    onChatClick?.();
  };

  // Get preview text (first 100 characters)
  const previewText = verse.text.length > 100 ? verse.text.slice(0, 100) + '...' : verse.text;

  return (
    <div 
      className={`bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 transition-all duration-200 ${
        isExpanded ? 'shadow-medium' : 'shadow-soft hover:shadow-medium'
      }`}
    >
      {/* Always Visible Header - Clickable to expand/collapse */}
      <div 
        onClick={onToggle}
        className="p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 sepia:hover:bg-amber-100/50 transition-colors rounded-t-xl"
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
              <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                {verse.reference}
              </p>
              {!isExpanded && (
                <p className="text-xs text-gray-600 dark:text-gray-400 sepia:text-amber-700 mt-0.5 line-clamp-2">
                  "{previewText}"
                </p>
              )}
            </div>
          </div>

          {/* Expand/Collapse Icon */}
          <div className="flex-shrink-0">
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
        <div className="px-3 pb-3">
          <blockquote className="text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 italic leading-relaxed mb-3 pl-3 border-l-2" style={{ borderColor: color }}>
            "{verse.text}"
          </blockquote>
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
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
            isSaved
              ? 'text-green-600 dark:text-green-400 sepia:text-green-700 bg-green-50 dark:bg-green-900/30 sepia:bg-green-100/50'
              : 'text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100'
          }`}
          title={isSaved ? 'Already saved' : 'Save verse'}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
          title="Share verse"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}

