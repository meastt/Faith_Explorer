// process-complete-torah-final.js
const fs = require('fs');
const path = require('path');

const processed = {
  religion: "judaism",
  source: "Sefaria Torah",
  version: "Jewish English Torah",
  verses: []
};

function cleanText(text) {
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/g, '') // Remove sup tags first
    .replace(/<i[^>]*>.*?<\/i>/g, '') // Remove italic tags
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/<br\s*\/?>/g, ' ') // Replace <br> with space
    .replace(/\*[^*]*\*/g, '') // Remove footnote markers like *text*
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function extractBookFromRef(ref) {
  const parts = ref.split(' ');
  return parts[0]; // e.g., "Genesis" from "Genesis 1"
}

function extractChapterFromRef(ref) {
  const parts = ref.split(' ');
  return parseInt(parts[parts.length - 1]); // e.g., 1 from "Genesis 1"
}

async function processCompleteTorah() {
  console.log('📖 Processing complete Torah...');
  
  const rawFilesDir = path.join(__dirname, '../raw-files');
  const inputFile = path.join(rawFilesDir, 'torah-complete.json');
  
  if (!fs.existsSync(inputFile)) {
    console.error('❌ Complete Torah file not found. Please run download-complete-torah.js first.');
    process.exit(1);
  }
  
  try {
    const allChapters = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    console.log(`📚 Processing ${allChapters.length} chapters...`);
    
    for (const chapterData of allChapters) {
      const bookName = extractBookFromRef(chapterData.ref);
      const chapterNum = extractChapterFromRef(chapterData.ref);
      
      if (!chapterData.text || !Array.isArray(chapterData.text)) {
        console.warn(`⚠️  Invalid data structure in ${chapterData.ref}`);
        continue;
      }
      
      // Process each verse in the chapter
      for (let verseIndex = 0; verseIndex < chapterData.text.length; verseIndex++) {
        const verseText = chapterData.text[verseIndex];
        const verseNum = verseIndex + 1;
        
        if (typeof verseText !== 'string' || verseText.trim() === '') {
          continue; // Skip empty verses
        }
        
        const cleanVerseText = cleanText(verseText);
        
        if (cleanVerseText.length === 0) {
          continue; // Skip verses that become empty after cleaning
        }
        
        const id = `${bookName.toLowerCase().replace(/\s/g, '_')}_${chapterNum}_${verseNum}`;
        const reference = `${bookName} ${chapterNum}:${verseNum}`;
        
        processed.verses.push({
          id: id,
          reference: reference,
          book: bookName,
          chapter: chapterNum,
          verse: verseNum,
          text: cleanVerseText
        });
      }
    }
    
    // Save processed file
    const outputFile = path.join(__dirname, '../processed-files/judaism-torah-complete.json');
    fs.writeFileSync(outputFile, JSON.stringify(processed, null, 2));
    
    console.log(`\n🎉 Complete Torah processing finished!`);
    console.log(`📊 Total verses processed: ${processed.verses.length}`);
    console.log(`📁 Saved to: processed-files/judaism-torah-complete.json`);
    
    // Show breakdown by book
    const bookCounts = {};
    processed.verses.forEach(verse => {
      bookCounts[verse.book] = (bookCounts[verse.book] || 0) + 1;
    });
    
    console.log(`\n📚 Verses by book:`);
    Object.entries(bookCounts).forEach(([book, count]) => {
      console.log(`   ${book}: ${count} verses`);
    });
    
  } catch (error) {
    console.error('❌ Error processing Torah:', error.message);
    process.exit(1);
  }
}

// Run the processing
processCompleteTorah();
