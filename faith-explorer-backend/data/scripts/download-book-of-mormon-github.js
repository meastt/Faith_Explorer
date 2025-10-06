const https = require('https');
const fs = require('fs');
const path = require('path');

const BOOK_OF_MORMON_URL = 'https://raw.githubusercontent.com/bcbooks/scriptures-json/refs/heads/master/book-of-mormon.json';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (error) {
          reject(new Error(`Failed to parse JSON: ${error.message}`));
        }
      });
    }).on('error', reject);
  });
}

function processBookOfMormon(rawData) {
  console.log('📖 Processing Book of Mormon data...');
  
  const verses = [];
  
  if (!rawData.books || !Array.isArray(rawData.books)) {
    throw new Error('Invalid Book of Mormon data structure');
  }
  
  console.log(`Found ${rawData.books.length} books in the Book of Mormon`);
  
  rawData.books.forEach((book, bookIndex) => {
    console.log(`  📚 Processing ${book.book}...`);
    
    if (!book.chapters || !Array.isArray(book.chapters)) {
      console.log(`    ⚠️  No chapters found in ${book.book}`);
      return;
    }
    
    book.chapters.forEach((chapter, chapterIndex) => {
      if (!chapter.verses || !Array.isArray(chapter.verses)) {
        console.log(`    ⚠️  No verses found in ${book.book} Chapter ${chapter.chapter}`);
        return;
      }
      
      chapter.verses.forEach((verse, verseIndex) => {
        verses.push({
          id: `mormon_${book.book.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${chapter.chapter}_${verse.verse}`,
          reference: verse.reference,
          book: book.book,
          chapter: chapter.chapter,
          verse: verse.verse,
          text: verse.text.trim()
        });
      });
      
      console.log(`    ✅ Chapter ${chapter.chapter}: ${chapter.verses.length} verses`);
    });
    
    console.log(`  ✅ ${book.book}: ${book.chapters.reduce((total, ch) => total + (ch.verses ? ch.verses.length : 0), 0)} verses total`);
  });
  
  return verses;
}

async function downloadBookOfMormon() {
  console.log('🚀 Downloading complete Book of Mormon from GitHub...\n');
  
  try {
    console.log('📡 Fetching data from:', BOOK_OF_MORMON_URL);
    const rawData = await makeRequest(BOOK_OF_MORMON_URL);
    
    console.log('✅ Successfully downloaded Book of Mormon data');
    console.log(`📊 Raw data size: ${JSON.stringify(rawData).length} characters`);
    
    const verses = processBookOfMormon(rawData);
    
    if (verses.length === 0) {
      throw new Error('No verses were processed from the Book of Mormon data');
    }
    
    const output = {
      religion: 'christianity',
      source: 'Book of Mormon',
      version: 'complete',
      subset: 'mormon',
      verses: verses,
      metadata: {
        title: rawData.title,
        subtitle: rawData.subtitle,
        lastModified: rawData.last_modified,
        totalBooks: rawData.books.length,
        totalVerses: verses.length
      }
    };
    
    const outputPath = path.join(__dirname, '../christianity-mormon.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\n🎉 SUCCESS! Book of Mormon downloaded and processed:`);
    console.log(`📖 Total verses: ${verses.length}`);
    console.log(`📚 Total books: ${rawData.books.length}`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Show some sample verses
    console.log('\n📝 Sample verses:');
    verses.slice(0, 3).forEach((verse, index) => {
      console.log(`  ${index + 1}. ${verse.reference}: ${verse.text.substring(0, 80)}...`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error downloading Book of Mormon:', error.message);
    return false;
  }
}

async function main() {
  const success = await downloadBookOfMormon();
  
  if (success) {
    console.log('\n✅ Book of Mormon download complete!');
    console.log('🎯 Your Faith Explorer app now has the complete Book of Mormon!');
  } else {
    console.log('\n❌ Book of Mormon download failed');
  }
}

main().catch(console.error);
