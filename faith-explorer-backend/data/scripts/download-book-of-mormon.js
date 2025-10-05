const https = require('https');
const fs = require('fs');
const path = require('path');

const GUTENBERG_URL = 'https://www.gutenberg.org/cache/epub/17/pg17.txt';

function downloadText() {
  return new Promise((resolve, reject) => {
    console.log('Downloading Book of Mormon from Project Gutenberg...');
    https.get(GUTENBERG_URL, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseBookOfMormon(text) {
  const verses = [];
  const lines = text.split('\n');

  let currentBook = '';
  let currentChapter = 0;
  let verseNum = 0;
  let inMainText = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Start of main text
    if (line.includes('THE FIRST BOOK OF NEPHI') || line.includes('FIRST NEPHI')) {
      inMainText = true;
    }

    if (!inMainText) continue;

    // Book titles (e.g., "THE BOOK OF MORMON", "THE BOOK OF JACOB")
    if (line.match(/^THE (FIRST|SECOND|THIRD|FOURTH)? ?(BOOK OF|EPISTLE OF)/i)) {
      currentBook = line.replace(/^THE /i, '').trim();
      currentChapter = 0;
      continue;
    }

    // Chapter headers (e.g., "CHAPTER 1", "Chapter 2")
    if (line.match(/^CHAPTER \d+/i)) {
      currentChapter++;
      verseNum = 0;
      continue;
    }

    // Verse numbers (e.g., "1 I, Nephi, having been born...")
    const verseMatch = line.match(/^(\d+)\s+(.+)/);
    if (verseMatch && currentBook && currentChapter > 0) {
      verseNum = parseInt(verseMatch[1]);
      const verseText = verseMatch[2];

      if (verseText.length > 10) { // Filter out headers/noise
        verses.push({
          id: `mormon_${currentBook.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${currentChapter}_${verseNum}`,
          reference: `${currentBook} ${currentChapter}:${verseNum}`,
          book: currentBook,
          chapter: currentChapter,
          verse: verseNum,
          text: verseText.trim()
        });
      }
    }
  }

  return verses;
}

async function main() {
  try {
    const text = await downloadText();
    console.log('✓ Downloaded successfully');

    const verses = parseBookOfMormon(text);
    console.log(`✓ Parsed ${verses.length} verses`);

    const output = {
      religion: 'christianity',
      source: 'Book of Mormon',
      version: 'english',
      subset: 'mormon',
      verses: verses
    };

    const outputPath = path.join(__dirname, '../christianity-mormon.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Complete! Processed ${verses.length} verses`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
