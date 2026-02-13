import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Book, BookOpen, Bookmark, MessageCircle, Share2, ChevronDown, AlertTriangle, RefreshCw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { RELIGIONS } from '../types';
import type { Religion, Verse } from '../types';
import { loadScripture } from '../services/search';
import { shareVerse, copyToClipboard } from '../utils/helpers';
import { showToast } from './Toast';
import { useTranslation } from 'react-i18next';

interface ScriptureData {
    religion: string;
    source: string;
    verses: Verse[];
}

interface ReadingPosition {
    subsetId: string;
    book: string;
    chapter: number;
}

// Get available complete scriptures (not "coming soon")
const READABLE_SCRIPTURES = RELIGIONS.flatMap(religion =>
    (religion.subsets || [])
        .filter(subset => !subset.comingSoon && subset.fileName)
        .map(subset => ({
            religion: religion.id,
            religionName: religion.name,
            subsetId: subset.id,
            subsetName: subset.name,
            fileName: subset.fileName!,
            color: religion.color,
        }))
);

export function ScriptureReader() {
    const { setActiveVerseChat, saveVerse, incrementShareCount } = useStore();
    const { t } = useTranslation('search');
    const { t: tCommon } = useTranslation('common');

    // State
    const [selectedScripture, setSelectedScripture] = useState(READABLE_SCRIPTURES[0]);
    const [scriptureData, setScriptureData] = useState<ScriptureData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [selectedBook, setSelectedBook] = useState<string>('');
    const [selectedChapter, setSelectedChapter] = useState<number>(1);
    const [showScriptureSelector, setShowScriptureSelector] = useState(false);
    const [showBookSelector, setShowBookSelector] = useState(false);
    const [expandedVerseId, setExpandedVerseId] = useState<string | null>(null);

    // Load reading position from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('faithExplorer_readingPosition');
        if (saved) {
            try {
                const position: ReadingPosition = JSON.parse(saved);
                const scripture = READABLE_SCRIPTURES.find(s => s.subsetId === position.subsetId);
                if (scripture) {
                    setSelectedScripture(scripture);
                    setSelectedBook(position.book);
                    setSelectedChapter(position.chapter);
                }
            } catch (e) {
                console.error('Failed to load reading position:', e);
            }
        }
    }, []);

    // Save reading position
    useEffect(() => {
        if (selectedBook && selectedChapter) {
            const position: ReadingPosition = {
                subsetId: selectedScripture.subsetId,
                book: selectedBook,
                chapter: selectedChapter,
            };
            localStorage.setItem('faithExplorer_readingPosition', JSON.stringify(position));
        }
    }, [selectedScripture.subsetId, selectedBook, selectedChapter]);

    // Load scripture data when selection changes
    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            setLoadError(false);
            try {
                const verses = await loadScripture(selectedScripture.fileName);
                setScriptureData({
                    religion: selectedScripture.religion,
                    source: selectedScripture.subsetName,
                    verses,
                });

                // Set default book if not already set
                if (!selectedBook && verses.length > 0) {
                    const firstVerse = verses[0] as any;
                    const bookField = firstVerse.book || firstVerse.surah_name || 'Chapter 1';
                    setSelectedBook(bookField);
                    setSelectedChapter(firstVerse.chapter || firstVerse.surah || 1);
                }
            } catch (error) {
                console.error('Failed to load scripture:', error);
                setLoadError(true);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, [selectedScripture]);

    // Extract unique books/surahs from data
    const books = useMemo(() => {
        if (!scriptureData) return [];

        const bookMap = new Map<string, { name: string; chapters: Set<number> }>();

        scriptureData.verses.forEach((verse: any) => {
            const bookName = verse.book || verse.surah_name || `Chapter`;
            const chapter = verse.chapter || verse.surah || 1;

            if (!bookMap.has(bookName)) {
                bookMap.set(bookName, { name: bookName, chapters: new Set() });
            }
            bookMap.get(bookName)!.chapters.add(chapter);
        });

        return Array.from(bookMap.entries()).map(([name, data]) => ({
            name,
            chapters: Array.from(data.chapters).sort((a, b) => a - b),
        }));
    }, [scriptureData]);

    // Get chapters for selected book
    const chapters = useMemo(() => {
        const book = books.find(b => b.name === selectedBook);
        return book?.chapters || [];
    }, [books, selectedBook]);

    // Get verses for current chapter
    const currentVerses = useMemo(() => {
        if (!scriptureData) return [];

        return scriptureData.verses.filter((verse: any) => {
            const bookName = verse.book || verse.surah_name || 'Chapter';
            const chapter = verse.chapter || verse.surah || 1;
            return bookName === selectedBook && chapter === selectedChapter;
        });
    }, [scriptureData, selectedBook, selectedChapter]);

    // Navigation handlers
    const goToPreviousChapter = () => {
        const currentIndex = chapters.indexOf(selectedChapter);
        if (currentIndex > 0) {
            setSelectedChapter(chapters[currentIndex - 1]);
        } else {
            // Go to previous book's last chapter
            const bookIndex = books.findIndex(b => b.name === selectedBook);
            if (bookIndex > 0) {
                const prevBook = books[bookIndex - 1];
                setSelectedBook(prevBook.name);
                setSelectedChapter(prevBook.chapters[prevBook.chapters.length - 1]);
            }
        }
    };

    const goToNextChapter = () => {
        const currentIndex = chapters.indexOf(selectedChapter);
        if (currentIndex < chapters.length - 1) {
            setSelectedChapter(chapters[currentIndex + 1]);
        } else {
            // Go to next book's first chapter
            const bookIndex = books.findIndex(b => b.name === selectedBook);
            if (bookIndex < books.length - 1) {
                const nextBook = books[bookIndex + 1];
                setSelectedBook(nextBook.name);
                setSelectedChapter(nextBook.chapters[0]);
            }
        }
    };

    // Verse actions
    const handleSaveVerse = (verse: Verse) => {
        saveVerse({
            ...verse,
            religion: selectedScripture.religion as Religion,
            id: `reader-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            savedAt: Date.now(),
            notes: '',
            tags: [],
            highlights: [],
        });
        showToast(tCommon('toast.verseSaved'));
    };

    const handleChatVerse = (verse: Verse) => {
        setActiveVerseChat({
            verseReference: verse.reference,
            verseText: verse.text,
            religion: selectedScripture.religion as Religion,
            messages: [],
        });
    };

    const handleShareVerse = async (verse: Verse) => {
        const shareText = shareVerse(verse.reference, verse.text);
        try {
            await copyToClipboard(shareText);
            incrementShareCount();
            showToast(tCommon('toast.verseCopied'));
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-bronze-200 border-t-bronze-600 rounded-full animate-spin" />
                <p className="mt-4 text-stone-600 dark:text-stone-400 font-medium">{tCommon('loading.loadingScripture')}</p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 mb-2">{tCommon('errors.failedToLoadScripture')}</h3>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-4 text-center max-w-sm">
                    {tCommon('errors.checkConnection')}
                </p>
                <button
                    onClick={() => {
                        setLoadError(false);
                        setIsLoading(true);
                        loadScripture(selectedScripture.fileName)
                            .then(verses => {
                                setScriptureData({
                                    religion: selectedScripture.religion,
                                    source: selectedScripture.subsetName,
                                    verses,
                                });
                                if (verses.length > 0) {
                                    const firstVerse = verses[0] as any;
                                    setSelectedBook(firstVerse.book || firstVerse.surah_name || 'Chapter 1');
                                    setSelectedChapter(firstVerse.chapter || firstVerse.surah || 1);
                                }
                            })
                            .catch(() => setLoadError(true))
                            .finally(() => setIsLoading(false));
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-bronze-500 text-white rounded-xl hover:bg-bronze-600 transition-colors font-medium"
                >
                    <RefreshCw className="w-4 h-4" />
                    {tCommon('buttons.tryAgain')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Scripture Selector */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-soft border border-sand-200 dark:border-stone-700 p-4">
                <div className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${selectedScripture.color}20` }}
                    >
                        <BookOpen className="w-5 h-5" style={{ color: selectedScripture.color }} />
                    </div>

                    <button
                        onClick={() => setShowScriptureSelector(!showScriptureSelector)}
                        className="flex-1 text-left"
                    >
                        <p className="font-semibold text-stone-900 dark:text-stone-100">
                            {selectedScripture.subsetName}
                        </p>
                        <p className="text-sm text-stone-600 dark:text-stone-400">
                            {selectedScripture.religionName}
                        </p>
                    </button>

                    <ChevronDown className={`w-5 h-5 text-stone-400 transition-transform ${showScriptureSelector ? 'rotate-180' : ''}`} />
                </div>

                {/* Scripture Dropdown */}
                {showScriptureSelector && (
                    <div className="mt-4 pt-4 border-t border-sand-200 dark:border-stone-700 max-h-64 overflow-y-auto">
                        {READABLE_SCRIPTURES.map(scripture => (
                            <button
                                key={`${scripture.religion}-${scripture.subsetId}`}
                                onClick={() => {
                                    setSelectedScripture(scripture);
                                    setSelectedBook('');
                                    setSelectedChapter(1);
                                    setShowScriptureSelector(false);
                                }}
                                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${scripture.subsetId === selectedScripture.subsetId
                                    ? 'bg-bronze-50 dark:bg-bronze-900/20'
                                    : 'hover:bg-sand-50 dark:hover:bg-stone-700'
                                    }`}
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-medium text-sm"
                                    style={{ backgroundColor: scripture.color }}
                                >
                                    {scripture.religionName.charAt(0)}
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-stone-900 dark:text-stone-100">{scripture.subsetName}</p>
                                    <p className="text-xs text-stone-500 dark:text-stone-400">{scripture.religionName}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Book & Chapter Selector */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-soft border border-sand-200 dark:border-stone-700 p-4">
                <div className="flex items-center gap-3">
                    {/* Book Selector */}
                    <button
                        onClick={() => setShowBookSelector(!showBookSelector)}
                        className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-sand-50 dark:bg-stone-700 rounded-xl hover:bg-sand-100 dark:hover:bg-stone-600 transition-colors"
                    >
                        <Book className="w-4 h-4 text-bronze-600 dark:text-bronze-400" />
                        <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
                            {selectedBook || t('scriptureReader.selectBook')}
                        </span>
                        <ChevronDown className={`w-4 h-4 text-stone-400 ml-auto ${showBookSelector ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Chapter Selector */}
                    <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-stone-600 dark:text-stone-400">{t('scriptureReader.chapterAbbrev')}</span>
                        <select
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(Number(e.target.value))}
                            className="px-3 py-2.5 bg-sand-50 dark:bg-stone-700 rounded-xl font-medium text-stone-900 dark:text-stone-100 border-none focus:ring-2 focus:ring-bronze-500"
                        >
                            {chapters.map(ch => (
                                <option key={ch} value={ch}>{ch}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Book Dropdown */}
                {showBookSelector && (
                    <div className="mt-4 pt-4 border-t border-sand-200 dark:border-stone-700 max-h-64 overflow-y-auto grid grid-cols-2 gap-2">
                        {books.map(book => (
                            <button
                                key={book.name}
                                onClick={() => {
                                    setSelectedBook(book.name);
                                    setSelectedChapter(book.chapters[0]);
                                    setShowBookSelector(false);
                                }}
                                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${book.name === selectedBook
                                    ? 'bg-bronze-100 dark:bg-bronze-900/30 text-bronze-800 dark:text-bronze-200 font-medium'
                                    : 'hover:bg-sand-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300'
                                    }`}
                            >
                                {book.name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Chapter Navigation */}
            <div className="flex items-center justify-between gap-2">
                <button
                    onClick={goToPreviousChapter}
                    disabled={books.findIndex(b => b.name === selectedBook) === 0 && chapters.indexOf(selectedChapter) === 0}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-stone-800 rounded-xl shadow-soft border border-sand-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-sand-50 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">{tCommon('buttons.previous')}</span>
                </button>

                <div className="text-center">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">
                        {selectedBook} {selectedChapter}
                    </p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                        {currentVerses.length} {currentVerses.length === 1 ? t('searchResults.verse') : t('searchResults.verses')}
                    </p>
                </div>

                <button
                    onClick={goToNextChapter}
                    disabled={books.findIndex(b => b.name === selectedBook) === books.length - 1 && chapters.indexOf(selectedChapter) === chapters.length - 1}
                    className="flex items-center gap-1 px-4 py-2 bg-white dark:bg-stone-800 rounded-xl shadow-soft border border-sand-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-sand-50 dark:hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <span className="text-sm font-medium">{tCommon('buttons.next')}</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Verses */}
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-soft border border-sand-200 dark:border-stone-700 divide-y divide-sand-100 dark:divide-stone-700">
                {currentVerses.length === 0 ? (
                    <div className="p-8 text-center">
                        <Book className="w-12 h-12 mx-auto text-stone-300 dark:text-stone-600 mb-3" />
                        <p className="text-stone-600 dark:text-stone-400">{t('scriptureReader.noVersesForChapter')}</p>
                    </div>
                ) : (
                    currentVerses.map((verse, idx) => {
                        const verseNum = (verse as any).verse || idx + 1;
                        const verseId = (verse as any).id || `${verse.reference}-${idx}`;
                        const isExpanded = expandedVerseId === verseId;

                        return (
                            <div
                                key={verseId}
                                className="p-4 hover:bg-sand-50/50 dark:hover:bg-stone-700/50 transition-colors"
                            >
                                <div
                                    onClick={() => setExpandedVerseId(isExpanded ? null : verseId)}
                                    className="cursor-pointer"
                                >
                                    <span
                                        className="inline-block w-8 text-xs font-bold mr-2 text-bronze-600 dark:text-bronze-400"
                                    >
                                        {verseNum}
                                    </span>
                                    <span className="text-stone-800 dark:text-stone-200 leading-relaxed">
                                        {verse.text}
                                    </span>
                                </div>

                                {/* Verse Actions */}
                                {isExpanded && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-sand-100 dark:border-stone-700">
                                        <button
                                            onClick={() => handleSaveVerse(verse)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-bronze-600 dark:hover:text-bronze-400 hover:bg-bronze-50 dark:hover:bg-bronze-900/20 rounded-lg transition-colors"
                                        >
                                            <Bookmark className="w-3.5 h-3.5" />
                                            {tCommon('buttons.save')}
                                        </button>
                                        <button
                                            onClick={() => handleChatVerse(verse)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-bronze-600 dark:hover:text-bronze-400 hover:bg-bronze-50 dark:hover:bg-bronze-900/20 rounded-lg transition-colors"
                                        >
                                            <MessageCircle className="w-3.5 h-3.5" />
                                            {tCommon('buttons.discuss')}
                                        </button>
                                        <button
                                            onClick={() => handleShareVerse(verse)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-bronze-600 dark:hover:text-bronze-400 hover:bg-bronze-50 dark:hover:bg-bronze-900/20 rounded-lg transition-colors"
                                        >
                                            <Share2 className="w-3.5 h-3.5" />
                                            {tCommon('buttons.share')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
