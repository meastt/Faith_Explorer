const fs = require('fs');

const rawData = JSON.parse(fs.readFileSync('../raw-files/hadith-bukhari.json', 'utf8'));

const processed = {
  religion: "islam",
  source: "Sahih al-Bukhari",
  type: "hadith",
  verses: []
};

// The hadiths are in an array in the main object
rawData.hadiths.forEach(hadith => {
  const id = `bukhari_${hadith.reference.book}_${hadith.reference.hadith}`;
  const reference = `Bukhari ${hadith.reference.book}:${hadith.reference.hadith}`;
  
  processed.verses.push({
    id: id,
    reference: reference,
    book: hadith.reference.book,
    hadith_number: hadith.hadithnumber,
    text: hadith.text
  });
});

fs.writeFileSync('../processed-files/islam-hadith-bukhari.json', JSON.stringify(processed, null, 2));

console.log('✅ Processed ' + processed.verses.length + ' hadiths');
console.log('📁 Saved to: processed-files/islam-hadith-bukhari.json');
