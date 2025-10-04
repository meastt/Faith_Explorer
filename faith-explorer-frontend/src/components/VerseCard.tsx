import { MessageCircle, BookmarkPlus, Share2, BookmarkCheck } from 'lucide-react';
import type { Verse, Religion } from '../types';
import { useStore } from '../store/useStore';
import { generateId, shareVerse, copyToClipboard, getReligionColor } from '../utils/helpers';
import { RELIGIONS } from '../types';

interface VerseCardProps {
  verse: Verse;
  religion: Religion;
  onChatClick?: () => void;
}

export function VerseCard({ verse, religion, onChatClick }: VerseCardProps) {
  const { saveVerse, savedVerses } = useStore();
  const isSaved = savedVerses.some((v) => v.reference === verse.reference && v.text === verse.text);

  const religionInfo = RELIGIONS.find((r) => r.id === religion);
  const color = religionInfo?.color || getReligionColor(religion);

  const handleSave = () => {
    if (!isSaved) {
      saveVerse({
        ...verse,
        religion,
        id: generateId(),
        savedAt: Date.now(),
        notes: '',
        tags: [],
      });
    }
  };

  const handleShare = async () => {
    const shareText = shareVerse(verse.reference, verse.text);
    try {
      await copyToClipboard(shareText);
      alert('Verse copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-soft hover:shadow-soft-lg border border-sage-200 overflow-hidden transition-all duration-300">
      {/* Color accent bar */}
      <div className="h-1.5" style={{ backgroundColor: color }}></div>
      
      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-soft"
            style={{ backgroundColor: `${color}15` }}
          >
            <span className="text-lg font-bold" style={{ color }}>
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

        {/* Content */}
        <div className="mb-5">
          <p className="text-sage-800 leading-relaxed text-sm sm:text-base font-serif">
            "{verse.text}"
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-sage-100">
          <button
            onClick={onChatClick}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors duration-200"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Discuss</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaved}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${
              isSaved
                ? 'text-green-700 bg-green-50 cursor-default'
                : 'text-sage-700 bg-sage-100 hover:bg-sage-200'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <BookmarkPlus className="w-4 h-4" />
                <span>Save</span>
              </>
            )}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sage-700 bg-sage-100 hover:bg-sage-200 rounded-lg transition-colors duration-200"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
