import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Religion,
  ReligionSubsetId,
  ViewMode,
  SavedVerse,
  SavedComparison,
  VerseChat,
  FreemiumUsage,
  SelectedSubset,
  Folder,
} from '../types';

export interface ReadingPreferences {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'dyslexic';
}

export interface ReviewPromptState {
  savesCount: number;
  sharesCount: number;
  timesShown: number;
  lastShownDate: number | null;
  status: 'pending' | 'later' | 'reviewed' | 'dismissed';
}

interface AppState {
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selected religions (legacy - for backward compatibility)
  selectedReligions: Religion[];
  setSelectedReligions: (religions: Religion[]) => void;
  toggleReligion: (religion: Religion) => void;

  // Selected subsets (new approach)
  selectedSubsets: SelectedSubset[];
  setSelectedSubsets: (subsets: SelectedSubset[]) => void;
  toggleSubset: (religion: Religion, subset: ReligionSubsetId) => void;
  clearSelectedSubsets: () => void;

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;

  // Folders
  folders: Folder[];
  createFolder: (name: string, color?: string) => Folder;
  renameFolder: (id: string, name: string) => void;
  deleteFolder: (id: string) => void;

  // Saved verses
  savedVerses: SavedVerse[];
  saveVerse: (verse: SavedVerse) => void;
  updateVerseNotes: (id: string, notes: string) => void;
  moveVerseToFolder: (verseId: string, folderId: string | null) => void;
  deleteVerse: (id: string) => void;

  // Saved comparisons
  savedComparisons: SavedComparison[];
  saveComparison: (comparison: SavedComparison) => void;
  updateComparisonNotes: (id: string, notes: string) => void;
  deleteComparison: (id: string) => void;

  // Active verse chat
  activeVerseChat: VerseChat | null;
  setActiveVerseChat: (chat: VerseChat | null) => void;
  addChatMessage: (message: { role: 'user' | 'assistant'; content: string }) => void;

  // Freemium usage
  usage: FreemiumUsage;
  canSearch: () => boolean; // checks if search is allowed without incrementing
  incrementSearchUsage: () => boolean; // returns true if allowed and increments
  canChat: () => boolean; // checks if chat is allowed without incrementing
  incrementChatUsage: () => boolean; // returns true if allowed and increments
  setPremium: (isPremium: boolean) => void;
  resetUsage: () => void;

  // Reading preferences
  readingPreferences: ReadingPreferences;
  setReadingPreferences: (preferences: ReadingPreferences) => void;

  // Review prompt
  reviewPrompt: ReviewPromptState;
  incrementSaveCount: () => void;
  incrementShareCount: () => void;
  setReviewPromptShown: () => void;
  setReviewPromptStatus: (status: 'later' | 'reviewed' | 'dismissed') => void;
  shouldShowReviewPrompt: () => boolean;
}

const getInitialUsage = (): FreemiumUsage => {
  const now = Date.now();
  return {
    searchesUsed: 0,
    chatMessagesUsed: 0,
    searchLimit: 10,
    chatLimit: 20,
    isPremium: false,
    resetDate: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  };
};

