import type { Religion, Verse } from '../types';

interface ScriptureData {
  verses: Verse[];
}

// Cache for loaded scripture data
const scriptureCache: Partial<Record<Religion, Verse[]>> = {};

const STOP_WORDS = new Set([
  'what', 'does', 'your', 'this', 'that', 'with', 'from', 'have',
  'will', 'would', 'should', 'could', 'there', 'their', 'they',
  'about', 'when', 'where', 'which', 'whom', 'whose', 'these', 'those'
]);

const SCRIPTURE_FILES: Record<Religion, string[]> = {
  christianity: ['/data/christianity-kjv.json'],
  islam: ['/data/islam-quran-sahih.json', '/data/islam-hadith-bukhari.json'],
  judaism: ['/data/judaism-torah.json'],
  hinduism: ['/data/hinduism-bhagavad-gita.json'],
  buddhism: ['/data/buddhism-dhammapada.json'],
  sikhism: ['/data/sikhism-guru-granth-sahib.json'],
  taoism: ['/data/taoism-tao-te-ching.json'],
  confucianism: ['/data/confucianism-analects.json'],
  shinto: ['/data/shinto-kojiki.json']
};

async function loadScriptures(religion: Religion): Promise<Verse[]> {
  // Return cached data if available
  if (scriptureCache[religion]) {
    return scriptureCache[religion]!;
  }

  // Load scripture files
  const files = SCRIPTURE_FILES[religion];
  const allVerses: Verse[] = [];

  for (const file of files) {
    try {
      const response = await fetch(file);
      if (!response.ok) {
        console.error(`Failed to load ${file}`);
        continue;
      }
      const data: ScriptureData = await response.json();
      allVerses.push(...data.verses);
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  // Cache the loaded data
  scriptureCache[religion] = allVerses;
  return allVerses;
}

export async function searchScriptures(
  religion: Religion,
  question: string,
  maxResults: number = 15
): Promise<Verse[]> {
  const verses = await loadScriptures(religion);
  if (!verses || verses.length === 0) return [];

  const keywords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));

  if (keywords.length === 0) return [];

  const scored = verses.map(verse => {
    const text = verse.text.toLowerCase();
    let score = 0;

    // Check for exact phrase match (big bonus)
    if (text.includes(question.toLowerCase())) {
      score += 100;
    }

    // Individual keyword matching
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}`, 'i');
      if (regex.test(text)) {
        score += 1;
      }
    });

    // Bonus for matching multiple keywords
    if (score >= keywords.length) {
      score += 5;
    }

    return { ...verse, score };
  });

  return scored
    .filter((v: any) => v.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, maxResults);
}
