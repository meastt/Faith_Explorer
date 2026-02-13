import i18n from 'i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  FREE_TIER_LIMITS,
  type Religion,
  type ReligionSubsetId,
  type ViewMode,
  type SavedVerse,
  type SavedComparison,
  type VerseChat,
  type FreemiumUsage,
  type SelectedSubset,
  type Folder,
  type Highlight,
  type Badge,
  type ActivityLog,
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

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string | null; // ISO date string (YYYY-MM-DD)
  freezesAvailable: number;
  lastFreezeResetDate: string | null; // ISO date string for monthly freeze reset
}

export interface NotificationPreferences {
  dailyWisdomEnabled: boolean;
  dailyWisdomTime: string; // "HH:MM" format, default "08:00"
  streakRemindersEnabled: boolean;
  lastScheduledDate: string | null; // ISO date string to prevent duplicate scheduling
}

export interface EmailCollection {
  address: string | null;
  collectedAt: number | null;
  bonusApplied: boolean;
  optInDismissed: boolean;
  sessionCount: number;
}

interface AppState {
  // Language
  language: 'en' | 'es';
  setLanguage: (lang: 'en' | 'es') => void;

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
  updateVerseTags: (id: string, tags: string[]) => void;
  addTagToVerse: (id: string, tag: string) => void;
  removeTagFromVerse: (id: string, tag: string) => void;
  addHighlightToVerse: (id: string, highlight: Highlight) => void;
  removeHighlightFromVerse: (id: string, highlightId: string) => void;
  updateHighlightColor: (verseId: string, highlightId: string, color: Highlight['color']) => void;
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

  // Recent topics (for personalized Daily Wisdom)
  recentTopics: string[];
  addRecentTopic: (topic: string) => void;
  getTopRecentTopics: (count?: number) => string[];

  // Streak tracking
  streak: StreakData;
  updateStreak: () => void; // Call this when user is active
  useStreakFreeze: () => boolean; // Returns true if freeze was applied

  // Achievement Badges
  badges: Badge[];
  checkAndUnlockBadges: () => void; // Check all badge conditions and unlock new ones
  getUnlockedBadges: () => Badge[];
  getLockedBadges: () => Badge[];

  // Review prompt
  reviewPrompt: ReviewPromptState;
  incrementSaveCount: () => void;
  incrementShareCount: () => void;
  setReviewPromptShown: () => void;
  setReviewPromptStatus: (status: 'later' | 'reviewed' | 'dismissed') => void;
  shouldShowReviewPrompt: () => boolean;

  // Faith in Action / Challenges
  activeChallenges: string[]; // ID of joined challenges
  completedActions: Record<string, number>; // ChallengeID -> Count of actions logged
  activityLogs: ActivityLog[]; // Detailed logs with notes
  joinChallenge: (challengeId: string) => void;
  logAction: (challengeId: string, note: string) => void;
  getActivityLogs: (challengeId: string) => ActivityLog[];

  // Notification preferences
  notificationPreferences: NotificationPreferences;
  setNotificationPreferences: (preferences: Partial<NotificationPreferences>) => void;

  // Learning paths progress
  learningProgress: LearningProgress;
  startPath: (pathId: string) => void;
  completeDay: (pathId: string, day: number) => void;
  resetPath: (pathId: string) => void;
  getPathProgress: (pathId: string) => { completedDays: number[]; startedAt: number | null };

  // Email collection
  emailCollection: EmailCollection;
  setEmail: (email: string) => void;
  dismissEmailOptIn: () => void;
  incrementSessionCount: () => void;
  shouldShowEmailOptIn: () => boolean;
}

export interface LearningProgress {
  activePath: string | null;
  completedDays: Record<string, number[]>; // { pathId: [1, 2, 3] }
  startedAt: Record<string, number>; // { pathId: timestamp }
}

