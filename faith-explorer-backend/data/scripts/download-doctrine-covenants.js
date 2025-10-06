const https = require('https');
const fs = require('fs');
const path = require('path');

const DOCTRINE_COVENANTS_URL = 'https://raw.githubusercontent.com/bcbooks/scriptures-json/refs/heads/master/doctrine-and-covenants.json';

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

function processDoctrineAndCovenants(rawData) {
  console.log('📖 Processing Doctrine and Covenants data...');
  
  const verses = [];
  
  if (!rawData.sections || !Array.isArray(rawData.sections)) {
    throw new Error('Invalid Doctrine and Covenants data structure - no sections found');
  }
  
  console.log(`Found ${rawData.sections.length} sections in Doctrine and Covenants`);
  
  rawData.sections.forEach((section, sectionIndex) => {
    console.log(`  📚 Processing Section ${section.section}...`);
    
    if (!section.verses || !Array.isArray(section.verses)) {
      console.log(`    ⚠️  No verses found in Section ${section.section}`);
      return;
    }
    
    section.verses.forEach((verse, verseIndex) => {
      verses.push({
        id: `dandc_section${section.section}_verse${verse.verse}`,
        reference: `D&C ${section.section}:${verse.verse}`,
        book: 'Doctrine and Covenants',
        section: section.section,
        verse: verse.verse,
        text: verse.text.trim()
      });
    });
    
    console.log(`    ✅ Section ${section.section}: ${section.verses.length} verses`);
  });
  
  return verses;
}

async function downloadDoctrineAndCovenants() {
  console.log('🚀 Downloading Doctrine and Covenants from GitHub...\n');
  
  try {
    console.log('📡 Fetching data from:', DOCTRINE_COVENANTS_URL);
    const rawData = await makeRequest(DOCTRINE_COVENANTS_URL);
    
    console.log('✅ Successfully downloaded Doctrine and Covenants data');
    console.log(`📊 Raw data size: ${JSON.stringify(rawData).length} characters`);
    
    const verses = processDoctrineAndCovenants(rawData);
    
    if (verses.length === 0) {
      throw new Error('No verses were processed from Doctrine and Covenants data');
    }
    
    const output = {
      religion: 'christianity',
      source: 'Doctrine and Covenants',
      version: 'complete',
      subset: 'lds',
      verses: verses,
      metadata: {
        title: rawData.title,
        subtitle: rawData.subtitle,
        lastModified: rawData.last_modified,
        totalSections: rawData.sections.length,
        totalVerses: verses.length
      }
    };
    
    const outputPath = path.join(__dirname, '../christianity-doctrine-covenants.json');
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    
    console.log(`\n🎉 SUCCESS! Doctrine and Covenants downloaded and processed:`);
    console.log(`📖 Total verses: ${verses.length}`);
    console.log(`📚 Total sections: ${rawData.sections.length}`);
    console.log(`📁 Saved to: ${outputPath}`);
    console.log(`📊 File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
    
    // Show some sample verses
    console.log('\n📝 Sample verses:');
    verses.slice(0, 3).forEach((verse, index) => {
      console.log(`  ${index + 1}. ${verse.reference}: ${verse.text.substring(0, 80)}...`);
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Error downloading Doctrine and Covenants:', error.message);
    return false;
  }
}

async function main() {
  const success = await downloadDoctrineAndCovenants();
  
  if (success) {
    console.log('\n✅ Doctrine and Covenants download complete!');
    console.log('🎯 Your Faith Explorer app now has complete LDS scripture collection!');
  } else {
    console.log('\n❌ Doctrine and Covenants download failed');
  }
}

main().catch(console.error);
