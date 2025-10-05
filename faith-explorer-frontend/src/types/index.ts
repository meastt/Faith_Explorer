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

export interface ReligionSubset {
  id: string;
  name: string;
  description: string;
  comingSoon?: boolean;
}

export interface ReligionInfo {
  id: Religion;
  name: string;
  text: string;
  color: string;
  verseCount?: number;
  coverage?: 'full' | 'partial' | 'limited';
  subsets?: ReligionSubset[];
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
  {
    id: 'christianity',
    name: 'Christianity',
    text: 'Bible (KJV)',
    color: '#dc2626',
    verseCount: 31102,
    coverage: 'full',
    subsets: [
      { id: 'kjv', name: 'King James Version', description: 'Current' },
      { id: 'mormon', name: 'Book of Mormon', description: 'LDS Scripture', comingSoon: true },
      { id: 'catholic', name: 'Catholic Bible', description: 'Deuterocanonical books', comingSoon: true },
      { id: 'orthodox', name: 'Orthodox Bible', description: 'Eastern tradition', comingSoon: true },
    ]
  },
  {
    id: 'islam',
    name: 'Islam',
    text: 'Quran & Hadith',
    color: '#059669',
    verseCount: 13799,
    coverage: 'full',
    subsets: [
      { id: 'quran-sahih', name: 'Quran (Sahih)', description: 'Current' },
      { id: 'hadith-bukhari', name: 'Hadith (Bukhari)', description: 'Current' },
      { id: 'hadith-muslim', name: 'Hadith (Muslim)', description: 'Second collection', comingSoon: true },
    ]
  },
  {
    id: 'judaism',
    name: 'Judaism',
    text: 'Torah',
    color: '#2563eb',
    verseCount: 5846,
    coverage: 'full',
    subsets: [
      { id: 'torah', name: 'Torah', description: 'Current' },
      { id: 'talmud', name: 'Talmud', description: 'Rabbinic discussions', comingSoon: true },
    ]
  },
  {
    id: 'hinduism',
    name: 'Hinduism',
    text: 'Bhagavad Gita',
    color: '#ea580c',
    verseCount: 4,
    coverage: 'limited',
    subsets: [
      { id: 'bhagavad-gita', name: 'Bhagavad Gita', description: 'Current' },
      { id: 'vedas', name: 'Vedas', description: 'Ancient scriptures', comingSoon: true },
      { id: 'upanishads', name: 'Upanishads', description: 'Philosophical texts', comingSoon: true },
      { id: 'ramayana', name: 'Ramayana', description: 'Epic poem', comingSoon: true },
    ]
  },
  {
    id: 'buddhism',
    name: 'Buddhism',
    text: 'Dhammapada',
    color: '#7c3aed',
    verseCount: 4,
    coverage: 'limited',
    subsets: [
      { id: 'dhammapada', name: 'Dhammapada', description: 'Current' },
      { id: 'sutras', name: 'Mahayana Sutras', description: 'Mahayana texts', comingSoon: true },
      { id: 'vinaya', name: 'Vinaya Pitaka', description: 'Monastic rules', comingSoon: true },
      { id: 'abhidharma', name: 'Abhidharma', description: 'Philosophical analysis', comingSoon: true },
    ]
  },
  {
    id: 'sikhism',
    name: 'Sikhism',
    text: 'Guru Granth Sahib',
    color: '#c2410c',
    verseCount: 4,
    coverage: 'limited',
    subsets: [
      { id: 'guru-granth-sahib', name: 'Guru Granth Sahib', description: 'Current' },
      { id: 'dasam-granth', name: 'Dasam Granth', description: 'Tenth Guru\'s writings', comingSoon: true },
      { id: 'janam-sakhis', name: 'Janam Sakhis', description: 'Life stories', comingSoon: true },
    ]
  },
  {
    id: 'taoism',
    name: 'Taoism',
    text: 'Tao Te Ching',
    color: '#0891b2',
    verseCount: 10,
    coverage: 'limited',
    subsets: [
      { id: 'tao-te-ching', name: 'Tao Te Ching', description: 'Current' },
      { id: 'zhuangzi', name: 'Zhuangzi', description: 'Philosophical text', comingSoon: true },
      { id: 'i-ching', name: 'I Ching', description: 'Book of Changes', comingSoon: true },
      { id: 'daozang', name: 'Daozang', description: 'Taoist canon', comingSoon: true },
    ]
  },
  {
    id: 'confucianism',
    name: 'Confucianism',
    text: 'Analects',
    color: '#be123c',
    verseCount: 10,
    coverage: 'limited',
    subsets: [
      { id: 'analects', name: 'Analects', description: 'Current' },
      { id: 'mengzi', name: 'Mengzi', description: 'Mencius', comingSoon: true },
      { id: 'xunzi', name: 'Xunzi', description: 'Confucian philosopher', comingSoon: true },
      { id: 'five-classics', name: 'Five Classics', description: 'Core texts', comingSoon: true },
    ]
  },
  {
    id: 'shinto',
    name: 'Shinto',
    text: 'Kojiki',
    color: '#db2777',
    verseCount: 8,
    coverage: 'limited',
    subsets: [
      { id: 'kojiki', name: 'Kojiki', description: 'Current' },
      { id: 'nihon-shoki', name: 'Nihon Shoki', description: 'Chronicles of Japan', comingSoon: true },
      { id: 'norito', name: 'Norito', description: 'Ritual prayers', comingSoon: true },
    ]
  },
];

export const FREE_TIER_LIMITS = {
  searches: 50,
  chatMessages: 100,
  resetDays: 30,
};
