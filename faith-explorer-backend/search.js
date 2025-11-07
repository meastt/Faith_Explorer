const fs = require('fs').promises;
const path = require('path');

// Cache for loaded scriptures (lazy loading)
const scriptureCache = {};

// Map subset IDs to file names
const SUBSET_FILE_MAPPING = {
  'christianity-kjv': 'christianity-kjv.json',
  'christianity-mormon': 'christianity-mormon.json',
  'christianity-doctrine-covenants': 'christianity-doctrine-covenants.json',
  'islam-quran-sahih': 'islam-quran-sahih.json',
  'islam-hadith-bukhari': 'islam-hadith-bukhari.json',
  'judaism-torah': 'judaism-torah.json',
  'judaism-talmud': 'judaism-talmud.json',
  'hinduism-bhagavad-gita-complete': 'hinduism-bhagavad-gita-complete.json',
  'buddhism-dhammapada': 'buddhism-dhammapada.json',
  'sikhism-guru-granth-sahib': 'sikhism-guru-granth-sahib.json',
  'taoism-tao-te-ching': 'taoism-tao-te-ching.json',
  'confucianism-analects': 'confucianism-analects.json',
  'shinto-kojiki': 'shinto-kojiki.json'
};

// Map religions to their default subsets
const RELIGION_DEFAULT_SUBSETS = {
  christianity: ['christianity-kjv', 'christianity-mormon', 'christianity-doctrine-covenants'],
  islam: ['islam-quran-sahih', 'islam-hadith-bukhari'],
  judaism: ['judaism-torah', 'judaism-talmud'],
  hinduism: ['hinduism-bhagavad-gita-complete'],
  buddhism: ['buddhism-dhammapada'],
  sikhism: ['sikhism-guru-granth-sahib'],
  taoism: ['taoism-tao-te-ching'],
  confucianism: ['confucianism-analects'],
  shinto: ['shinto-kojiki']
};

// Lazy load a scripture file
async function loadScripture(subsetId) {
  // Return from cache if already loaded
  if (scriptureCache[subsetId]) {
    return scriptureCache[subsetId];
  }

  const fileName = SUBSET_FILE_MAPPING[subsetId];
  if (!fileName) {
    console.warn(`No file mapping found for subset: ${subsetId}`);
    return [];
  }

  try {
    const filePath = path.join(__dirname, 'data', fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    scriptureCache[subsetId] = data.verses || [];
    return scriptureCache[subsetId];
  } catch (error) {
    console.error(`Error loading scripture ${subsetId}:`, error.message);
    return [];
  }
}

const STOP_WORDS = new Set([
  'what', 'does', 'your', 'this', 'that', 'with', 'from', 'have',
  'will', 'would', 'should', 'could', 'there', 'their', 'they',
  'about', 'when', 'where', 'which', 'whom', 'whose', 'these', 'those'
]);

function searchVerses(verses, question, maxResults = 10) {
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
    .filter(v => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

async function searchScriptures(religion, question, maxResults = 10) {
  // Get default subsets for the religion
  const subsetIds = RELIGION_DEFAULT_SUBSETS[religion] || [];

  if (subsetIds.length === 0) {
    console.warn(`No subsets found for religion: ${religion}`);
    return [];
  }

  // Load all verses for this religion
  const allVerses = [];
  for (const subsetId of subsetIds) {
    const verses = await loadScripture(subsetId);
    allVerses.push(...verses);
  }

  return searchVerses(allVerses, question, maxResults);
}

async function searchSubsets(subsetIds, question, maxResults = 10) {
  if (!Array.isArray(subsetIds) || subsetIds.length === 0) return [];

  // Load all verses from specified subsets
  const allVerses = [];
  for (const subsetId of subsetIds) {
    const verses = await loadScripture(subsetId);
    allVerses.push(...verses.map(verse => ({ ...verse, subset: subsetId })));
  }

  return searchVerses(allVerses, question, maxResults);
}

module.exports = { searchScriptures, searchSubsets };
