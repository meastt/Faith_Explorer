const fs = require('fs');
const path = require('path');

const bible = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/christianity-kjv.json'), 'utf8'));
const quran = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/islam-quran-sahih.json'), 'utf8'));
const hadith = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/islam-hadith-bukhari.json'), 'utf8'));
const torah = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/judaism-torah.json'), 'utf8'));
const bhagavadGita = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/hinduism-bhagavad-gita.json'), 'utf8'));
const dhammapada = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/buddhism-dhammapada.json'), 'utf8'));
const guruGranthSahib = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/sikhism-guru-granth-sahib.json'), 'utf8'));
const taoTeChing = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/taoism-tao-te-ching.json'), 'utf8'));
const analects = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/confucianism-analects.json'), 'utf8'));
const kojiki = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shinto-kojiki.json'), 'utf8'));

const SCRIPTURES = {
  christianity: bible.verses,
  islam: [...quran.verses, ...hadith.verses],
  judaism: torah.verses,
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

module.exports = { searchScriptures };
