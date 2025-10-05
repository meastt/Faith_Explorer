# Religious Text Sources & Implementation Plan

## Current Status

### ✅ Complete Texts (Ready)
1. **Christianity (KJV)**: 31,100 verses ✅
2. **Islam (Quran)**: 6,236 verses ✅
3. **Islam (Hadith Bukhari)**: 7,589 verses ✅
4. **Judaism (Torah)**: 5,846 verses ✅

### ⚠️ Incomplete Texts (Need Expansion)

## 1. Hinduism - Bhagavad Gita
**Current**: 4 verses (sample only)
**Target**: 700 verses (18 chapters)

### Source Options:
**RECOMMENDED: DharmicData Repository**
- URL: https://github.com/bhavykhatri/DharmicData
- Files: `bhagavad_gita_chapter_1.json` through `bhagavad_gita_chapter_18.json`
- Download: `https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Srimad%20Bhagavad%20Gita/bhagavad_gita_chapter_{1-18}.json`
- Format: Ready JSON
- License: Open source
- Quality: ⭐⭐⭐⭐⭐

**Alternative: GitHub API**
- URL: https://github.com/gita/bhagavad-gita-api
- Multiple translations available
- Self-hosted FastAPI

### Implementation Steps:
```bash
# Download all 18 chapters
for i in {1..18}; do
  curl -o "bhagavad_gita_ch${i}.json" \
    "https://raw.githubusercontent.com/bhavykhatri/DharmicData/main/Srimad%20Bhagavad%20Gita/bhagavad_gita_chapter_${i}.json"
done

# Merge into single file matching our format
node scripts/process-bhagavad-gita.js
```

---

## 2. Buddhism - Dhammapada
**Current**: 4 verses (sample only)
**Target**: 423 verses (26 chapters)

### Source:
**Pali Canon API**
- API: http://palicanon.codebuckets.com.au/api/
- GitHub: https://github.com/timbrownls20/Pali-Canon
- Format: REST API with JSON responses
- License: Open source
- Quality: ⭐⭐⭐⭐⭐

### Implementation Steps:
```bash
# Fetch all Dhammapada verses via API
curl "http://palicanon.codebuckets.com.au/api/dhammapada/verses" > dhammapada_raw.json

# Process to match our format
node scripts/process-dhammapada.js
```

---

## 3. Sikhism - Guru Granth Sahib
**Current**: 4 verses (sample only)
**Target**: 5,894+ hymns

### Source Options:
**RECOMMENDED: BaniDB API (Khalis Foundation)**
- GitHub: https://github.com/KhalisFoundation/banidb-api
- Most accurate (43,000+ corrections)
- Used by Golden Temple
- Quality: ⭐⭐⭐⭐⭐

**Alternative: GurbaniDB API**
- API: http://api.sikher.com
- GitHub: https://github.com/sikher/gurbanidb
- RESTful API
- License: GPL & Creative Commons

### Implementation Steps:
```bash
# Clone BaniDB
git clone https://github.com/KhalisFoundation/banidb-api.git

# Extract data and convert to our format
node scripts/process-guru-granth-sahib.js
```

---

## 4. Confucianism - Analects
**Current**: 10 verses (sample only)
**Target**: ~500 passages (20 books)

### Source Options:
**RECOMMENDED: Project Gutenberg**
- URL: https://www.gutenberg.org/ebooks/3330
- Format: Plain text (public domain)
- Need to convert to JSON

**Alternative: Chinese Text Project**
- URL: https://ctext.org/analects
- API: https://ctext.org/tools/api (requires subscription)
- Full bilingual support

### Implementation Steps:
```bash
# Download from Project Gutenberg
curl -o analects.txt "https://www.gutenberg.org/files/3330/3330-0.txt"

# Parse and convert to JSON
node scripts/process-analects.js
```

---

## 5. Taoism - Tao Te Ching
**Current**: 10 verses (sample only)
**Target**: 81 chapters

### Source:
**Standard Ebooks (James Legge Translation)**
- URL: https://standardebooks.org/ebooks/laozi/tao-te-ching/james-legge
- Format: EPUB/HTML (need conversion)
- License: Public domain
- Quality: ⭐⭐⭐⭐

**Alternative: Internet Archive**
- URL: https://archive.org/details/laozi_tao-te-ching
- Multiple translations
- EPUB, PDF formats

