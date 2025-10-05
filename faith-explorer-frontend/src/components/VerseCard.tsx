import { MessageCircle, BookmarkPlus, Share2, BookmarkCheck, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { useState } from 'react';
import type { Verse, Religion } from '../types';
import { useStore } from '../store/useStore';
import { generateId, shareVerse, copyToClipboard, getReligionColor } from '../utils/helpers';
import { RELIGIONS } from '../types';
import { ICON_SIZES } from '../styles/design-system';

interface VerseCardProps {
  verse: Verse;
  religion: Religion;
  onChatClick?: () => void;
}

export function VerseCard({ verse, religion, onChatClick }: VerseCardProps) {
  const { saveVerse, savedVerses } = useStore();
  const isSaved = savedVerses.some((v) => v.reference === verse.reference && v.text === verse.text);
  const [showContext, setShowContext] = useState(false);

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
    <div className="bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-2xl border border-gray-200 dark:border-gray-700 sepia:border-amber-200 p-6 shadow-soft hover:shadow-medium transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-medium text-sm shadow-soft"
            style={{ backgroundColor: color }}
          >
            {religionInfo?.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900">{religionInfo?.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 sepia:text-amber-700">{verse.reference}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <blockquote className="text-gray-700 dark:text-gray-300 sepia:text-amber-800 italic leading-relaxed">
          "{verse.text}"
        </blockquote>
      </div>

      {/* Context Section */}
      {showContext && (
        <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-900 sepia:bg-amber-100 rounded-lg border border-gray-200 dark:border-gray-700 sepia:border-amber-300">
          <div className="flex items-start gap-2 mb-3">
            <BookOpen className={`${ICON_SIZES.SM} text-gray-500 dark:text-gray-400 sepia:text-amber-600 mt-0.5`} />
            <div className="flex-1">
              <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100 sepia:text-amber-900 mb-2">Context & Information</h5>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800">
                <div>
                  <span className="font-medium">Source:</span> {religionInfo?.text}
                </div>
                <div>
                  <span className="font-medium">Reference:</span> {verse.reference}
                </div>
                {verse.reference.includes(':') && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 sepia:bg-amber-100 rounded border border-blue-100 dark:border-blue-800 sepia:border-amber-300">
                    <p className="text-xs text-blue-800 dark:text-blue-200 sepia:text-amber-800">
                      <span className="font-semibold">Tip:</span> Click "Discuss" to ask about the surrounding context, historical background, or different interpretations of this passage.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center flex-wrap gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 sepia:border-amber-200">
        <button
          onClick={onChatClick}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-primary-600 dark:text-primary-400 sepia:text-amber-700 hover:text-primary-700 dark:hover:text-primary-300 sepia:hover:text-amber-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 sepia:hover:bg-amber-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          <MessageCircle className={ICON_SIZES.SM} />
          <span>Discuss</span>
        </button>
        <button
          onClick={() => setShowContext(!showContext)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <BookOpen className={ICON_SIZES.SM} />
          <span className="hidden sm:inline">Context</span>
          {showContext ? <ChevronUp className={ICON_SIZES.SM} /> : <ChevronDown className={ICON_SIZES.SM} />}
        </button>
        <button
          onClick={handleSave}
          disabled={isSaved}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isSaved
              ? 'text-green-600 dark:text-green-400 sepia:text-green-700 bg-green-50 dark:bg-green-900/30 sepia:bg-green-100/50'
              : 'text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100'
          }`}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className={ICON_SIZES.SM} />
              <span>Saved</span>
            </>
          ) : (
            <>
              <BookmarkPlus className={ICON_SIZES.SM} />
              <span>Save</span>
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          <Share2 className={ICON_SIZES.SM} />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>
    </div>
  );
}
