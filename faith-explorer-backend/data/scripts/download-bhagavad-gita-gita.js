const https = require('https');
const fs = require('fs');
const path = require('path');

const BHAGAVAD_GITA_URL = 'https://raw.githubusercontent.com/gita/gita/refs/heads/main/archive/corrected_translation_gpt3.json';

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

function processBhagavadGita(rawData) {
  console.log('📖 Processing Bhagavad Gita data...');
  
  const verses = [];
  
  // The data structure has numbered keys (0, 1, 2, etc.) representing chapters
  const chapterKeys = Object.keys(rawData).filter(key => !isNaN(parseInt(key))).sort((a, b) => parseInt(a) - parseInt(b));
  
  console.log(`Found ${chapterKeys.length} chapters in Bhagavad Gita`);
  
  chapterKeys.forEach((chapterKey, chapterIndex) => {
    const chapterNumber = parseInt(chapterKey) + 1; // Convert 0-based to 1-based
    const chapterData = rawData[chapterKey];
    
    console.log(`  📚 Processing Chapter ${chapterNumber}...`);
    
    // Each chapter should have verses
    if (chapterData && typeof chapterData === 'object') {
      // Look for verse-like structures in the chapter data
      const verseKeys = Object.keys(chapterData);
      
      verseKeys.forEach((verseKey, verseIndex) => {
        const verseData = chapterData[verseKey];
        
        // Try to extract verse text from various possible structures
        let verseText = '';
        let verseNumber = verseIndex + 1;
        
        if (typeof verseData === 'string') {
          verseText = verseData;
        } else if (verseData && typeof verseData === 'object') {
          // Try common field names for verse text
          verseText = verseData.text || verseData.verse || verseData.translation || 
                     verseData.english || verseData.meaning || JSON.stringify(verseData);
          
          // Try to get verse number
          if (verseData.verse) verseNumber = verseData.verse;
          if (verseData.number) verseNumber = verseData.number;
        }
        
        if (verseText && verseText.length > 10) { // Filter out very short entries
          verses.push({
            id: `bhagavad_gita_ch${chapterNumber}_v${verseNumber}`,
            reference: `Chapter ${chapterNumber}, Verse ${verseNumber}`,
            book: 'Bhagavad Gita',
            chapter: chapterNumber,
            verse: verseNumber,
            text: verseText.trim(),
            originalData: verseData // Keep original for debugging
          });
        }
      });
      
      console.log(`    ✅ Chapter ${chapterNumber}: ${verseKeys.length} entries processed`);
    } else {
      console.log(`    ⚠️  Chapter ${chapterNumber}: No data found`);
    }
  });
  
  return verses;
}

async function downloadBhagavadGita() {
  console.log('🚀 Downloading Bhagavad Gita from GitHub...\n');
  
  try {
    console.log('📡 Fetching data from:', BHAGAVAD_GITA_URL);
    const rawData = await makeRequest(BHAGAVAD_GITA_URL);
    
    console.log('✅ Successfully downloaded Bhagavad Gita data');
    console.log(`📊 Raw data size: ${JSON.stringify(rawData).length} characters`);
    console.log(`📊 Data keys: ${Object.keys(rawData).length} (first 10: ${Object.keys(rawData).slice(0, 10).join(', ')})`);
    
    const verses = processBhagavadGita(rawData);
    
    if (verses.length === 0) {
      throw new Error('No verses were processed from Bhagavad Gita data');
    }
    
    const output = {
      religion: 'hinduism',
      source: 'Bhagavad Gita',
      version: 'corrected_translation',
      subset: 'bhagavad-gita',
      verses: verses,
      metadata: {
        title: 'Bhagavad Gita',
        subtitle: 'The Song of God',
        source: 'GitHub Gita Repository',
        totalChapters: Math.max(...verses.map(v => v.chapter)),
        totalVerses: verses.length
      }
    };
    
    const outputPath = path.join(__dirname, '../hinduism-bhagavad-gita-complete.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\n🎉 SUCCESS! Bhagavad Gita downloaded and processed:`);
    console.log(`📖 Total verses: ${verses.length}`);
    console.log(`📚 Total chapters: ${Math.max(...verses.map(v => v.chapter))}`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Show some sample verses
    console.log('\n📝 Sample verses:');
    verses.slice(0, 3).forEach((verse, index) => {
      console.log(`  ${index + 1}. ${verse.reference}: ${verse.text.substring(0, 80)}...`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error downloading Bhagavad Gita:', error.message);
    return false;
  }
}

async function main() {
  const success = await downloadBhagavadGita();
  
  if (success) {
    console.log('\n✅ Bhagavad Gita download complete!');
    console.log('🎯 Your Faith Explorer app now has complete Hindu scripture!');
  } else {
    console.log('\n❌ Bhagavad Gita download failed');
  }
}

main().catch(console.error);
