import { MessageCircle, Share2, Trash2, Edit3, ChevronDown, ChevronUp, Calendar, Folder as FolderIcon, Tag, Plus, X as XIcon, Highlighter } from 'lucide-react';
import { useState, useRef } from 'react';
import type { SavedVerse, Highlight } from '../types';
import { useStore } from '../store/useStore';
import { shareVerse, copyToClipboard, formatDate } from '../utils/helpers';
import { RELIGIONS } from '../types';

interface SavedVerseCardProps {
  verse: SavedVerse;
  isExpanded: boolean;
  onToggle: () => void;
}

export function SavedVerseCard({ verse, isExpanded, onToggle }: SavedVerseCardProps) {
  const { updateVerseNotes, deleteVerse, setActiveVerseChat, incrementShareCount, folders, moveVerseToFolder, addTagToVerse, removeTagFromVerse, addHighlightToVerse, removeHighlightFromVerse, updateHighlightColor } = useStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editNotes, setEditNotes] = useState(verse.notes);
  const [showFolderMenu, setShowFolderMenu] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<Highlight['color']>('yellow');
  const verseTextRef = useRef<HTMLDivElement>(null);

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

  const handleMoveToFolder = (folderId: string | null) => {
    moveVerseToFolder(verse.id, folderId);
    setShowFolderMenu(false);
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (tag && !verse.tags.includes(tag)) {
      addTagToVerse(verse.id, tag);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const handleRemoveTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeTagFromVerse(verse.id, tag);
  };

  const handleTextSelection = () => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString().trim();

    if (selectedText.length === 0) return;

    // Calculate start and end positions in the verse text
    const preRange = document.createRange();
    preRange.selectNodeContents(verseTextRef.current!);
    preRange.setEnd(range.startContainer, range.startOffset);
    const start = preRange.toString().length;
    const end = start + selectedText.length;

    // Create highlight
    const highlight: Highlight = {
      id: `highlight-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      start,
      end,
      color: selectedHighlightColor,
    };

    addHighlightToVerse(verse.id, highlight);

    // Clear selection
    selection.removeAllRanges();
  };

  const handleRemoveHighlight = (highlightId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeHighlightFromVerse(verse.id, highlightId);
  };

  const highlightColorMap = {
    yellow: '#fef08a',
    green: '#86efac',
    blue: '#93c5fd',
    red: '#fca5a5',
  };

  // Render text with highlights
  const renderHighlightedText = () => {
    const highlights = verse.highlights || [];
    if (highlights.length === 0) {
      return <span>{verse.text}</span>;
    }

    // Sort highlights by start position
    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);

    const segments: JSX.Element[] = [];
    let lastEnd = 0;

    sortedHighlights.forEach((highlight, idx) => {
      // Add text before highlight
      if (highlight.start > lastEnd) {
        segments.push(
          <span key={`text-${idx}`}>
            {verse.text.slice(lastEnd, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      segments.push(
        <mark
          key={`highlight-${highlight.id}`}
          style={{ backgroundColor: highlightColorMap[highlight.color] }}
          className="px-0.5 rounded cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            if (isHighlighting) {
              e.stopPropagation();
              handleRemoveHighlight(highlight.id, e);
            }
          }}
          title={isHighlighting ? "Click to remove highlight" : ""}
        >
          {verse.text.slice(highlight.start, highlight.end)}
        </mark>
      );

      lastEnd = highlight.end;
    });

    // Add remaining text
    if (lastEnd < verse.text.length) {
      segments.push(
        <span key="text-end">
          {verse.text.slice(lastEnd)}
        </span>
      );
    }

    return <>{segments}</>;
  };

  // Get current folder
  const currentFolder = folders.find(f => f.id === verse.folderId);

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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 sepia:text-amber-900">
                  {verse.reference}
                </p>
                {currentFolder && (
                  <span
                    className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium"
                    style={{
                      backgroundColor: `${currentFolder.color}20`,
                      color: currentFolder.color
                    }}
                  >
                    <FolderIcon className="w-2.5 h-2.5 mr-0.5" />
                    {currentFolder.name}
                  </span>
                )}
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
          {/* Highlighting Controls */}
          {isHighlighting && (
            <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Highlighter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-700 dark:text-blue-300">
                Select text to highlight
              </span>
              <div className="flex gap-1 ml-auto">
                {(['yellow', 'green', 'blue', 'red'] as const).map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedHighlightColor(c)}
                    className={`w-6 h-6 rounded-full border-2 transition-transform ${
                      selectedHighlightColor === c ? 'border-gray-700 dark:border-gray-300 scale-110' : 'border-gray-300 dark:border-gray-600'
                    }`}
                    style={{ backgroundColor: highlightColorMap[c] }}
                    title={`${c} highlight`}
                  />
                ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHighlighting(false);
                }}
                className="ml-2 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Done
              </button>
            </div>
          )}

          <blockquote
            ref={verseTextRef}
            onMouseUp={handleTextSelection}
            className={`text-sm text-gray-700 dark:text-gray-300 sepia:text-amber-800 leading-relaxed pl-3 border-l-2 ${isHighlighting ? 'select-text cursor-text' : ''}`}
            style={{ borderColor: color }}
          >
            "{renderHighlightedText()}"
          </blockquote>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 items-center">
            {verse.tags.filter(tag => tag !== 'AI Insight').map(tag => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
                <button
                  onClick={(e) => handleRemoveTag(tag, e)}
                  className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                >
                  <XIcon className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}

            {isAddingTag ? (
              <div className="inline-flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                    if (e.key === 'Escape') {
                      setIsAddingTag(false);
                      setNewTag('');
                    }
                  }}
                  onBlur={handleAddTag}
                  placeholder="Tag name..."
                  autoFocus
                  className="w-32 px-2 py-1 text-xs bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingTag(true);
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add tag
              </button>
            )}
          </div>

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

        {/* Folder Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFolderMenu(!showFolderMenu);
            }}
            className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100 rounded-md transition-all duration-200"
            title="Move to folder"
          >
            <FolderIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Folder</span>
          </button>

          {showFolderMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowFolderMenu(false)}
              />
              <div className="absolute bottom-full left-0 mb-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 py-1 max-h-64 overflow-y-auto">
                <div className="px-2 py-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Move to folder
                </div>
                <button
                  onClick={() => handleMoveToFolder(null)}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    !verse.folderId ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Unfiled
                </button>
                {folders.map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => handleMoveToFolder(folder.id)}
                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-1.5 ${
                      verse.folderId === folder.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <FolderIcon className="w-3 h-3" style={{ color: folder.color }} />
                    <span>{folder.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsHighlighting(!isHighlighting);
          }}
          className={`flex items-center gap-1 px-2 py-1.5 text-xs font-medium transition-all duration-200 rounded-md ${
            isHighlighting
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 sepia:text-amber-600 hover:text-gray-700 dark:hover:text-gray-300 sepia:hover:text-amber-800 hover:bg-gray-50 dark:hover:bg-gray-700 sepia:hover:bg-amber-100'
          }`}
          title="Highlight text"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Highlight</span>
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

