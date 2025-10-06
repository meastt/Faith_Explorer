import type { Verse, SelectedSubset, ReligionSubsetId } from '../types';

// Load all religious texts directly in the frontend
let loadedScriptures: Record<string, Verse[]> = {};

// Load a scripture file
async function loadScripture(fileName: string): Promise<Verse[]> {
  if (loadedScriptures[fileName]) {
    return loadedScriptures[fileName];
  }

  try {
    const response = await fetch(`/data/${fileName}`);
    if (!response.ok) {
      console.error(`Failed to load ${fileName}:`, response.status);
      return [];
    }
    
    const data = await response.json();
    loadedScriptures[fileName] = data.verses || [];
    return loadedScriptures[fileName];
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    return [];
  }
}

// Preload all scriptures on app start
export async function initializeScriptures() {
  const scriptureFiles = [
    'christianity-kjv.json',
    'christianity-mormon.json', 
    'christianity-doctrine-covenants.json',
    'islam-quran-sahih.json',
    'islam-hadith-bukhari.json',
    'judaism-torah.json',
    'judaism-talmud.json',
    'hinduism-bhagavad-gita-complete.json',
    'buddhism-dhammapada.json',
    'sikhism-guru-granth-sahib.json',
    'taoism-tao-te-ching.json',
    'confucianism-analects.json',
    'shinto-kojiki.json'
  ];

  console.log('Loading religious texts...');
  await Promise.all(scriptureFiles.map(file => loadScripture(file)));
  console.log('✅ All religious texts loaded');
}

const STOP_WORDS = new Set([
  'what', 'does', 'your', 'this', 'that', 'with', 'from', 'have',
  'will', 'would', 'should', 'could', 'there', 'their', 'they',
  'about', 'when', 'where', 'which', 'whom', 'whose', 'these', 'those',
  'each', 'says', 'about', 'where', 'when', 'what', 'how', 'why'
]);

// Expand search terms for better matching
function expandSearchTerms(question: string): string[] {
  const baseTerms = question.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/);
  const expandedTerms = [...baseTerms];
  
  // Add related terms for common concepts
  const termExpansions: Record<string, string[]> = {
    'die': ['death', 'dead', 'dying', 'deceased', 'passed', 'departed'],
    'death': ['die', 'dead', 'dying', 'deceased', 'passed', 'departed'],
    'heaven': ['paradise', 'eternal', 'life', 'glory', 'kingdom'],
    'hell': ['damnation', 'punishment', 'torment', 'fire'],
    'afterlife': ['eternal', 'life', 'resurrection', 'judgment'],
    'soul': ['spirit', 'life', 'breath'],
    'eternal': ['everlasting', 'forever', 'perpetual'],
    'resurrection': ['rise', 'raised', 'life', 'eternal'],
    'judgment': ['judge', 'judged', 'trial', 'condemn'],
    'salvation': ['saved', 'save', 'redeem', 'redemption'],
    'sin': ['sins', 'sinful', 'transgression', 'wicked'],
    'righteous': ['righteousness', 'just', 'holy', 'good'],
    'faith': ['believe', 'belief', 'trust', 'hope'],
    'love': ['loved', 'loving', 'charity', 'compassion'],
    'peace': ['peaceful', 'tranquil', 'calm', 'rest']
  };
  
  baseTerms.forEach(term => {
    if (termExpansions[term]) {
      expandedTerms.push(...termExpansions[term]);
    }
  });
  
  return [...new Set(expandedTerms)]; // Remove duplicates
}

function searchVerses(verses: Verse[], question: string, maxResults = 15): Verse[] {
  if (verses.length === 0) return [];
  
  const expandedTerms = expandSearchTerms(question);
  const keywords = expandedTerms
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));
  
  console.log('Search keywords:', keywords);
  
  if (keywords.length === 0) return [];
  
  const scored = verses.map(verse => {
    const text = verse.text.toLowerCase();
    let score = 0;
    
    // Check for exact phrase match (big bonus)
    if (text.includes(question.toLowerCase())) {
      score += 100;
    }
    
    // Individual keyword matching with different weights
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}`, 'i');
      if (regex.test(text)) {
        // Give higher weight to original question terms
        const isOriginalTerm = question.toLowerCase().includes(keyword);
        score += isOriginalTerm ? 3 : 1;
      }
    });
    
    // Bonus for matching multiple keywords
    const matchedKeywords = keywords.filter(keyword => 
      new RegExp(`\\b${keyword}`, 'i').test(text)
    );
    if (matchedKeywords.length >= 2) {
      score += 5;
    }
    
    return { ...verse, score };
  });
  
  const results = scored
    .filter(v => v.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
    
  console.log(`Found ${results.length} verses with scores:`, results.map(r => ({ ref: r.reference, score: r.score })));
  
  return results;
}

// Map subset IDs to file names
const SUBSET_FILE_MAPPING: Record<string, string> = {
  'christianity-kjv': 'christianity-kjv.json',
  'christianity-mormon': 'christianity-mormon.json',
  'christianity-doctrine-covenants': 'christianity-doctrine-covenants.json',
  'islam-quran-sahih': 'islam-quran-sahih.json',
  'islam-hadith-bukhari': 'islam-hadith-bukhari.json',
  'judaism-torah': 'judaism-torah.json',
  'judaism-talmud': 'judaism-talmud.json',
  'hinduism-bhagavad-gita': 'hinduism-bhagavad-gita-complete.json',
  'buddhism-dhammapada': 'buddhism-dhammapada.json',
  'sikhism-guru-granth-sahib': 'sikhism-guru-granth-sahib.json',
  'taoism-tao-te-ching': 'taoism-tao-te-ching.json',
  'confucianism-analects': 'confucianism-analects.json',
  'shinto-kojiki': 'shinto-kojiki.json'
};

export async function searchScriptures(selectedSubsets: SelectedSubset[], question: string): Promise<Verse[]> {
  if (selectedSubsets.length === 0) return [];

  console.log('Searching with selectedSubsets:', selectedSubsets);

  // Convert selected subsets to file names
  const subsetIds = selectedSubsets.map(s => `${s.religion}-${s.subset}`);
  const fileNames = subsetIds.map(id => SUBSET_FILE_MAPPING[id]).filter(Boolean);

  console.log('Subset IDs:', subsetIds);
  console.log('File names:', fileNames);
  console.log('Available mappings:', Object.keys(SUBSET_FILE_MAPPING));

  if (fileNames.length === 0) {
    console.log('No file names found for subset IDs');
    return [];
  }

  // Load all relevant scripture files
  const allVerses: Verse[] = [];
  
  for (const fileName of fileNames) {
    console.log(`Loading ${fileName}...`);
    const verses = await loadScripture(fileName);
    console.log(`Loaded ${verses.length} verses from ${fileName}`);
    
    // Add subset information to verses
    const subsetId = subsetIds.find(id => SUBSET_FILE_MAPPING[id] === fileName);
    const subsetVerses = verses.map(verse => ({
      ...verse,
      subset: subsetId?.split('-')[1] as ReligionSubsetId
    }));
    allVerses.push(...subsetVerses);
  }

  console.log(`Total verses loaded: ${allVerses.length}`);
  const searchResults = searchVerses(allVerses, question, 15);
  console.log(`Search results: ${searchResults.length} verses found`);
  
  return searchResults;
}