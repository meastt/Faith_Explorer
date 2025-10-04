const fs = require('fs');

const rawQuran = JSON.parse(fs.readFileSync('../raw-files/quran-sahih.json', 'utf8'));

const processed = {
  religion: "islam",
  source: "Quran - English Translation",
  version: "english",
  verses: []
};

// Loop through each Surah (chapter)
rawQuran.forEach(surah => {
  const surahId = surah.id;
  const surahName = surah.transliteration;
  
  // Loop through each verse in the Surah
  surah.verses.forEach(verse => {
    const id = `quran_${surahId}_${verse.id}`;
    const reference = `${surahId}:${verse.id}`;
    
    processed.verses.push({
      id: id,
      reference: reference,
      surah: surahId,
      verse: verse.id,
      surah_name: surahName,
      surah_translation: surah.translation,
      arabic: verse.text,
      text: verse.translation
    });
  });
});

fs.writeFileSync('../processed-files/islam-quran-sahih.json', JSON.stringify(processed, null, 2));

console.log('✅ Processed ' + processed.verses.length + ' Quran verses');
console.log('📁 Saved to: processed-files/islam-quran-sahih.json');
