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
  { id: 'christianity', name: 'Christianity', text: 'Bible', color: '#dc2626' },
  { id: 'islam', name: 'Islam', text: 'Quran & Hadith', color: '#059669' },
  { id: 'judaism', name: 'Judaism', text: 'Torah', color: '#2563eb' },
  { id: 'hinduism', name: 'Hinduism', text: 'Bhagavad Gita', color: '#ea580c' },
  { id: 'buddhism', name: 'Buddhism', text: 'Dhammapada', color: '#7c3aed' },
  { id: 'sikhism', name: 'Sikhism', text: 'Guru Granth Sahib', color: '#c2410c' },
  { id: 'taoism', name: 'Taoism', text: 'Tao Te Ching', color: '#0891b2' },
  { id: 'confucianism', name: 'Confucianism', text: 'Analects', color: '#be123c' },
  { id: 'shinto', name: 'Shinto', text: 'Kojiki', color: '#db2777' },
];

export const FREE_TIER_LIMITS = {
  searches: 50,
  chatMessages: 100,
  resetDays: 30,
};
