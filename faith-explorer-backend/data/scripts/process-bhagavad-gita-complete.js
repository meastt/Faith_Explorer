const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Srimad%20Bhagavad%20Gita/';

async function downloadChapter(chapterNum) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}bhagavad_gita_chapter_${chapterNum}.json`;
    console.log(`Downloading chapter ${chapterNum}...`);

    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function processAllChapters() {
  const allVerses = [];
  let verseCount = 0;

  for (let i = 1; i <= 18; i++) {
    try {
      const chapter = await downloadChapter(i);

      // Process each verse in the chapter
      if (chapter.verses) {
        chapter.verses.forEach((verse, index) => {
          verseCount++;
          allVerses.push({
            id: `bhagavad_gita_${i}_${index + 1}`,
            reference: `Bhagavad Gita ${i}:${index + 1}`,
            chapter: i,
            verse: index + 1,
            chapter_name: chapter.chapter_name || `Chapter ${i}`,
            chapter_summary: chapter.chapter_summary || '',
            sanskrit: verse.sanskrit || verse.text || '',
            transliteration: verse.transliteration || '',
            text: verse.translation || verse.meaning || verse.english || verse.text || '',
            meaning: verse.meaning || verse.explanation || ''
          });
        });
      } else if (Array.isArray(chapter)) {
        // If chapter is an array of verses
        chapter.forEach((verse, index) => {
          verseCount++;
          allVerses.push({
            id: `bhagavad_gita_${i}_${index + 1}`,
            reference: `Bhagavad Gita ${i}:${index + 1}`,
            chapter: i,
            verse: index + 1,
            chapter_name: `Chapter ${i}`,
            sanskrit: verse.sanskrit || verse.text || '',
            transliteration: verse.transliteration || '',
            text: verse.translation || verse.meaning || verse.english || verse.text || '',
            meaning: verse.meaning || verse.explanation || ''
          });
        });
      }

      console.log(`✓ Chapter ${i} processed (${verseCount} total verses so far)`);

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Error processing chapter ${i}:`, error.message);
    }
  }

  const output = {
    religion: 'hinduism',
    source: 'Bhagavad Gita - Complete Text',
    version: 'english',
    verses: allVerses
  };

  const outputPath = path.join(__dirname, '../../hinduism-bhagavad-gita.json');
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log(`\n✅ Complete! Processed ${verseCount} verses across 18 chapters`);
  console.log(`📁 Saved to: ${outputPath}`);
  console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

processAllChapters().catch(console.error);
