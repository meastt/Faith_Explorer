const fs = require('fs');
const path = require('path');

// Directory containing all Talmud files
const talmudDir = path.join(__dirname, '../talmud-raw');

// Output file
const outputFile = path.join(__dirname, '../judaism-talmud.json');

console.log('🕍 Starting Talmud merge process...');

// Read all JSON files in the talmud-raw directory
const files = fs.readdirSync(talmudDir).filter(file => file.endsWith('.json'));

console.log(`📚 Found ${files.length} Talmud files to process`);

const allVerses = [];
let processedFiles = 0;
let totalVerses = 0;

// Process each file
files.forEach(file => {
  try {
    const filePath = path.join(talmudDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Extract tractate name from filename or title
    const tractateName = data.title || file.replace('.json', '').replace(' - en - ', ' - ').replace('William Davidson Edition - English', 'WDE');
    
    console.log(`📖 Processing: ${tractateName}`);
    
    // Process the text array
    if (data.text && Array.isArray(data.text)) {
      data.text.forEach((chapter, chapterIndex) => {
        if (Array.isArray(chapter) && chapter.length > 0) {
          chapter.forEach((verse, verseIndex) => {
            if (verse && verse.trim().length > 0) {
              // Clean up the text - remove HTML tags and extra whitespace
              const cleanText = verse
                .replace(/<[^>]*>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
                .replace(/&amp;/g, '&') // Replace HTML entities
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/\s+/g, ' ') // Replace multiple spaces with single space
                .trim();
              
              if (cleanText.length > 10) { // Only include substantial text
                allVerses.push({
                  reference: `${tractateName} ${chapterIndex + 1}:${verseIndex + 1}`,
                  text: cleanText
                });
                totalVerses++;
              }
            }
          });
        }
      });
    }
    
    processedFiles++;
    
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`✅ Processed ${processedFiles} files, extracted ${totalVerses} verses`);

// Create the final JSON structure
const talmudData = {
  religion: "judaism",
  source: "Babylonian Talmud",
  version: "english",
  subset: "talmud",
  description: "Complete Babylonian Talmud including major and minor tractates",
  verseCount: totalVerses,
  tractates: files.length,
  verses: allVerses
};

// Write to output file
fs.writeFileSync(outputFile, JSON.stringify(talmudData, null, 2));

console.log(`🎉 Talmud merge complete!`);
console.log(`📊 Total verses: ${totalVerses}`);
console.log(`📚 Total tractates: ${files.length}`);
console.log(`💾 Saved to: ${outputFile}`);
console.log(`📏 File size: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
