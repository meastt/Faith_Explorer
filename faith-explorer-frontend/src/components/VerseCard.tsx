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
    <div className="bg-white rounded-lg shadow-sm border-l-4 p-4 hover:shadow-md transition-shadow" style={{ borderColor: color }}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color }}>
              {religionInfo?.name}
            </span>
            <span className="text-sm text-gray-600">•</span>
            <span className="text-sm font-medium text-gray-700">{verse.reference}</span>
          </div>
          <p className="text-gray-800 leading-relaxed">{verse.text}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={onChatClick}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Chat
        </button>
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            isSaved
              ? 'text-green-600 bg-green-50 cursor-default'
              : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
          {isSaved ? 'Saved' : 'Save'}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
      </div>
    </div>
  );
}
