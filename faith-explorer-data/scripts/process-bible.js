// process-bible.js
const fs = require('fs');

// Read the raw KJV file (note the ../ to go up one folder)
const rawBible = JSON.parse(fs.readFileSync('../raw-files/bible-kjv.json', 'utf8'));

const processed = {
  religion: "christianity",
  source: "King James Version",
  version: "KJV",
  verses: []
};

// Process the Bible data
// The structure is: array of books, each with chapters array
for (let bookIndex = 0; bookIndex < rawBible.length; bookIndex++) {
  const book = rawBible[bookIndex];
  const bookName = book.name;
  
  for (let chapterIndex = 0; chapterIndex < book.chapters.length; chapterIndex++) {
    const chapter = book.chapters[chapterIndex];
    const chapterNum = chapterIndex + 1;
    
    for (let verseIndex = 0; verseIndex < chapter.length; verseIndex++) {
      const verseText = chapter[verseIndex];
      const verseNum = verseIndex + 1;
      
      const id = `${bookName.toLowerCase().replace(/\s/g, '_')}_${chapterNum}_${verseNum}`;
      const reference = `${bookName} ${chapterNum}:${verseNum}`;
      
      processed.verses.push({
        id: id,
        reference: reference,
        book: bookName,
        chapter: chapterNum,
        verse: verseNum,
        text: verseText
      });
    }
  }
}

// Save processed file
fs.writeFileSync(
  '../processed-files/christianity-kjv.json',
  JSON.stringify(processed, null, 2)
);

console.log(`✅ Processed ${processed.verses.length} Bible verses`);
console.log(`📁 Saved to: processed-files/christianity-kjv.json`);
