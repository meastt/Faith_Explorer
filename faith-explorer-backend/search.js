const fs = require('fs').promises;
const path = require('path');
const Fuse = require('fuse.js');

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

/**
 * NEW LOGIC: Uses Fuse.js for fuzzy searching
 * This allows for typos and better relevance scoring than simple keyword matching.
 */
function searchVerses(verses, question, maxResults = 10) {
  if (!verses || verses.length === 0) return [];

  // Configure Fuse options
  const options = {
    includeScore: true,
    // Search in both the text content and the reference (e.g. "John 3:16")
    keys: ['text', 'reference'],
    // Threshold: 0.0 is exact match, 1.0 is match anything. 
    // 0.4 is a good balance for natural language.
    threshold: 0.4,
    // Ignore where the word appears in the string
    ignoreLocation: true,
    // Minimum number of characters to match
    minMatchCharLength: 3
  };

  const fuse = new Fuse(verses, options);
  const result = fuse.search(question);

  // Map Fuse results back to clean verse objects
  return result
    .slice(0, maxResults)
    .map(r => ({
      ...r.item,
      score: r.score // Keep score for potential debugging/sorting
    }));
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