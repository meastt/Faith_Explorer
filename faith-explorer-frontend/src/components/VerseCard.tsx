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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium text-sm"
            style={{ backgroundColor: color }}
          >
            {religionInfo?.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{religionInfo?.name}</h4>
            <p className="text-sm text-gray-500">{verse.reference}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <blockquote className="text-gray-700 italic leading-relaxed">
          "{verse.text}"
        </blockquote>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 pt-4 border-t border-gray-100">
        <button
          onClick={onChatClick}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Discuss</span>
        </button>
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
            isSaved
              ? 'text-green-600 bg-green-50'
              : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
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
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
