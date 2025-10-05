export type Religion =
  | 'christianity'
  | 'islam'
  | 'judaism'
  | 'hinduism'
  | 'buddhism'
  | 'sikhism'
  | 'taoism'
  | 'confucianism'
  | 'shinto';

export interface ReligionInfo {
  id: Religion;
  name: string;
  text: string;
  color: string;
  verseCount?: number;
  coverage?: 'full' | 'partial' | 'limited';
}

export interface Verse {
  reference: string;
  text: string;
  religion?: Religion;
}

export interface SavedVerse extends Verse {
  id: string;
  savedAt: number;
  notes: string;
  tags: string[];
}

export interface ComparisonResult {
  searchTerm: string;
  religions: Religion[];
  results: {
    religion: Religion;
    verses: Verse[];
  }[];
  savedAt?: number;
  notes?: string;
}

export interface SavedComparison extends ComparisonResult {
  id: string;
  savedAt: number;
  notes: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface VerseChat {
  verseReference: string;
  verseText: string;
  religion: Religion;
  messages: ChatMessage[];
}

export type ViewMode = 'single' | 'comparison';

export interface FreemiumUsage {
  searchesUsed: number;
  chatMessagesUsed: number;
  searchLimit: number;
  chatLimit: number;
  isPremium: boolean;
  resetDate: number;
}

export const RELIGIONS: ReligionInfo[] = [
  { id: 'christianity', name: 'Christianity', text: 'Bible (KJV)', color: '#dc2626', verseCount: 31102, coverage: 'full' },
  { id: 'islam', name: 'Islam', text: 'Quran & Hadith', color: '#059669', verseCount: 13799, coverage: 'full' },
  { id: 'judaism', name: 'Judaism', text: 'Torah', color: '#2563eb', verseCount: 5846, coverage: 'full' },
  { id: 'hinduism', name: 'Hinduism', text: 'Bhagavad Gita', color: '#ea580c', verseCount: 4, coverage: 'limited' },
  { id: 'buddhism', name: 'Buddhism', text: 'Dhammapada', color: '#7c3aed', verseCount: 4, coverage: 'limited' },
  { id: 'sikhism', name: 'Sikhism', text: 'Guru Granth Sahib', color: '#c2410c', verseCount: 4, coverage: 'limited' },
  { id: 'taoism', name: 'Taoism', text: 'Tao Te Ching', color: '#0891b2', verseCount: 10, coverage: 'limited' },
  { id: 'confucianism', name: 'Confucianism', text: 'Analects', color: '#be123c', verseCount: 10, coverage: 'limited' },
  { id: 'shinto', name: 'Shinto', text: 'Kojiki', color: '#db2777', verseCount: 8, coverage: 'limited' },
];

export const FREE_TIER_LIMITS = {
  searches: 50,
  chatMessages: 100,
  resetDays: 30,
};
