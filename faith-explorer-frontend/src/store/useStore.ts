import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Religion,
  ViewMode,
  SavedVerse,
  SavedComparison,
  VerseChat,
  FreemiumUsage,
} from '../types';

export interface ReadingPreferences {
  theme: 'light' | 'dark' | 'sepia';
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'dyslexic';
}

interface AppState {
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Selected religions
  selectedReligions: Religion[];
  setSelectedReligions: (religions: Religion[]) => void;
  toggleReligion: (religion: Religion) => void;

  // Search
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;

  // Saved verses
  savedVerses: SavedVerse[];
  saveVerse: (verse: SavedVerse) => void;
  updateVerseNotes: (id: string, notes: string) => void;
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
  incrementSearchUsage: () => boolean; // returns true if allowed
  incrementChatUsage: () => boolean; // returns true if allowed
  setPremium: (isPremium: boolean) => void;
  resetUsage: () => void;

  // Reading preferences
  readingPreferences: ReadingPreferences;
  setReadingPreferences: (preferences: ReadingPreferences) => void;
}

const getInitialUsage = (): FreemiumUsage => {
  const now = Date.now();
  return {
    searchesUsed: 0,
    chatMessagesUsed: 0,
    searchLimit: 50,
    chatLimit: 100,
    isPremium: false,
    resetDate: now + 30 * 24 * 60 * 60 * 1000, // 30 days from now
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      viewMode: 'single',
      selectedReligions: ['christianity'],
      searchTerm: '',
      isSearching: false,
      savedVerses: [],
      savedComparisons: [],
      activeVerseChat: null,
      usage: getInitialUsage(),
      readingPreferences: {
        theme: 'light',
        fontSize: 16,
        fontFamily: 'serif',
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

      setSearchTerm: (term) => set({ searchTerm: term }),

      setIsSearching: (loading) => set({ isSearching: loading }),

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

      incrementSearchUsage: () => {
        const state = get();

        // Check if usage needs reset
        if (Date.now() > state.usage.resetDate) {
          get().resetUsage();
          return true;
        }

        if (state.usage.isPremium) return true;

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
    }),
    {
      name: 'faith-explorer-storage',
    }
  )
);