### Implementation Steps:
```bash
# Download EPUB
curl -o tao-te-ching.epub "https://standardebooks.org/ebooks/laozi/tao-te-ching/james-legge/downloads/laozi_tao-te-ching.epub"

# Convert EPUB to JSON
node scripts/process-tao-te-ching.js
```

---

## 6. Shinto - Kojiki
**Current**: 8 verses (sample only)
**Target**: Complete 3 volumes

### Source:
**Sacred Texts Archive (Chamberlain 1919)**
- URL: https://sacred-texts.com/shi/kj/index.htm
- Format: HTML pages
- License: Public domain
- Quality: ⭐⭐⭐⭐

**Alternative: Internet Archive**
- URL: https://archive.org/details/TheKojikiBasilChamberlainTranslation
- PDF/EPUB formats

### Implementation Steps:
```bash
# Scrape HTML pages
node scripts/download-kojiki.js

# Parse and convert to JSON
node scripts/process-kojiki.js
```

---

## 7. Christianity - Additional Denominations

### Book of Mormon (LDS)
**Source**: Project Gutenberg
- URL: https://www.gutenberg.org/ebooks/17
- Format: Plain text
- Target: ~6,604 verses

### Catholic Bible (Deuterocanonical Books)
**Source**: Various public domain sources
- Tobit, Judith, Wisdom, Sirach, Baruch, 1-2 Maccabees
- Target: ~6,000+ additional verses

### Orthodox Bible
**Source**: Research needed
- Additional books beyond Catholic canon

---

## Frontend Updates Needed

### Update `/Users/michaeleast/Faith_Explorer/faith-explorer-frontend/src/types/index.ts`:

```typescript
// Update verse counts and coverage status:
{
  id: 'hinduism',
  name: 'Hinduism',
  text: 'Bhagavad Gita',
  color: '#ea580c',
  verseCount: 700,  // CHANGE FROM 4
  coverage: 'full',  // CHANGE FROM 'limited'
  subsets: [
    { id: 'bhagavad-gita', name: 'Bhagavad Gita', description: 'Current' },
    { id: 'vedas', name: 'Vedas', description: 'Ancient scriptures', comingSoon: false },  // IF IMPLEMENTED
    ...
  ]
},
{
  id: 'buddhism',
  name: 'Buddhism',
  text: 'Dhammapada',
  color: '#7c3aed',
  verseCount: 423,  // CHANGE FROM 4
  coverage: 'full',  // CHANGE FROM 'limited'
  ...
},
// ... etc for each religion
```

---

## Recommended Implementation Order

### Phase 1 - High Priority (1-2 days):
1. **Bhagavad Gita** - Easiest (ready JSON files)
2. **Dhammapada** - Simple API integration
3. **Guru Granth Sahib** - Well-documented API

### Phase 2 - Medium Priority (2-3 days):
4. **Tao Te Ching** - Need EPUB conversion
5. **Analects** - Need text parsing
6. **Book of Mormon** - Text parsing needed

### Phase 3 - Lower Priority (3-5 days):
7. **Kojiki** - Complex HTML scraping
8. **Catholic/Orthodox Bibles** - Multiple sources
9. **Additional Hindu/Buddhist texts** - Large datasets

---

## Script Templates Needed

Create these in `/Users/michaeleast/Faith_Explorer/faith-explorer-data/scripts/`:

1. `process-bhagavad-gita-complete.js`
2. `process-dhammapada-complete.js`
3. `process-guru-granth-sahib-complete.js`
4. `process-analects-complete.js`
5. `process-tao-te-ching-complete.js`
6. `process-kojiki-complete.js`
7. `process-book-of-mormon.js`

Each script should:
- Download/fetch the source data
- Parse and normalize to our verse format
- Generate JSON file matching structure:
  ```json
  {
    "religion": "...",
    "source": "...",
    "version": "...",
    "verses": [
      {
        "id": "...",
        "reference": "...",
        "text": "...",
        // ... religion-specific fields
      }
    ]
  }
  ```
- Save to `/Users/michaeleast/Faith_Explorer/faith-explorer-backend/data/`

---

## Next Steps

1. Start with Bhagavad Gita (easiest win)
2. Test integration in app
3. Update frontend types
4. Move to Dhammapada
5. Continue through priorities

Would you like me to create the first processing script for the Bhagavad Gita?