const getDefaultFolders = (): Folder[] => {
  const now = Date.now();
  return [
    { id: 'favorites', name: 'Favorites', createdAt: now, color: '#f59e0b' },
    { id: 'to-study', name: 'To Study', createdAt: now, color: '#3b82f6' },
    { id: 'shared', name: 'Shared', createdAt: now, color: '#10b981' },
  ];
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      viewMode: 'single',
      selectedReligions: [],
      selectedSubsets: [],
      searchTerm: '',
      isSearching: false,
      folders: getDefaultFolders(),
      savedVerses: [],
      savedComparisons: [],
      activeVerseChat: null,
      usage: getInitialUsage(),
      readingPreferences: {
        theme: 'light',
        fontSize: 16,
        fontFamily: 'sans',
      },
      reviewPrompt: {
        savesCount: 0,
        sharesCount: 0,
        timesShown: 0,
        lastShownDate: null,
        status: 'pending',
      },

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),

      setSelectedReligions: (religions) => set({ selectedReligions: religions }),

      toggleReligion: (religion) =>
        set((state) => {
          const current = state.selectedReligions;
          if (current.includes(religion)) {
            return {
              selectedReligions: current.filter((r) => r !== religion),
            };
          } else {
            return {
              selectedReligions: [...current, religion],
            };
          }
        }),

      setSelectedSubsets: (subsets) => set({ selectedSubsets: subsets }),

      toggleSubset: (religion, subset) =>
        set((state) => {
          const current = state.selectedSubsets;
          const existing = current.find(
            (s) => s.religion === religion && s.subset === subset
          );
          
          if (existing) {
            return {
              selectedSubsets: current.filter(
                (s) => !(s.religion === religion && s.subset === subset)
              ),
            };
          } else {
            return {
              selectedSubsets: [...current, { religion, subset }],
            };
          }
        }),

      clearSelectedSubsets: () => set({ selectedSubsets: [] }),

      setSearchTerm: (term) => set({ searchTerm: term }),

      setIsSearching: (loading) => set({ isSearching: loading }),

      createFolder: (name, color) => {
        const folder: Folder = {
          id: `folder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          createdAt: Date.now(),
          color,
        };
        set((state) => ({
          folders: [...state.folders, folder],
        }));
        return folder;
      },

      renameFolder: (id, name) =>
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === id ? { ...f, name } : f
          ),
        })),

      deleteFolder: (id) =>
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          // Move all verses in this folder to no folder
          savedVerses: state.savedVerses.map((v) =>
            v.folderId === id ? { ...v, folderId: null } : v
          ),
        })),

      saveVerse: (verse) =>
        set((state) => ({
          savedVerses: [verse, ...state.savedVerses],
        })),

      updateVerseNotes: (id, notes) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id ? { ...v, notes } : v
          ),
        })),

      moveVerseToFolder: (verseId, folderId) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === verseId ? { ...v, folderId } : v
          ),
        })),

      deleteVerse: (id) =>
        set((state) => ({
          savedVerses: state.savedVerses.filter((v) => v.id !== id),
        })),

      saveComparison: (comparison) =>
        set((state) => ({
          savedComparisons: [comparison, ...state.savedComparisons],
        })),

      updateComparisonNotes: (id, notes) =>
        set((state) => ({
          savedComparisons: state.savedComparisons.map((c) =>
            c.id === id ? { ...c, notes } : c
          ),
        })),

      deleteComparison: (id) =>
        set((state) => ({
          savedComparisons: state.savedComparisons.filter((c) => c.id !== id),
        })),

      setActiveVerseChat: (chat) => set({ activeVerseChat: chat }),

      addChatMessage: (message) =>
        set((state) => {
          if (!state.activeVerseChat) return state;
          return {
            activeVerseChat: {
              ...state.activeVerseChat,
              messages: [
                ...state.activeVerseChat.messages,
                { ...message, timestamp: Date.now() },
              ],
            },
          };
        }),

      canSearch: () => {
        const state = get();

        // Check if usage needs reset
        if (Date.now() > state.usage.resetDate) {
          get().resetUsage();
          return true;
        }

        if (state.usage.isPremium) return true;

        return state.usage.searchesUsed < state.usage.searchLimit;
      },

      incrementSearchUsage: () => {
        const state = get();

        // Check if usage needs reset
        if (Date.now() > state.usage.resetDate) {
          get().resetUsage();
          return true;
        }

        if (state.usage.isPremium) {
          return true;
        }

        if (state.usage.searchesUsed >= state.usage.searchLimit) {
          return false;
        }

        set((state) => ({
          usage: {
            ...state.usage,
            searchesUsed: state.usage.searchesUsed + 1,
          },
        }));
        return true;
      },

      canChat: () => {
        const state = get();

        // Check if usage needs reset
        if (Date.now() > state.usage.resetDate) {
          get().resetUsage();
          return true;
        }

        if (state.usage.isPremium) return true;

        return state.usage.chatMessagesUsed < state.usage.chatLimit;
      },

      incrementChatUsage: () => {
        const state = get();

        // Check if usage needs reset
        if (Date.now() > state.usage.resetDate) {
          get().resetUsage();
          return true;
        }

        if (state.usage.isPremium) return true;

        if (state.usage.chatMessagesUsed >= state.usage.chatLimit) {
          return false;
        }

        set((state) => ({
          usage: {
            ...state.usage,
            chatMessagesUsed: state.usage.chatMessagesUsed + 1,
          },
        }));
        return true;
      },

      setPremium: (isPremium) =>
        set((state) => ({
          usage: { ...state.usage, isPremium },
        })),

      resetUsage: () =>
        set((state) => ({
          usage: {
            ...state.usage,
            searchesUsed: 0,
            chatMessagesUsed: 0,
            resetDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
          },
        })),

      setReadingPreferences: (preferences) => set({ readingPreferences: preferences }),

      incrementSaveCount: () =>
        set((state) => ({
          reviewPrompt: {
            ...state.reviewPrompt,
            savesCount: state.reviewPrompt.savesCount + 1,
          },
        })),

      incrementShareCount: () =>
        set((state) => ({
          reviewPrompt: {
            ...state.reviewPrompt,
            sharesCount: state.reviewPrompt.sharesCount + 1,
          },
        })),

      setReviewPromptShown: () =>
        set((state) => ({
          reviewPrompt: {
            ...state.reviewPrompt,
            timesShown: state.reviewPrompt.timesShown + 1,
            lastShownDate: Date.now(),
          },
        })),

      setReviewPromptStatus: (status) =>
        set((state) => ({
          reviewPrompt: {
            ...state.reviewPrompt,
            status,
          },
        })),

      shouldShowReviewPrompt: () => {
        const state = get();
        const { reviewPrompt } = state;

        // Don't show if already reviewed or dismissed
        if (reviewPrompt.status === 'reviewed' || reviewPrompt.status === 'dismissed') {
          return false;
        }

        // Don't show more than 3 times total
        if (reviewPrompt.timesShown >= 3) {
          return false;
        }

        // If status is 'later', wait 14 days before showing again
        if (reviewPrompt.status === 'later' && reviewPrompt.lastShownDate) {
          const daysSinceLastShown = (Date.now() - reviewPrompt.lastShownDate) / (1000 * 60 * 60 * 24);
          if (daysSinceLastShown < 14) {
            return false;
          }
        }

        // Show on 3rd, 7th, or 15th save/share
        const totalActions = reviewPrompt.savesCount + reviewPrompt.sharesCount;
        const milestones = [3, 7, 15];
        
        return milestones.includes(totalActions);
      },
    }),
    {
      name: 'faith-explorer-storage',
    }
  )
);