const getInitialUsage = (): FreemiumUsage => {
  const now = Date.now();
  return {
    searchesUsed: 0,
    chatMessagesUsed: 0,
    searchLimit: FREE_TIER_LIMITS.searches,
    chatLimit: FREE_TIER_LIMITS.chatMessages,
    isPremium: false,
    resetDate: now + FREE_TIER_LIMITS.resetDays * 24 * 60 * 60 * 1000,
  };
};

const getInitialBadges = (): Badge[] => {
  return [
    {
      id: 'first-search',
      name: 'First Search',
      description: 'Complete your first search',
      icon: '🔍',
      unlockedAt: null,
    },
    {
      id: 'week-warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      unlockedAt: null,
    },
    {
      id: 'interfaith-explorer',
      name: 'Interfaith Explorer',
      description: 'Search across 3 or more religions',
      icon: '🌍',
      unlockedAt: null,
    },
    {
      id: 'deep-thinker',
      name: 'Deep Thinker',
      description: 'Send 50+ chat messages',
      icon: '💭',
      unlockedAt: null,
    },
    {
      id: 'library-keeper',
      name: 'Library Keeper',
      description: 'Save 25 or more verses',
      icon: '📚',
      unlockedAt: null,
    },
    {
      id: 'wisdom-seeker',
      name: 'Wisdom Seeker',
      description: 'Maintain a 30-day streak',
      icon: '⭐',
      unlockedAt: null,
    },
  ];
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
      language: (i18n.language?.startsWith('es') ? 'es' : 'en') as 'en' | 'es',
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
      recentTopics: [],
      streak: {
        current: 0,
        longest: 0,
        lastActiveDate: null,
        freezesAvailable: 1,
        lastFreezeResetDate: null,
      },
      badges: getInitialBadges(),
      reviewPrompt: {
        savesCount: 0,
        sharesCount: 0,
        timesShown: 0,
        lastShownDate: null,
        status: 'pending',
      },
      activeChallenges: [],
      completedActions: {},
      activityLogs: [],
      notificationPreferences: {
        dailyWisdomEnabled: false, // Opt-in by default
        dailyWisdomTime: '08:00',
        streakRemindersEnabled: true, // Default on but only triggers when needed
        lastScheduledDate: null,
      },
      learningProgress: {
        activePath: null,
        completedDays: {},
        startedAt: {},
      },
      emailCollection: {
        address: null,
        collectedAt: null,
        bonusApplied: false,
        optInDismissed: false,
        sessionCount: 0,
      },

      // Actions
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('faith-explorer-language', lang);
        set({ language: lang });
      },

      startPath: (pathId) =>
        set((state) => ({
          learningProgress: {
            ...state.learningProgress,
            activePath: pathId,
            startedAt: {
              ...state.learningProgress.startedAt,
              [pathId]: state.learningProgress.startedAt[pathId] || Date.now(),
            },
          },
        })),

      completeDay: (pathId, day) =>
        set((state) => {
          const currentDays = state.learningProgress.completedDays[pathId] || [];
          if (currentDays.includes(day)) return state;
          return {
            learningProgress: {
              ...state.learningProgress,
              completedDays: {
                ...state.learningProgress.completedDays,
                [pathId]: [...currentDays, day].sort((a, b) => a - b),
              },
            },
          };
        }),

      resetPath: (pathId) =>
        set((state) => {
          const { [pathId]: _removedDays, ...remainingDays } = state.learningProgress.completedDays;
          const { [pathId]: _removedStart, ...remainingStarts } = state.learningProgress.startedAt;
          return {
            learningProgress: {
              activePath: state.learningProgress.activePath === pathId ? null : state.learningProgress.activePath,
              completedDays: remainingDays,
              startedAt: remainingStarts,
            },
          };
        }),

      getPathProgress: (pathId) => {
        const state = get();
        return {
          completedDays: state.learningProgress.completedDays[pathId] || [],
          startedAt: state.learningProgress.startedAt[pathId] || null,
        };
      },

      joinChallenge: (challengeId) =>
        set((state) => ({
          activeChallenges: state.activeChallenges.includes(challengeId)
            ? state.activeChallenges
            : [...state.activeChallenges, challengeId]
        })),
      logAction: (challengeId, note) =>
        set((state) => {
          const newLog: ActivityLog = {
            id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            challengeId,
            note,
            timestamp: Date.now(),
          };
          return {
            completedActions: {
              ...state.completedActions,
              [challengeId]: (state.completedActions[challengeId] || 0) + 1
            },
            activityLogs: [newLog, ...state.activityLogs]
          };
        }),
      getActivityLogs: (challengeId) => {
        return get().activityLogs.filter(log => log.challengeId === challengeId);
      },

      setNotificationPreferences: (preferences) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            ...preferences,
          },
        })),

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

      updateVerseTags: (id, tags) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id ? { ...v, tags } : v
          ),
        })),

      addTagToVerse: (id, tag) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id && !v.tags.includes(tag)
              ? { ...v, tags: [...v.tags, tag] }
              : v
          ),
        })),

      removeTagFromVerse: (id, tag) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id
              ? { ...v, tags: v.tags.filter((t) => t !== tag) }
              : v
          ),
        })),

      addHighlightToVerse: (id, highlight) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id
              ? { ...v, highlights: [...(v.highlights || []), highlight] }
              : v
          ),
        })),

      removeHighlightFromVerse: (id, highlightId) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === id
              ? { ...v, highlights: (v.highlights || []).filter((h) => h.id !== highlightId) }
              : v
          ),
        })),

      updateHighlightColor: (verseId, highlightId, color) =>
        set((state) => ({
          savedVerses: state.savedVerses.map((v) =>
            v.id === verseId
              ? {
                ...v,
                highlights: (v.highlights || []).map((h) =>
                  h.id === highlightId ? { ...h, color } : h
                ),
              }
              : v
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
            resetDate: Date.now() + FREE_TIER_LIMITS.resetDays * 24 * 60 * 60 * 1000,
          },
        })),

      setReadingPreferences: (preferences) => set({ readingPreferences: preferences }),

      addRecentTopic: (topic) =>
        set((state) => {
          const normalized = topic.toLowerCase().trim();
          if (!normalized || normalized.length < 3) return state;

          // Remove topic if it already exists (to move it to front)
          const filtered = state.recentTopics.filter((t) => t !== normalized);
          // Add to front and limit to 20 topics
          return {
            recentTopics: [normalized, ...filtered].slice(0, 20),
          };
        }),

      getTopRecentTopics: (count = 3) => {
        const state = get();
        // Count frequency of topics
        const topicCounts: Record<string, number> = {};
        state.recentTopics.forEach((topic) => {
          topicCounts[topic] = (topicCounts[topic] || 0) + 1;
        });
        // Sort by frequency and return top N
        return Object.entries(topicCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, count)
          .map(([topic]) => topic);
      },

      updateStreak: () =>
        set((state) => {
          const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
          const lastActive = state.streak.lastActiveDate;

          // If already active today, no change
          if (lastActive === today) return state;

          let newCurrent = 1;
          let newLongest = state.streak.longest;
          let newFreezesAvailable = state.streak.freezesAvailable;
          let newFreezeResetDate = state.streak.lastFreezeResetDate;

          if (lastActive) {
            const lastDate = new Date(lastActive);
            const todayDate = new Date(today);
            const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
              // Consecutive day - increment streak
              newCurrent = state.streak.current + 1;
            } else if (diffDays > 1) {
              // Missed a day - streak broken, reset to 1
              newCurrent = 1;
            }
          }

          // Update longest streak if current is higher
          if (newCurrent > newLongest) {
            newLongest = newCurrent;
          }

          // Reset monthly freeze (1st of each month)
          const currentMonth = new Date(today).getMonth();
          const lastResetMonth = newFreezeResetDate ? new Date(newFreezeResetDate).getMonth() : -1;
          if (currentMonth !== lastResetMonth && state.usage.isPremium) {
            newFreezesAvailable = 1;
            newFreezeResetDate = today;
          }

          return {
            streak: {
              current: newCurrent,
              longest: newLongest,
              lastActiveDate: today,
              freezesAvailable: newFreezesAvailable,
              lastFreezeResetDate: newFreezeResetDate,
            },
          };
        }),

      useStreakFreeze: () => {
        const state = get();

        // Only premium users can use streak freeze
        if (!state.usage.isPremium) return false;

        // Check if freezes available
        if (state.streak.freezesAvailable <= 0) return false;

        const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone
        const lastActive = state.streak.lastActiveDate;

        if (!lastActive) return false;

        const lastDate = new Date(lastActive);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        // Only allow freeze if exactly 1 day was missed
        if (diffDays !== 2) return false;

        // Apply freeze - extend lastActiveDate by 1 day
        const yesterday = new Date(todayDate);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toLocaleDateString('en-CA'); // YYYY-MM-DD in local timezone

        set((state) => ({
          streak: {
            ...state.streak,
            lastActiveDate: yesterdayStr,
            freezesAvailable: state.streak.freezesAvailable - 1,
          },
        }));

        return true;
      },

      checkAndUnlockBadges: () => {
        const state = get();
        const now = Date.now();
        let badgesUpdated = false;

        const updatedBadges = state.badges.map((badge) => {
          // Skip if already unlocked
          if (badge.unlockedAt !== null) return badge;

          let shouldUnlock = false;

          switch (badge.id) {
            case 'first-search':
              // Unlock if user has done at least 1 search
              shouldUnlock = state.usage.searchesUsed > 0;
              break;

            case 'week-warrior':
              // Unlock if current streak is 7 or more days
              shouldUnlock = state.streak.current >= 7;
              break;

            case 'interfaith-explorer':
              // Count unique religions user has searched
              const uniqueReligions = new Set<string>();
              state.savedVerses.forEach((verse) => {
                if (verse.religion) uniqueReligions.add(verse.religion);
              });
              shouldUnlock = uniqueReligions.size >= 3;
              break;

            case 'deep-thinker':
              // Unlock if user has sent 50+ chat messages
              shouldUnlock = state.usage.chatMessagesUsed >= 50;
              break;

            case 'library-keeper':
              // Unlock if user has saved 25+ verses
              shouldUnlock = state.savedVerses.length >= 25;
              break;

            case 'wisdom-seeker':
              // Unlock if current streak is 30 or more days
              shouldUnlock = state.streak.current >= 30;
              break;
          }

          if (shouldUnlock) {
            badgesUpdated = true;
            return { ...badge, unlockedAt: now };
          }

          return badge;
        });

        if (badgesUpdated) {
          set({ badges: updatedBadges });
        }
      },

      getUnlockedBadges: () => {
        return get().badges.filter((badge) => badge.unlockedAt !== null);
      },

      getLockedBadges: () => {
        return get().badges.filter((badge) => badge.unlockedAt === null);
      },

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

      // Email collection actions
      setEmail: (email) =>
        set((state) => ({
          emailCollection: {
            ...state.emailCollection,
            address: email,
            collectedAt: Date.now(),
            bonusApplied: true,
          },
          // Apply bonus: +5 searches
          usage: {
            ...state.usage,
            searchLimit: state.usage.searchLimit + 5,
          },
        })),

      dismissEmailOptIn: () =>
        set((state) => ({
          emailCollection: {
            ...state.emailCollection,
            optInDismissed: true,
          },
        })),

      incrementSessionCount: () =>
        set((state) => ({
          emailCollection: {
            ...state.emailCollection,
            sessionCount: state.emailCollection.sessionCount + 1,
          },
        })),

      shouldShowEmailOptIn: () => {
        const state = get();
        const { emailCollection, savedVerses } = state;

        // Don't show if already collected or dismissed
        if (emailCollection.address || emailCollection.optInDismissed) {
          return false;
        }

        // Show after 3rd session OR after first save
        return emailCollection.sessionCount >= 3 || savedVerses.length >= 1;
      },
    }),
    {
      name: 'faith-explorer-storage',
    }
  )
);
