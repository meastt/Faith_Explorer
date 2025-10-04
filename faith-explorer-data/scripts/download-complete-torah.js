// download-complete-torah.js
const fs = require('fs');
const https = require('https');
const path = require('path');

const TORAH_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 }
];

const BASE_URL = 'https://www.sefaria.org/api/texts';

function downloadChapter(book, chapter) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}/${book}.${chapter}`;
    
    https.get(url, (response) => {
      let data = '';
      
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse JSON for ${book}.${chapter}: ${error.message}`));
          }
        } else {
          reject(new Error(`Failed to download ${book}.${chapter}: ${response.statusCode}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadCompleteTorah() {
  console.log('📥 Starting complete Torah download from Sefaria API...');
  
  const rawFilesDir = path.join(__dirname, '../raw-files');
  
  // Ensure raw-files directory exists
  if (!fs.existsSync(rawFilesDir)) {
    fs.mkdirSync(rawFilesDir, { recursive: true });
  }
  
  const allTorahData = [];
  
  try {
    for (const book of TORAH_BOOKS) {
      console.log(`📖 Downloading ${book.name} (${book.chapters} chapters)...`);
      
      for (let chapter = 1; chapter <= book.chapters; chapter++) {
        try {
          console.log(`   📄 Downloading ${book.name} Chapter ${chapter}...`);
          const chapterData = await downloadChapter(book.name, chapter);
          allTorahData.push(chapterData);
          
          // Small delay to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.warn(`   ⚠️  Failed to download ${book.name} Chapter ${chapter}: ${error.message}`);
        }
      }
      
      console.log(`✅ Completed ${book.name}`);
    }
    
    // Save all Torah data as one file
    const outputFile = path.join(rawFilesDir, 'torah-complete.json');
    fs.writeFileSync(outputFile, JSON.stringify(allTorahData, null, 2));
    
    console.log(`\n🎉 Complete Torah download finished!`);
    console.log(`📊 Total chapters downloaded: ${allTorahData.length}`);
    console.log(`📁 Saved to: torah-complete.json`);
    
  } catch (error) {
    console.error('❌ Error downloading Torah:', error.message);
    process.exit(1);
  }
}

// Run the download
downloadCompleteTorah();
