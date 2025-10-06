const fs = require('fs');
const path = require('path');

const bible = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/christianity-kjv.json'), 'utf8'));
const bookOfMormon = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/christianity-mormon.json'), 'utf8'));
const doctrineCovenants = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/christianity-doctrine-covenants.json'), 'utf8'));
const quran = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/islam-quran-sahih.json'), 'utf8'));
const hadith = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/islam-hadith-bukhari.json'), 'utf8'));
const torah = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/judaism-torah.json'), 'utf8'));
const talmud = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/judaism-talmud.json'), 'utf8'));
const bhagavadGita = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/hinduism-bhagavad-gita-complete.json'), 'utf8'));
const dhammapada = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/buddhism-dhammapada.json'), 'utf8'));
const guruGranthSahib = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/sikhism-guru-granth-sahib.json'), 'utf8'));
const taoTeChing = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/taoism-tao-te-ching.json'), 'utf8'));
const analects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/confucianism-analects.json'), 'utf8'));
const kojiki = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shinto-kojiki.json'), 'utf8'));

// Individual scripture files for subset-specific searches
const SCRIPTURE_FILES = {
  // Christianity
  'christianity-kjv': bible.verses,
  'christianity-mormon': bookOfMormon.verses,
  'christianity-doctrine-covenants': doctrineCovenants.verses,
  
  // Islam
  'islam-quran-sahih': quran.verses,
  'islam-hadith-bukhari': hadith.verses,
  
  // Judaism
  'judaism-torah': torah.verses,
  'judaism-talmud': talmud.verses,
  
  // Hinduism
  'hinduism-bhagavad-gita-complete': bhagavadGita.verses,
  
  // Buddhism
  'buddhism-dhammapada': dhammapada.verses,
  
  // Sikhism
  'sikhism-guru-granth-sahib': guruGranthSahib.verses,
  
  // Taoism
  'taoism-tao-te-ching': taoTeChing.verses,
  
  // Confucianism
  'confucianism-analects': analects.verses,
  
  // Shinto
  'shinto-kojiki': kojiki.verses
};

// Legacy combined scriptures for backward compatibility
const SCRIPTURES = {
  christianity: [...bible.verses, ...bookOfMormon.verses, ...doctrineCovenants.verses],
  islam: [...quran.verses, ...hadith.verses],
  judaism: [...torah.verses, ...talmud.verses],
  hinduism: bhagavadGita.verses,
  buddhism: dhammapada.verses,
  sikhism: guruGranthSahib.verses,
  taoism: taoTeChing.verses,
  confucianism: analects.verses,
  shinto: kojiki.verses
};

const STOP_WORDS = new Set([
  'what', 'does', 'your', 'this', 'that', 'with', 'from', 'have',
  'will', 'would', 'should', 'could', 'there', 'their', 'they',
  'about', 'when', 'where', 'which', 'whom', 'whose', 'these', 'those'
]);

function searchScriptures(religion, question, maxResults = 10) {
  const verses = SCRIPTURES[religion];
  if (!verses) return [];
  
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

function searchSubsets(subsetIds, question, maxResults = 10) {
  if (!Array.isArray(subsetIds) || subsetIds.length === 0) return [];
  
  const allVerses = [];
  
  subsetIds.forEach(subsetId => {
    const verses = SCRIPTURE_FILES[subsetId];
    if (verses) {
      allVerses.push(...verses.map(verse => ({ ...verse, subset: subsetId })));
    }
  });
  
  if (allVerses.length === 0) return [];
  
  const keywords = question
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !STOP_WORDS.has(w));
  
  if (keywords.length === 0) return [];
  
  const scored = allVerses.map(verse => {
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

module.exports = { searchScriptures, searchSubsets };
